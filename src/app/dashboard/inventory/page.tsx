'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/products';
import { getAlerts } from '@/lib/alerts';
import { InventoryAlert, Product } from '@/types';

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prods, alrts] = await Promise.all([
          getProducts(),
          getAlerts(),
        ]);
        setProducts(prods);
        setAlerts(alrts);
      } catch (error) {
        console.error('Error loading inventory:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const lowStockItems = products.filter(p => (p.inventory || 0) > 0 && (p.inventory || 0) <= (p.low_stock_threshold || 5));
  const outOfStockItems = products.filter(p => (p.inventory || 0) === 0);
  const wellStocked = products.filter(p => (p.inventory || 0) > (p.low_stock_threshold || 5));

  const stats = [
    { name: 'Total Products', value: loading ? '...' : String(products.length), icon: Package, color: 'text-blue-600' },
    { name: 'Low Stock', value: loading ? '...' : String(lowStockItems.length), icon: AlertTriangle, color: 'text-yellow-600' },
    { name: 'Out of Stock', value: loading ? '...' : String(outOfStockItems.length), icon: TrendingDown, color: 'text-red-600' },
    { name: 'Well Stocked', value: loading ? '...' : String(wellStocked.length), icon: TrendingUp, color: 'text-green-600' },
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
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {outOfStockItems.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">No out of stock items</p>
              ) : (
                outOfStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.status}</p>
                    </div>
                    <Badge variant="destructive">Out of Stock</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-yellow-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Low Stock ({lowStockItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">All items well stocked</p>
              ) : (
                lowStockItems.map((item) => {
                  const threshold = item.low_stock_threshold || 5;
                  const inventory = item.inventory || 0;
                  return (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">${(item.price || 0).toFixed(2)}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-2 flex-1 max-w-[120px] bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-500 rounded-full"
                              style={{ width: `${Math.min((inventory / threshold) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {inventory} / {threshold}
                          </span>
                        </div>
                      </div>
                      <Badge variant="warning">{inventory} left</Badge>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
