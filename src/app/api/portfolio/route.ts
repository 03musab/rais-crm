import { NextResponse } from 'next/server';
import { getPortfolioItems } from '@/lib/portfolio';
import { PortfolioCategory } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as PortfolioCategory | null;
    
    if (category && !['embroidery', 'stitching', 'logos', 'alterations'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const portfolio = await getPortfolioItems(category || undefined);
    // Map to match website expected format
    const mapped = portfolio.map(p => ({
      id: p.id,
      imageUrl: p.image_url,
      title: p.title,
      category: p.category,
      displayOrder: p.display_order,
    }));
    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}