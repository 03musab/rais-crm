import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const services = [
  {
    title: "Custom Embroidery",
    description: "Bring your unique ideas to life with our bespoke embroidery service. We work on any fabric — from casual wear to bridal pieces.",
    imageUrl: "https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.42%20PM.jpeg",
    badge: "Popular",
    icon: "star",
    whatsappMessage: "Hi! I'm interested in Custom Embroidery. Can you tell me more?",
    displayOrder: 1,
  },
  {
    title: "Logo Embroidery",
    description: "Professional, high-quality logo stitching for corporate uniforms, caps, bags, and branded merchandise. Bulk orders welcome.",
    imageUrl: "https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.45%20PM.jpeg",
    badge: "Corporate",
    icon: "building",
    whatsappMessage: "Hi! I'm interested in Logo Embroidery. Can you tell me more?",
    displayOrder: 2,
  },
  {
    title: "Handcrafted Designs",
    description: "Traditional hand-embroidery techniques — mirror work, zardozi, thread art — adding an artistic and personal touch to every piece.",
    imageUrl: "https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.46%20PM.jpeg",
    badge: "Artisan",
    icon: "hands",
    whatsappMessage: "Hi! I'm interested in Handcrafted Designs. Can you tell me more?",
    displayOrder: 3,
  },
  {
    title: "Dress Stitching",
    description: "Custom tailoring for dresses, salwar suits, and churidars — ensuring a perfect fit and flattering silhouette tailored just for you.",
    imageUrl: "https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.46%20PM%20(2).jpeg",
    badge: "Popular",
    icon: "tshirt",
    whatsappMessage: "Hi! I'm interested in Dress Stitching. Can you tell me more?",
    displayOrder: 4,
  },
  {
    title: "Alteration Services",
    description: "Expert resizing, hemming, and adjustments to give your existing wardrobe a perfect new fit and a fresh lease on life.",
    imageUrl: "https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.46%20PM%20(3).jpeg",
    badge: null,
    icon: "ruler",
    whatsappMessage: "Hi! I'm interested in Alteration Services. Can you tell me more?",
    displayOrder: 5,
  },
  {
    title: "Uniform Embroidery",
    description: "Durable and consistent embroidery solutions for school uniforms, staff shirts, and institutional garments at competitive bulk rates.",
    imageUrl: "https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.47%20PM.jpeg",
    badge: "Bulk",
    icon: "user-tie",
    whatsappMessage: "Hi! I'm interested in Uniform Embroidery. Can you tell me more?",
    displayOrder: 6,
  },
  {
    title: "Machine Embroidery",
    description: "Precision machine work ideal for intricate patterns, repeated designs, and larger volume orders with consistent quality throughout.",
    imageUrl: "https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/WhatsApp%20Image%202026-03-07%20at%207.09.47%20PM%20(1).jpeg",
    badge: null,
    icon: "cog",
    whatsappMessage: "Hi! I'm interested in Machine Embroidery. Can you tell me more?",
    displayOrder: 7,
  },
];

const portfolioItems = [
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.42 PM.jpeg", title: "Embroidery Work", category: "embroidery", displayOrder: 1 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.45 PM (1).jpeg", title: "Stitching Work", category: "stitching", displayOrder: 2 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.45 PM.jpeg", title: "Logo Embroidery", category: "logos", displayOrder: 3 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.46 PM (1).jpeg", title: "Alteration Work", category: "alterations", displayOrder: 4 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.46 PM (2).jpeg", title: "Hand Embroidery", category: "embroidery", displayOrder: 5 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.46 PM (3).jpeg", title: "Dress Stitching", category: "stitching", displayOrder: 6 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.46 PM.jpeg", title: "Corporate Logo", category: "logos", displayOrder: 7 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.47 PM (1).jpeg", title: "Saree Fall & Pico", category: "alterations", displayOrder: 8 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.47 PM.jpeg", title: "Floral Embroidery", category: "embroidery", displayOrder: 9 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.48 PM (1).jpeg", title: "Custom Stitching", category: "stitching", displayOrder: 10 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.48 PM.jpeg", title: "Uniform Logo", category: "logos", displayOrder: 11 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.49 PM (1).jpeg", title: "Sleeve Adjustment", category: "alterations", displayOrder: 12 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.49 PM.jpeg", title: "Thread Work", category: "embroidery", displayOrder: 13 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.50 PM.jpeg", title: "Salwar Stitching", category: "stitching", displayOrder: 14 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.51 PM.jpeg", title: "Cap Logo", category: "logos", displayOrder: 15 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.52 PM.jpeg", title: "Hemming Work", category: "alterations", displayOrder: 16 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.54 PM.jpeg", title: "Mirror Work", category: "embroidery", displayOrder: 17 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.56 PM.jpeg", title: "Ladies Suit", category: "stitching", displayOrder: 18 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.09.59 PM.jpeg", title: "Brand Embroidery", category: "logos", displayOrder: 19 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.10.01 PM.jpeg", title: "Pico Work", category: "alterations", displayOrder: 20 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.10.04 PM.jpeg", title: "Zardozi Work", category: "embroidery", displayOrder: 21 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.10.06 PM.jpeg", title: "Bridal Stitching", category: "stitching", displayOrder: 22 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.10.07 PM.jpeg", title: "School Logo", category: "logos", displayOrder: 23 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.10.08 PM.jpeg", title: "Resize Work", category: "alterations", displayOrder: 24 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.10.10 PM.jpeg", title: "Artisan Embroidery", category: "embroidery", displayOrder: 25 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.10.18 PM.jpeg", title: "Evening Wear", category: "stitching", displayOrder: 26 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.10.20 PM (1).jpeg", title: "Staff Logo", category: "logos", displayOrder: 27 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.10.20 PM (2).jpeg", title: "Jacket Alteration", category: "alterations", displayOrder: 28 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.10.20 PM.jpeg", title: "Sequin Embroidery", category: "embroidery", displayOrder: 29 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.10.21 PM (1).jpeg", title: "Churidar Stitching", category: "stitching", displayOrder: 30 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.10.21 PM (2).jpeg", title: "Bag Logo", category: "logos", displayOrder: 31 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.10.21 PM (3).jpeg", title: "Saree Finishing", category: "alterations", displayOrder: 32 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.10.21 PM.jpeg", title: "Needlework", category: "embroidery", displayOrder: 33 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.10.22 PM.jpeg", title: "Custom Dress", category: "stitching", displayOrder: 34 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.10.24 PM.jpeg", title: "Tshirt Logo", category: "logos", displayOrder: 35 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.11.51 PM (1).jpeg", title: "Precision Alteration", category: "alterations", displayOrder: 36 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.11.51 PM (2).jpeg", title: "Silk Embroidery", category: "embroidery", displayOrder: 37 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.11.51 PM.jpeg", title: "Fine Stitching", category: "stitching", displayOrder: 38 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.11.52 PM (1).jpeg", title: "Corporate Embroidery", category: "logos", displayOrder: 39 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.11.52 PM (2).jpeg", title: "Hemline Work", category: "alterations", displayOrder: 40 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.11.52 PM (3).jpeg", title: "Ethnic Embroidery", category: "embroidery", displayOrder: 41 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.11.52 PM.jpeg", title: "Salwar Kameez", category: "stitching", displayOrder: 42 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.11.54 PM.jpeg", title: "Uniform Embroidery", category: "logos", displayOrder: 43 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.11.56 PM.jpeg", title: "Waist Alteration", category: "alterations", displayOrder: 44 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.00 PM.jpeg", title: "Decorative Stitch", category: "embroidery", displayOrder: 45 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.02 PM.jpeg", title: "Lehenga Stitching", category: "stitching", displayOrder: 46 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.05 PM.jpeg", title: "Logo Patch", category: "logos", displayOrder: 47 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.07 PM.jpeg", title: "Blouse Alteration", category: "alterations", displayOrder: 48 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.09 PM.jpeg", title: "Zari Embroidery", category: "embroidery", displayOrder: 49 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.11 PM.jpeg", title: "Anarkali Stitching", category: "stitching", displayOrder: 50 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.14 PM.jpeg", title: "Sports Logo", category: "logos", displayOrder: 51 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.16 PM.jpeg", title: "Dupatta Finishing", category: "alterations", displayOrder: 52 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.20 PM.jpeg", title: "Traditional Embroidery", category: "embroidery", displayOrder: 53 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.22 PM.jpeg", title: "Indo-Western Stitch", category: "stitching", displayOrder: 54 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.23 PM.jpeg", title: "Jacket Logo", category: "logos", displayOrder: 55 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.24 PM (1).jpeg", title: "Kurti Alteration", category: "alterations", displayOrder: 56 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.24 PM.jpeg", title: "Handcraft Work", category: "embroidery", displayOrder: 57 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.25 PM (1).jpeg", title: "Palazzo Stitching", category: "stitching", displayOrder: 58 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.25 PM.jpeg", title: "Hoodie Logo", category: "logos", displayOrder: 59 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.28 PM (1).jpeg", title: "Belt Alteration", category: "alterations", displayOrder: 60 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.28 PM.jpeg", title: "Kashmiri Embroidery", category: "embroidery", displayOrder: 61 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.29 PM.jpeg", title: "Saree Blouse Stitch", category: "stitching", displayOrder: 62 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.30 PM.jpeg", title: "Apron Logo", category: "logos", displayOrder: 63 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.31 PM (1).jpeg", title: "Cuff Alteration", category: "alterations", displayOrder: 64 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.31 PM.jpeg", title: "Phulkari Work", category: "embroidery", displayOrder: 65 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.32 PM.jpeg", title: "Kids Stitching", category: "stitching", displayOrder: 66 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.34 PM.jpeg", title: "Polo Logo", category: "logos", displayOrder: 67 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.35 PM.jpeg", title: "Trouser Alteration", category: "alterations", displayOrder: 68 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.36 PM.jpeg", title: "Bead Work", category: "embroidery", displayOrder: 69 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.38 PM.jpeg", title: "Gown Stitching", category: "stitching", displayOrder: 70 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.41 PM.jpeg", title: "Patch Logo", category: "logos", displayOrder: 71 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.42 PM (1).jpeg", title: "Lace Alteration", category: "alterations", displayOrder: 72 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.42 PM (2).jpeg", title: "Chikankari Work", category: "embroidery", displayOrder: 73 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.42 PM.jpeg", title: "Kurti Stitching", category: "stitching", displayOrder: 74 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.45 PM (1).jpeg", title: "Bag Logo Embroidery", category: "logos", displayOrder: 75 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.45 PM (2).jpeg", title: "Collar Alteration", category: "alterations", displayOrder: 76 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.45 PM.jpeg", title: "Aari Work", category: "embroidery", displayOrder: 77 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.46 PM.jpeg", title: "Party Wear Stitch", category: "stitching", displayOrder: 78 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.48 PM.jpeg", title: "Name Embroidery", category: "logos", displayOrder: 79 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.52 PM (1).jpeg", title: "Zip Replacement", category: "alterations", displayOrder: 80 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.52 PM (2).jpeg", title: "Resham Work", category: "embroidery", displayOrder: 81 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.52 PM.jpeg", title: "Straight Cut Stitch", category: "stitching", displayOrder: 82 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.53 PM.jpeg", title: "Vest Logo", category: "logos", displayOrder: 83 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.57 PM.jpeg", title: "Tuck Alteration", category: "alterations", displayOrder: 84 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.12.58 PM.jpeg", title: "Cutwork Embroidery", category: "embroidery", displayOrder: 85 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.13.00 PM.jpeg", title: "Sharara Stitching", category: "stitching", displayOrder: 86 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.13.03 PM.jpeg", title: "Monogram Embroidery", category: "logos", displayOrder: 87 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.13.06 PM.jpeg", title: "Dart Adjustment", category: "alterations", displayOrder: 88 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.13.07 PM.jpeg", title: "Shadow Work", category: "embroidery", displayOrder: 89 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.13.08 PM.jpeg", title: "Co-ord Set Stitch", category: "stitching", displayOrder: 90 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.13.11 PM (1).jpeg", title: "Crest Embroidery", category: "logos", displayOrder: 91 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.13.11 PM (2).jpeg", title: "Lining Alteration", category: "alterations", displayOrder: 92 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.13.11 PM.jpeg", title: "Kantha Work", category: "embroidery", displayOrder: 93 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.13.12 PM.jpeg", title: "Formal Stitching", category: "stitching", displayOrder: 94 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.13.15 PM.jpeg", title: "Badge Embroidery", category: "logos", displayOrder: 95 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.13.16 PM.jpeg", title: "Button Replacement", category: "alterations", displayOrder: 96 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.13.18 PM.jpeg", title: "Crewel Work", category: "embroidery", displayOrder: 97 },
  { imageUrl: "WhatsApp Image 2026-03-07 at 7.13.21 PM.jpeg", title: "Maxi Dress Stitch", category: "stitching", displayOrder: 98 },
].map(item => ({
  ...item,
  imageUrl: `https://wnydpsgeiunsbfoutpwh.supabase.co/storage/v1/object/public/products/${encodeURIComponent(item.imageUrl)}`
}));

async function seedData() {
  console.log('Seeding services...');
  for (const service of services) {
    await addDoc(collection(db, 'services'), service);
    console.log(`Added: ${service.title}`);
  }
  console.log(`\nSeeded ${services.length} services`);

  console.log('\nSeeding portfolio items...');
  for (const item of portfolioItems) {
    await addDoc(collection(db, 'portfolio'), item);
    console.log(`Added: ${item.title}`);
  }
  console.log(`\nSeeded ${portfolioItems.length} portfolio items`);
  
  console.log('\n✅ Seeding complete!');
}

seedData().catch(console.error);