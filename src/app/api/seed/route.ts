import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const services = [
  {
    title: "Custom Embroidery",
    description: "Bring your unique ideas to life with our bespoke embroidery service. We work on any fabric — from casual wear to bridal pieces.",
    image_url: "https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.42%20PM.jpeg",
    badge: "Popular",
    icon: "star",
    whatsapp_message: "Hi! I'm interested in Custom Embroidery. Can you tell me more?",
    display_order: 1,
  },
  {
    title: "Logo Embroidery",
    description: "Professional, high-quality logo stitching for corporate uniforms, caps, bags, and branded merchandise. Bulk orders welcome.",
    image_url: "https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.45%20PM.jpeg",
    badge: "Corporate",
    icon: "building",
    whatsapp_message: "Hi! I'm interested in Logo Embroidery. Can you tell me more?",
    display_order: 2,
  },
  {
    title: "Handcrafted Designs",
    description: "Traditional hand-embroidery techniques — mirror work, zardozi, thread art — adding an artistic and personal touch to every piece.",
    image_url: "https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.46%20PM.jpeg",
    badge: "Artisan",
    icon: "hands",
    whatsapp_message: "Hi! I'm interested in Handcrafted Designs. Can you tell me more?",
    display_order: 3,
  },
  {
    title: "Dress Stitching",
    description: "Custom tailoring for dresses, salwar suits, and churidars — ensuring a perfect fit and flattering silhouette tailored just for you.",
    image_url: "https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.46%20PM%20(2).jpeg",
    badge: "Popular",
    icon: "tshirt",
    whatsapp_message: "Hi! I'm interested in Dress Stitching. Can you tell me more?",
    display_order: 4,
  },
  {
    title: "Alteration Services",
    description: "Expert resizing, hemming, and adjustments to give your existing wardrobe a perfect new fit and a fresh lease on life.",
    image_url: "https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.46%20PM%20(3).jpeg",
    badge: null,
    icon: "ruler",
    whatsapp_message: "Hi! I'm interested in Alteration Services. Can you tell me more?",
    display_order: 5,
  },
  {
    title: "Uniform Embroidery",
    description: "Durable and consistent embroidery solutions for school uniforms, staff shirts, and institutional garments at competitive bulk rates.",
    image_url: "https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.47%20PM.jpeg",
    badge: "Bulk",
    icon: "user-tie",
    whatsapp_message: "Hi! I'm interested in Uniform Embroidery. Can you tell me more?",
    display_order: 6,
  },
  {
    title: "Machine Embroidery",
    description: "Precision machine work ideal for intricate patterns, repeated designs, and larger volume orders with consistent quality throughout.",
    image_url: "https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.47%20PM%20(1).jpeg",
    badge: null,
    icon: "cog",
    whatsapp_message: "Hi! I'm interested in Machine Embroidery. Can you tell me more?",
    display_order: 7,
  },
];

const portfolioItems = [
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.42 PM.jpeg", title: "Embroidery Work", category: "embroidery", display_order: 1 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.45 PM (1).jpeg", title: "Stitching Work", category: "stitching", display_order: 2 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.45 PM.jpeg", title: "Logo Embroidery", category: "logos", display_order: 3 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.46 PM (1).jpeg", title: "Alteration Work", category: "alterations", display_order: 4 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.46 PM (2).jpeg", title: "Hand Embroidery", category: "embroidery", display_order: 5 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.46 PM (3).jpeg", title: "Dress Stitching", category: "stitching", display_order: 6 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.46 PM.jpeg", title: "Corporate Logo", category: "logos", display_order: 7 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.47 PM (1).jpeg", title: "Saree Fall & Pico", category: "alterations", display_order: 8 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.47 PM.jpeg", title: "Floral Embroidery", category: "embroidery", display_order: 9 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.48 PM (1).jpeg", title: "Custom Stitching", category: "stitching", display_order: 10 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.48 PM.jpeg", title: "Uniform Logo", category: "logos", display_order: 11 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.49 PM (1).jpeg", title: "Sleeve Adjustment", category: "alterations", display_order: 12 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.49 PM.jpeg", title: "Thread Work", category: "embroidery", display_order: 13 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.50 PM.jpeg", title: "Salwar Stitching", category: "stitching", display_order: 14 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.51 PM.jpeg", title: "Cap Logo", category: "logos", display_order: 15 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.52 PM.jpeg", title: "Hemming Work", category: "alterations", display_order: 16 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.54 PM.jpeg", title: "Mirror Work", category: "embroidery", display_order: 17 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.56 PM.jpeg", title: "Ladies Suit", category: "stitching", display_order: 18 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.09.59 PM.jpeg", title: "Brand Embroidery", category: "logos", display_order: 19 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.10.01 PM.jpeg", title: "Pico Work", category: "alterations", display_order: 20 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.10.04 PM.jpeg", title: "Zardozi Work", category: "embroidery", display_order: 21 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.10.06 PM.jpeg", title: "Bridal Stitching", category: "stitching", display_order: 22 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.10.07 PM.jpeg", title: "School Logo", category: "logos", display_order: 23 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.10.08 PM.jpeg", title: "Resize Work", category: "alterations", display_order: 24 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.10.10 PM.jpeg", title: "Artisan Embroidery", category: "embroidery", display_order: 25 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.10.18 PM.jpeg", title: "Evening Wear", category: "stitching", display_order: 26 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.10.20 PM (1).jpeg", title: "Staff Logo", category: "logos", display_order: 27 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.10.20 PM (2).jpeg", title: "Jacket Alteration", category: "alterations", display_order: 28 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.10.20 PM.jpeg", title: "Sequin Embroidery", category: "embroidery", display_order: 29 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.10.21 PM (1).jpeg", title: "Churidar Stitching", category: "stitching", display_order: 30 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.10.21 PM (2).jpeg", title: "Bag Logo", category: "logos", display_order: 31 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.10.21 PM (3).jpeg", title: "Saree Finishing", category: "alterations", display_order: 32 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.10.21 PM.jpeg", title: "Needlework", category: "embroidery", display_order: 33 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.10.22 PM.jpeg", title: "Custom Dress", category: "stitching", display_order: 34 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.10.24 PM.jpeg", title: "Tshirt Logo", category: "logos", display_order: 35 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.11.51 PM (1).jpeg", title: "Precision Alteration", category: "alterations", display_order: 36 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.11.51 PM (2).jpeg", title: "Silk Embroidery", category: "embroidery", display_order: 37 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.11.51 PM.jpeg", title: "Fine Stitching", category: "stitching", display_order: 38 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.11.52 PM (1).jpeg", title: "Corporate Embroidery", category: "logos", display_order: 39 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.11.52 PM (2).jpeg", title: "Hemline Work", category: "alterations", display_order: 40 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.11.52 PM (3).jpeg", title: "Ethnic Embroidery", category: "embroidery", display_order: 41 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.11.52 PM.jpeg", title: "Salwar Kameez", category: "stitching", display_order: 42 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.11.54 PM.jpeg", title: "Uniform Embroidery", category: "logos", display_order: 43 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.11.56 PM.jpeg", title: "Waist Alteration", category: "alterations", display_order: 44 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.00 PM.jpeg", title: "Decorative Stitch", category: "embroidery", display_order: 45 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.02 PM.jpeg", title: "Lehenga Stitching", category: "stitching", display_order: 46 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.05 PM.jpeg", title: "Logo Patch", category: "logos", display_order: 47 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.07 PM.jpeg", title: "Blouse Alteration", category: "alterations", display_order: 48 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.09 PM.jpeg", title: "Zari Embroidery", category: "embroidery", display_order: 49 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.11 PM.jpeg", title: "Anarkali Stitching", category: "stitching", display_order: 50 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.14 PM.jpeg", title: "Sports Logo", category: "logos", display_order: 51 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.16 PM.jpeg", title: "Dupatta Finishing", category: "alterations", display_order: 52 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.20 PM.jpeg", title: "Traditional Embroidery", category: "embroidery", display_order: 53 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.22 PM.jpeg", title: "Indo-Western Stitch", category: "stitching", display_order: 54 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.23 PM.jpeg", title: "Jacket Logo", category: "logos", display_order: 55 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.24 PM (1).jpeg", title: "Kurti Alteration", category: "alterations", display_order: 56 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.24 PM.jpeg", title: "Handcraft Work", category: "embroidery", display_order: 57 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.25 PM (1).jpeg", title: "Palazzo Stitching", category: "stitching", display_order: 58 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.25 PM.jpeg", title: "Hoodie Logo", category: "logos", display_order: 59 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.28 PM (1).jpeg", title: "Belt Alteration", category: "alterations", display_order: 60 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.28 PM.jpeg", title: "Kashmiri Embroidery", category: "embroidery", display_order: 61 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.29 PM.jpeg", title: "Saree Blouse Stitch", category: "stitching", display_order: 62 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.30 PM.jpeg", title: "Apron Logo", category: "logos", display_order: 63 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.31 PM (1).jpeg", title: "Cuff Alteration", category: "alterations", display_order: 64 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.31 PM.jpeg", title: "Phulkari Work", category: "embroidery", display_order: 65 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.32 PM.jpeg", title: "Kids Stitching", category: "stitching", display_order: 66 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.34 PM.jpeg", title: "Polo Logo", category: "logos", display_order: 67 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.35 PM.jpeg", title: "Trouser Alteration", category: "alterations", display_order: 68 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.36 PM.jpeg", title: "Bead Work", category: "embroidery", display_order: 69 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.38 PM.jpeg", title: "Gown Stitching", category: "stitching", display_order: 70 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.41 PM.jpeg", title: "Patch Logo", category: "logos", display_order: 71 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.42 PM (1).jpeg", title: "Lace Alteration", category: "alterations", display_order: 72 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.42 PM (2).jpeg", title: "Chikankari Work", category: "embroidery", display_order: 73 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.42 PM.jpeg", title: "Kurti Stitching", category: "stitching", display_order: 74 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.45 PM (1).jpeg", title: "Bag Logo Embroidery", category: "logos", display_order: 75 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.45 PM (2).jpeg", title: "Collar Alteration", category: "alterations", display_order: 76 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.45 PM.jpeg", title: "Aari Work", category: "embroidery", display_order: 77 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.46 PM.jpeg", title: "Party Wear Stitch", category: "stitching", display_order: 78 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.48 PM.jpeg", title: "Name Embroidery", category: "logos", display_order: 79 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.52 PM (1).jpeg", title: "Zip Replacement", category: "alterations", display_order: 80 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.52 PM (2).jpeg", title: "Resham Work", category: "embroidery", display_order: 81 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.52 PM.jpeg", title: "Straight Cut Stitch", category: "stitching", display_order: 82 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.53 PM.jpeg", title: "Vest Logo", category: "logos", display_order: 83 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.57 PM.jpeg", title: "Tuck Alteration", category: "alterations", display_order: 84 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.12.58 PM.jpeg", title: "Cutwork Embroidery", category: "embroidery", display_order: 85 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.13.00 PM.jpeg", title: "Sharara Stitching", category: "stitching", display_order: 86 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.13.03 PM.jpeg", title: "Monogram Embroidery", category: "logos", display_order: 87 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.13.06 PM.jpeg", title: "Dart Adjustment", category: "alterations", display_order: 88 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.13.07 PM.jpeg", title: "Shadow Work", category: "embroidery", display_order: 89 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.13.08 PM.jpeg", title: "Co-ord Set Stitch", category: "stitching", display_order: 90 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.13.11 PM (1).jpeg", title: "Crest Embroidery", category: "logos", display_order: 91 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.13.11 PM (2).jpeg", title: "Lining Alteration", category: "alterations", display_order: 92 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.13.11 PM.jpeg", title: "Kantha Work", category: "embroidery", display_order: 93 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.13.12 PM.jpeg", title: "Formal Stitching", category: "stitching", display_order: 94 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.13.15 PM.jpeg", title: "Badge Embroidery", category: "logos", display_order: 95 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.13.16 PM.jpeg", title: "Button Replacement", category: "alterations", display_order: 96 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.13.18 PM.jpeg", title: "Crewel Work", category: "embroidery", display_order: 97 },
  { image_url: "WhatsApp Image 2026-03-07 at 7.13.21 PM.jpeg", title: "Maxi Dress Stitch", category: "stitching", display_order: 98 },
].map(item => ({
  ...item,
  image_url: `https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/${encodeURIComponent(item.image_url)}`
}));

export async function GET() {
  try {
    // Create services table if not exists
    const { error: servicesError } = await supabase
      .from('services')
      .upsert(services, { onConflict: 'id', ignoreDuplicates: true });
    
    if (servicesError) {
      console.error('Services error:', servicesError);
    }
    
    // Create portfolio table if not exists
    const { error: portfolioError } = await supabase
      .from('portfolio')
      .upsert(portfolioItems, { onConflict: 'id', ignoreDuplicates: true });
    
    if (portfolioError) {
      console.error('Portfolio error:', portfolioError);
    }
    
    return NextResponse.json({ 
      message: 'Seed completed', 
      servicesCount: services.length,
      portfolioCount: portfolioItems.length 
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}