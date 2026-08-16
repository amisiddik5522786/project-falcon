import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '#/components/layout/app-shell.tsx'
import { useEffect, useState } from 'react'
import { Card } from '#/components/ui/card.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Button } from '#/components/ui/button.tsx'
import { Spinner } from '#/components/ui/spinner.tsx'
import getBrowserSupabaseClient from '#/lib/supabase/browser-client.ts'
import { useRef } from 'react'

export const Route = createFileRoute('/profile')({ component: Profile })

function Profile() {
  const supabase = getBrowserSupabaseClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        // Get authenticated user from the browser supabase client
        const { data: userData, error: userErr } = await supabase.auth.getUser()
        if (userErr) {
          // Auth errors are actionable separately
          throw userErr
        }
        const authUser = userData?.user ?? null
        if (!mounted) return

        if (!authUser) {
          setUser(null)
          setLoading(false)
          return
        }

        setUser(authUser)

        // Load profile from public.profiles using RLS via anon client
        const { data, error: pErr } = await supabase
          .from('profiles')
          .select('display_name, avatar_url, role')
          .eq('id', authUser.id)
          .maybeSingle()

        if (pErr) {
          // Surface database/RLS errors directly
          setError(pErr.message ?? String(pErr))
          setProfile(null)
          return
        }

        if (!mounted) return

        if (!data) {
          // No profile row exists for this user. Attempt a safe insert (upsert) without setting role.
          try {
            const insertPayload: any = { id: authUser.id }
            if (authUser.email) insertPayload.display_name = authUser.email

            const { data: inserted, error: insErr } = await supabase
              .from('profiles')
              .insert(insertPayload)
              .select('display_name, avatar_url, role')
              .maybeSingle()

            if (insErr) {
              // Do not silently swallow errors; surface them
              setError(insErr.message ?? String(insErr))
              setProfile(null)
              return
            }

            if (inserted) {
              setProfile(inserted)
              setDisplayName(inserted.display_name ?? '')
              setAvatarUrl((await getAvatarDisplayUrl(inserted.avatar_url)) ?? '')
            } else {
              setProfile(null)
              setError('Profile not found after creation attempt.')
            }
          } catch (err: any) {
            setError(err?.message ?? 'Failed to create profile')
            setProfile(null)
          }
        } else {
          setProfile(data)
          setDisplayName(data.display_name ?? '')
          setAvatarUrl((await getAvatarDisplayUrl(data.avatar_url)) ?? '')
        }
      } catch (err: any) {
        setError(err?.message ?? 'Failed to load profile')
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [supabase])

  async function handleSave(e: any) {
    e.preventDefault()
    if (!user) return setError('Not authenticated')
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate avatar URL (must be http/https or empty)
      if (avatarUrl && !isValidHttpUrl(avatarUrl)) {
        throw new Error('Avatar URL must be a valid http(s) URL')
      }

      // Optimistically update UI
      setProfile((prev: any) => ({ ...(prev ?? {}), display_name: displayName || null, avatar_url: avatarUrl || null }))

      const { error: updErr } = await supabase
        .from('profiles')
        .update({ display_name: displayName || null, avatar_url: avatarUrl || null })
        .eq('id', user.id)

      if (updErr) {
        // Revert optimistic update by refetching
        const { data: refetchErrData } = await supabase.from('profiles').select('display_name, avatar_url, role').eq('id', user.id).maybeSingle()
        setProfile(refetchErrData ?? null)
        throw updErr
      }

      // Re-fetch to confirm persistence and to get role
      const { data: refreshed } = await supabase.from('profiles').select('display_name, avatar_url, role').eq('id', user.id).maybeSingle()
      if (refreshed) {
        setProfile(refreshed)
        setDisplayName(refreshed.display_name ?? '')
        setAvatarUrl((await getAvatarDisplayUrl(refreshed.avatar_url)) ?? '')
      }

      setSuccess('Profile updated')

      // Notify other UI (top-bar) to refresh
      try {
        window.dispatchEvent(new CustomEvent('profile:updated', { detail: { id: user.id } }))
      } catch (e) {
        // ignore
      }
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  async function getAvatarDisplayUrl(path: string | null | undefined) {
    if (!path || path.startsWith('http')) return path ?? null

    const { data, error } = await supabase.storage
      .from('avatars')
      .createSignedUrl(path, 60 * 60)

    if (error) return null
    return data?.signedUrl ?? null
  }

  function isValidHttpUrl(str: string) {
    try {
      const u = new URL(str)
      return u.protocol === 'http:' || u.protocol === 'https:'
    } catch (_) {
      return false
    }
  }

  function handleFileChange(e: any) {
    const f: File | null = e.target.files?.[0] ?? null
    if (!f) return
    // validate type
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(f.type)) {
      setError('Only JPG, PNG or WebP images are allowed')
      return
    }
    // validate size (2MB)
    const maxBytes = 2 * 1024 * 1024
    if (f.size > maxBytes) {
      setError('Image must be 2MB or smaller')
      return
    }

    setError(null)
    setSelectedFile(f)
    try {
      const url = URL.createObjectURL(f)
      setPreviewUrl(url)
    } catch (e) {
      setPreviewUrl(null)
    }
  }

  async function handleUpload() {
    if (!user) return setError('Not authenticated')
    if (!selectedFile) return setError('No file selected')
    setUploading(true)
    setError(null)

    try {
      const ext = selectedFile.name.split('.').pop()?.split('?')[0]?.toLowerCase() ?? 'png'
      const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'png'
      const fileName = `${crypto.randomUUID()}.${safeExt}`
      const path = `${user.id}/${fileName}`

      const { error: upErr } = await supabase.storage.from('avatars').upload(path, selectedFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: selectedFile.type,
      })

      if (upErr) throw upErr

      const { data: signedData, error: signedErr } = await supabase.storage
        .from('avatars')
        .createSignedUrl(path, 60 * 60)

      if (signedErr || !signedData?.signedUrl) {
        await supabase.storage.from('avatars').remove([path])
        throw signedErr ?? new Error('Failed to create avatar URL')
      }

      const { error: updErr } = await supabase
        .from('profiles')
        .update({ avatar_url: path })
        .eq('id', user.id)

      if (updErr) {
        await supabase.storage.from('avatars').remove([path])
        throw updErr
      }

      setProfile((prev: any) => ({ ...(prev ?? {}), avatar_url: path }))
      setAvatarUrl(path)
      setSelectedFile(null)
      setPreviewUrl(signedData.signedUrl)
      setSuccess('Avatar uploaded')

      try {
        window.dispatchEvent(new CustomEvent('profile:updated', { detail: { id: user.id } }))
      } catch {}
    } catch (err: any) {
      setError(err?.message ?? 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleRemovePhoto() {
    if (!user) return setError('Not authenticated')
    setError(null)
    setUploading(true)

    try {
      const currentPath = profile?.avatar_url

      if (currentPath && !currentPath.startsWith('http')) {
        const { error: removeErr } = await supabase.storage.from('avatars').remove([currentPath])
        if (removeErr) throw removeErr
      }

      const { error: updErr } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id)

      if (updErr) throw updErr

      setProfile((prev: any) => ({ ...(prev ?? {}), avatar_url: null }))
      setAvatarUrl('')
      setPreviewUrl(null)
      setSuccess('Avatar removed')

      try {
        window.dispatchEvent(new CustomEvent('profile:updated', { detail: { id: user.id } }))
      } catch {}
    } catch (err: any) {
      setError(err?.message ?? 'Failed to remove avatar')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <AppShell title="Profile Settings" description="Manage your account settings.">
        <div className="rounded-[24px] border border-border/80 bg-card/70 p-5 shadow-sm md:col-span-2">
          <Card>
            <Spinner label="Loading profile" />
          </Card>
        </div>
      </AppShell>
    )
  }

  if (!user) {
    return (
      <AppShell title="Profile Settings" description="Manage your account settings.">
        <div className="rounded-[24px] border border-border/80 bg-card/70 p-5 shadow-sm md:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold">Not signed in</h3>
            <p className="mt-2 text-sm text-muted-foreground">Please sign in to manage your profile.</p>
          </Card>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell title="Profile Settings" description="Manage your account settings.">
      <div className="rounded-[24px] border border-border/80 bg-card/70 p-5 shadow-sm md:col-span-2">
        <Card>
          <h3 className="text-lg font-semibold">Profile</h3>
          <p className="mt-2 text-sm text-muted-foreground">Manage your account information.</p>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          {success && <p className="mt-4 text-sm text-green-500">{success}</p>}

          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-foreground">{user.email ?? '—'}</p>
            </div>

            <div>
              <label className="text-sm font-medium">Display name</label>
              <Input value={displayName} onChange={(e: any) => setDisplayName(e.target.value)} placeholder="Your display name" />
            </div>

            <div>
              <label className="text-sm font-medium">Profile photo</label>
              <div className="mt-2 flex items-center gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-full bg-muted/30">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="preview" className="h-full w-full object-cover" />
                  ) : profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">No photo</div>
                  )}
                </div>

                <div className="flex flex-col">
                  <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} className="hidden" />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>Choose file</Button>
                    <Button variant="secondary" onClick={handleUpload} disabled={uploading || !selectedFile}>
                      {uploading ? <Spinner label="Uploading" /> : 'Upload Photo'}
                    </Button>
                    <Button variant="ghost" onClick={handleRemovePhoto} disabled={uploading || !profile?.avatar_url}>Remove Photo</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Accepted: JPG, PNG, WebP. Max size: 2MB. Enter a direct image URL below to use a remote image.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Avatar URL</label>
              <Input value={avatarUrl} onChange={(e: any) => setAvatarUrl(e.target.value)} placeholder="https://…" />
            </div>

            <div>
              <label className="text-sm font-medium">Role</label>
              <p className="text-sm text-muted-foreground">{profile?.role ?? '—'}</p>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? <Spinner label="Saving" /> : 'Save changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppShell>
  )
}
