import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, LayoutGrid, Boxes, AlertTriangle, TrendingUp } from 'lucide-react';

const stats = [
  { name: 'Total Products', value: '0', icon: Package, color: 'text-blue-600' },
  { name: 'Active Sections', value: '0', icon: LayoutGrid, color: 'text-green-600' },
  { name: 'Low Stock Items', value: '0', icon: AlertTriangle, color: 'text-yellow-600' },
  { name: 'Total Inventory', value: '0', icon: Boxes, color: 'text-purple-600' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome to your product management dashboard</p>
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
              Get started by adding your first products and organizing them into sections.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">No recent activity</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
