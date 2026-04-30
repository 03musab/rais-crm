import { getPortfolioItems } from '@/lib/portfolio';
import { PortfolioCategory } from '@/types';
import Image from 'next/image';

const categoryLabels: Record<PortfolioCategory, string> = {
  embroidery: 'Embroidery Work',
  stitching: 'Stitching',
  logos: 'Logo Work',
  alterations: 'Alterations',
};

export default async function GalleryPage() {
  const items = await getPortfolioItems();

  const grouped = items.reduce((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<PortfolioCategory, typeof items>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="container mx-auto flex h-16 items-center px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-black dark:bg-white" />
            <span className="font-semibold text-lg">RAIS Embroidery</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Recent Masterpieces</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Showcasing our finest embroidery and stitching work
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No masterpieces yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-16">
            {Object.entries(grouped).map(([category, items]) => (
              <section key={category}>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  {categoryLabels[category as PortfolioCategory]}
                  <span className="text-sm font-normal text-gray-500">({items.length})</span>
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((item) => (
                    <div key={item.id} className="group relative overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-900">
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={item.image_url || item.imageUrl || ''}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <span className="text-sm text-gray-500 capitalize">{category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 py-8 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; 2026 RAIS Embroidery. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
