import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package, LayoutGrid, BarChart3, Boxes } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-black dark:bg-white" />
            <span className="font-semibold text-lg">RAIS CRM</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            Product Management Made Simple
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-400">
            Organize your products across sections, track inventory, and analyze performance — all in one place.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg">View Demo</Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Package, title: 'Product Management', desc: 'Manage products with variants, images, and pricing' },
            { icon: LayoutGrid, title: 'Section Builder', desc: 'Organize products into Homepage, Featured, and more' },
            { icon: Boxes, title: 'Inventory Tracking', desc: 'Track stock levels with low-stock alerts' },
            { icon: BarChart3, title: 'Analytics', desc: 'View section performance and insights' },
          ].map((feature) => (
            <div key={feature.title} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <feature.icon className="h-10 w-10 text-black dark:text-white" />
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-200 py-8 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; 2026 RAIS CRM. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
