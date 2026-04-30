import { NextResponse } from 'next/server';
import { getActiveServices } from '@/lib/services';

export async function GET() {
  try {
    const services = await getActiveServices();
    const mapped = services.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      badge: s.badge,
      icon: s.icon,
      imageUrl: s.image_url,
      whatsappMessage: s.whatsapp_message,
      sort_order: s.sort_order,
    }));
    return NextResponse.json(mapped, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
