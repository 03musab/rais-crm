'use client';

import { useEffect, useState } from 'react';
import { Package, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getProducts } from '@/lib/products';
import { Product } from '@/types';

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const prods = await getProducts();
        setProducts(prods);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const productsWithImages = products.filter(p => p.image_url);
  const productsWithoutImages = products.filter(p => !p.image_url);
  const productsWithDescriptions = products.filter(p => p.description);

  const stats = [
    { name: 'Total Products', value: loading ? '...' : String(products.length), icon: Package, color: 'text-blue-600' },
    { name: 'With Images', value: loading ? '...' : String(productsWithImages.length), icon: Image, color: 'text-green-600' },
    { name: 'Missing Images', value: loading ? '...' : String(productsWithoutImages.length), icon: AlertCircle, color: 'text-yellow-600' },
    { name: 'With Descriptions', value: loading ? '...' : String(productsWithDescriptions.length), icon: CheckCircle, color: 'text-purple-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Portfolio Health</h1>
        <p className="text-gray-500">Check product completeness for the website</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-10 w-10 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-yellow-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Missing Images ({productsWithoutImages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productsWithoutImages.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">All products have images</p>
              ) : (
                productsWithoutImages.slice(0, 10).map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <Badge variant="warning">No Image</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Complete Products ({productsWithImages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productsWithImages.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">No complete products yet</p>
              ) : (
                productsWithImages.slice(0, 10).map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100">
                        <img src={product.image_url!} alt={product.title} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{product.title}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                    </div>
                    <Badge variant="success">Ready</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
