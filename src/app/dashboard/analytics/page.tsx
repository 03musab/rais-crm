'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Package, Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProducts } from '@/lib/products';
import { getSections } from '@/lib/sections';
import { Product, Section } from '@/types';

const CATEGORY_LABELS: Record<string, string> = {
  embroidery: 'Embroidery',
  stitching: 'Stitching',
  logos: 'Logo Work',
  alterations: 'Alterations',
};

export default function AnalyticsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prods, sects] = await Promise.all([
          getProducts(),
          getSections(),
        ]);
        setProducts(prods);
        setSections(sects);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categoryBreakdown = Object.keys(CATEGORY_LABELS).map(cat => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    count: products.filter(p => p.category === cat).length,
    withImage: products.filter(p => p.category === cat && p.image_url).length,
  })).filter(c => c.count > 0);

  const productsWithImages = products.filter(p => p.image_url).length;

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
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-500">Portfolio overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sections</p>
                <p className="text-2xl font-bold">{sections.length}</p>
              </div>
              <BarChart3 className="h-10 w-10 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Package className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">With Images</p>
                <p className="text-2xl font-bold">{productsWithImages}</p>
              </div>
              <Image className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Categories</p>
                <p className="text-2xl font-bold">{categoryBreakdown.length}</p>
              </div>
              <BarChart3 className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryBreakdown.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No products added yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Products</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">With Images</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryBreakdown.map((cat) => (
                    <tr key={cat.category} className="border-b">
                      <td className="px-4 py-3 font-medium">{cat.label}</td>
                      <td className="px-4 py-3 text-right">{cat.count}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-green-600">{cat.withImage}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {products.length === 0 ? (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-900">No products yet</p>
              <p className="text-sm text-blue-700">Start by adding products to see insights about your portfolio.</p>
            </div>
          ) : (
            <>
              {categoryBreakdown.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">
                    {categoryBreakdown.reduce((max, c) => c.count > max.count ? c : max, categoryBreakdown[0]).label} is your largest category
                  </p>
                  <p className="text-sm text-blue-700">
                    With {categoryBreakdown.reduce((max, c) => c.count > max.count ? c : max, categoryBreakdown[0]).count} products.
                  </p>
                </div>
              )}
              {productsWithImages < products.length && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="font-medium text-yellow-900">{products.length - productsWithImages} products need images</p>
                  <p className="text-sm text-yellow-700">Add images to make your portfolio more engaging.</p>
                </div>
              )}
              {productsWithImages === products.length && products.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-900">All products have images</p>
                  <p className="text-sm text-green-700">Your portfolio is complete.</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
