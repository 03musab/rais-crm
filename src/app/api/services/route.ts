import { NextResponse } from 'next/server';
import { getServices } from '@/lib/services';

export async function GET() {
  try {
    const services = await getServices();
    const mapped = services.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      imageUrl: s.image_url,
      badge: s.badge,
      icon: s.icon,
      whatsappMessage: s.whatsapp_message,
      displayOrder: s.display_order,
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