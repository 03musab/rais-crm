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
    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}