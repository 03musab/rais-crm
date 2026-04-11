'use client';

import { AlertTriangle, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const lowStockItems = [
  { id: '1', name: 'Smart Watch Pro', sku: 'SWP-001', inventory: 8, threshold: 10, variant: 'Black / Large' },
  { id: '2', name: 'Wireless Earbuds', sku: 'WE-003', inventory: 3, threshold: 15, variant: 'White' },
  { id: '3', name: 'USB-C Cable', sku: 'USB-C-01', inventory: 5, threshold: 20, variant: '2m' },
];

const outOfStockItems = [
  { id: '4', name: 'Bluetooth Speaker', sku: 'BS-002', variant: 'Blue' },
  { id: '5', name: 'Phone Case', sku: 'PC-015', variant: 'iPhone 15 Pro Max' },
];

const stats = [
  { name: 'Total Products', value: '156', icon: Package, color: 'text-blue-600' },
  { name: 'Low Stock', value: '12', icon: AlertTriangle, color: 'text-yellow-600' },
  { name: 'Out of Stock', value: '5', icon: TrendingDown, color: 'text-red-600' },
  { name: 'Well Stocked', value: '139', icon: TrendingUp, color: 'text-green-600' },
];

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-gray-500">Monitor stock levels and alerts</p>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Out of Stock ({outOfStockItems.length})
            </CardTitle>
            <Button variant="outline" size="sm">Restock Now</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {outOfStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.sku} • {item.variant}</p>
                  </div>
                  <Badge variant="destructive">Out of Stock</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-yellow-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Low Stock ({lowStockItems.length})
            </CardTitle>
            <Button variant="outline" size="sm">Reorder</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.sku} • {item.variant}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-2 flex-1 max-w-[120px] bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 rounded-full"
                          style={{ width: `${(item.inventory / item.threshold) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {item.inventory} / {item.threshold}
                      </span>
                    </div>
                  </div>
                  <Badge variant="warning">{item.inventory} left</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
