import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

const products = [
  {
    name: "Custom Embroidery Work",
    description: "Bring your unique ideas to life with our bespoke embroidery service. We work on any fabric — from casual wear to bridal pieces.",
    images: ["https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.42%20PM.jpeg"],
    status: "active" as const,
    section_id: null,
    category_ids: [],
    low_stock_threshold: 10,
    teamId: "default",
  },
  {
    name: "Logo Embroidery Service",
    description: "Professional, high-quality logo stitching for corporate uniforms, caps, bags, and branded merchandise. Bulk orders welcome.",
    images: ["https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.45%20PM.jpeg"],
    status: "active" as const,
    section_id: null,
    category_ids: [],
    low_stock_threshold: 10,
    teamId: "default",
  },
  {
    name: "Handcrafted Embroidery",
    description: "Traditional hand-embroidery techniques — mirror work, zardozi, thread art — adding an artistic and personal touch to every piece.",
    images: ["https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.46%20PM.jpeg"],
    status: "active" as const,
    section_id: null,
    category_ids: [],
    low_stock_threshold: 10,
    teamId: "default",
  },
  {
    name: "Dress Stitching Service",
    description: "Custom tailoring for dresses, salwar suits, and churidars — ensuring a perfect fit and flattering silhouette tailored just for you.",
    images: ["https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.46%20PM%20(2).jpeg"],
    status: "active" as const,
    section_id: null,
    category_ids: [],
    low_stock_threshold: 10,
    teamId: "default",
  },
  {
    name: "Alteration Services",
    description: "Expert resizing, hemming, and adjustments to give your existing wardrobe a perfect new fit and a fresh lease on life.",
    images: ["https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.46%20PM%20(3).jpeg"],
    status: "active" as const,
    section_id: null,
    category_ids: [],
    low_stock_threshold: 10,
    teamId: "default",
  },
  {
    name: "Uniform Embroidery",
    description: "Durable and consistent embroidery solutions for school uniforms, staff shirts, and institutional garments at competitive bulk rates.",
    images: ["https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.47%20PM.jpeg"],
    status: "active" as const,
    section_id: null,
    category_ids: [],
    low_stock_threshold: 10,
    teamId: "default",
  },
  {
    name: "Machine Embroidery",
    description: "Precision machine work ideal for intricate patterns, repeated designs, and larger volume orders with consistent quality throughout.",
    images: ["https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.47%20PM%20(1).jpeg"],
    status: "active" as const,
    section_id: null,
    category_ids: [],
    low_stock_threshold: 10,
    teamId: "default",
  },
];

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    if (snapshot.size > 0) {
      for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref);
      }
    }
    
    for (const product of products) {
      await addDoc(collection(db, 'products'), product);
    }
    
    return NextResponse.json({ 
      message: 'Products seeded', 
      count: products.length 
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}