'use client';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProducts } from '@/lib/products';
import { getSections } from '@/lib/sections';
import { getAlerts } from '@/lib/alerts';
import { Product, Section } from '@/types';

export default function AnalyticsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prods, sects, alrts] = await Promise.all([
          getProducts(),
          getSections(),
          getAlerts(),
        ]);
        setProducts(prods);
        setSections(sects);
        setAlerts(alrts);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalInventory = products.reduce((sum, p) => sum + (p.inventory || 0), 0);
  const lowStockCount = products.filter(p => (p.inventory || 0) <= (p.low_stock_threshold || 5) && (p.inventory || 0) > 0).length;

  const sectionOverview = sections.map(section => {
    const sectionProducts = products.filter(p => p.section_id === section.id);
    const sectionInventory = sectionProducts.reduce((sum, p) => sum + (p.inventory || 0), 0);
    const sectionLowStock = sectionProducts.filter(p => (p.inventory || 0) <= (p.low_stock_threshold || 5)).length;
    return {
      name: section.name,
      products: sectionProducts.length,
      inventory: sectionInventory,
      lowStock: sectionLowStock,
    };
  });

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
        <p className="text-gray-500">Section performance overview</p>
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
                <p className="text-sm font-medium text-gray-500">Total Inventory</p>
                <p className="text-2xl font-bold">{totalInventory}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                <p className="text-2xl font-bold">{lowStockCount}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {sectionOverview.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No sections created yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Section</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Products</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Total Inventory</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Low Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionOverview.map((section) => (
                    <tr key={section.name} className="border-b">
                      <td className="px-4 py-3 font-medium">{section.name}</td>
                      <td className="px-4 py-3 text-right">{section.products}</td>
                      <td className="px-4 py-3 text-right">{section.inventory}</td>
                      <td className="px-4 py-3 text-right">
                        {section.lowStock > 0 ? (
                          <span className="text-yellow-600">{section.lowStock}</span>
                        ) : (
                          <span className="text-green-600">0</span>
                        )}
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
              <p className="text-sm text-blue-700">Start by adding products to see insights about your inventory.</p>
            </div>
          ) : (
            <>
              {sectionOverview.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">{sectionOverview.reduce((max, s) => s.inventory > max.inventory ? s : max, sectionOverview[0]).name} has the highest inventory</p>
                  <p className="text-sm text-blue-700">
                    With {sectionOverview.reduce((max, s) => s.inventory > max.inventory ? s : max, sectionOverview[0]).inventory} items across {sectionOverview.reduce((max, s) => s.inventory > max.inventory ? s : max, sectionOverview[0]).products} products.
                  </p>
                </div>
              )}
              {lowStockCount > 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="font-medium text-yellow-900">{lowStockCount} products need attention</p>
                  <p className="text-sm text-yellow-700">These products are running low on stock and may need reordering.</p>
                </div>
              )}
              {lowStockCount === 0 && products.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-900">All products are well stocked</p>
                  <p className="text-sm text-green-700">No low stock alerts at this time.</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
