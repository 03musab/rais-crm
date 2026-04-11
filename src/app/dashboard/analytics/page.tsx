'use client';

import { BarChart3, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const sectionStats = [
  { name: 'Homepage', products: 8, lowStock: 1, inventory: 245 },
  { name: 'Featured', products: 12, lowStock: 2, inventory: 412 },
  { name: 'Summer Sale', products: 5, lowStock: 0, inventory: 89 },
  { name: 'New Arrivals', products: 15, lowStock: 1, inventory: 178 },
];

export default function AnalyticsPage() {
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
                <p className="text-2xl font-bold">4</p>
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
                <p className="text-2xl font-bold">40</p>
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
                <p className="text-2xl font-bold">924</p>
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
                <p className="text-2xl font-bold">4</p>
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
                {sectionStats.map((section) => (
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="font-medium text-blue-900">Homepage section has the highest inventory</p>
            <p className="text-sm text-blue-700">With 245 items, the homepage is well-stocked for customer visibility.</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="font-medium text-yellow-900">Featured section needs attention</p>
            <p className="text-sm text-yellow-700">2 products are running low on stock in this section.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="font-medium text-green-900">Summer Sale is well managed</p>
            <p className="text-sm text-green-700">All products in the Summer Sale section have healthy stock levels.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
