'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, LayoutGrid, AlertTriangle, TrendingUp, MessageSquare, Star } from 'lucide-react';
import { getDashboardStats } from '@/lib/products';
import { getContacts } from '@/lib/contacts';
import { getReviews } from '@/lib/reviews';

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalProducts: 0, productsWithImages: 0, missingImages: 0 });
  const [contactCount, setContactCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashboardStats, contacts, reviews] = await Promise.all([
          getDashboardStats(),
          getContacts(),
          getReviews(),
        ]);
        setStats(dashboardStats);
        setContactCount(contacts.length);
        setReviewCount(reviews.length);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const allStats = [
    { name: 'Total Products', value: loading ? '...' : String(stats.totalProducts), icon: Package, color: 'text-blue-600' },
    { name: 'With Images', value: loading ? '...' : String(stats.productsWithImages), icon: LayoutGrid, color: 'text-green-600' },
    { name: 'Missing Images', value: loading ? '...' : String(stats.missingImages), icon: AlertTriangle, color: 'text-yellow-600' },
    { name: 'Contact Submissions', value: loading ? '...' : String(contactCount), icon: MessageSquare, color: 'text-cyan-600' },
    { name: 'Reviews', value: loading ? '...' : String(reviewCount), icon: Star, color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome to your product management dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allStats.map((stat) => (
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-500">
              Navigate to Products to add your first items, or check Sections to organize your homepage layout.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              {loading ? 'Loading...' : stats.totalProducts === 0 ? 'No products added yet. Get started by creating your first product.' : `${stats.totalProducts} products — ${stats.productsWithImages} with images`}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
