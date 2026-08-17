import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { AppShell } from '#/components/layout/app-shell.tsx'
import { Button } from '#/components/ui/button.tsx'
import { Card } from '#/components/ui/card.tsx'
import getBrowserSupabaseClient from '#/lib/supabase/browser-client.ts'

type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  sku: string | null
  price: number
  sale_price: number | null
  stock: number
  status: 'active' | 'draft' | 'archived'
  image_url: string | null
  created_at: string
  updated_at: string
}

export const Route = createFileRoute('/products')({
  component: Products,
})

function Products() {
  const supabase = getBrowserSupabaseClient()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadProducts() {
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('products')
      .select(
        'id, name, slug, description, sku, price, sale_price, stock, status, image_url, created_at, updated_at',
      )
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      setProducts([])
    } else {
      setProducts((data ?? []) as Product[])
    }

    setLoading(false)
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  return (
    <AppShell
      title="Products"
      description="Manage your product catalog."
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {products.length} product{products.length === 1 ? '' : 's'}
          </p>
        </div>

        <Button onClick={() => void loadProducts()}>
          Refresh
        </Button>
      </div>

      {loading && (
        <Card className="mt-5 p-6">
          <p className="text-sm text-muted-foreground">
            Loading products...
          </p>
        </Card>
      )}

      {error && (
        <Card className="mt-5 border-destructive/40 p-6">
          <p className="font-medium text-destructive">
            Failed to load products
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>
        </Card>
      )}

      {!loading && !error && products.length === 0 && (
        <Card className="mt-5 p-8 text-center">
          <h2 className="text-lg font-semibold">No products yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your product catalog is currently empty.
          </p>
        </Card>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-muted">
                  <span className="text-sm text-muted-foreground">
                    No image
                  </span>
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{product.name}</h2>
                    {product.sku && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        SKU: {product.sku}
                      </p>
                    )}
                  </div>

                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
                    {product.status}
                  </span>
                </div>

                {product.description && (
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                    {product.description}
                  </p>
                )}

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    {product.sale_price !== null ? (
                      <>
                        <p className="text-sm text-muted-foreground line-through">
                          ${product.price.toFixed(2)}
                        </p>
                        <p className="text-lg font-semibold">
                          ${product.sale_price.toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-semibold">
                        ${product.price.toFixed(2)}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Stock: {product.stock}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  )
}
