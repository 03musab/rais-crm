# RAIS CRM

Product Merchandising & Analytics System for managing products across different sections with inventory tracking.

## Features

- **Product Management** - CRUD with variants, images, pricing
- **Section Builder** - Organize products into Homepage, Featured, Promotions, Categories
- **Category System** - Hierarchical categories with product assignment
- **Inventory Tracking** - Stock levels with low-stock alerts
- **Analytics Dashboard** - Section performance overview
- **Team Management** - Roles and permissions (Admin, Manager, Editor)

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Database**: Firestore (Firebase)
- **Auth**: Firebase Auth
- **Styling**: Tailwind CSS
- **Hosting**: Vercel + Firebase

## Getting Started

### 1. Clone and Install

```bash
cd rais-crm
npm install
```

### 2. Set up Firebase

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** (Email/Password)
4. Create **Firestore Database** (start in test mode)
5. Get your config values from Project Settings > General > Your apps

6. Create `.env.local` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

7. Set up Firestore rules:
   - Go to Firestore > Rules
   - Copy contents from `firebase/firestore.rules`
   - Deploy

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Firestore Data Structure

```
/teams/{teamId}
  - name: string
  - createdAt: timestamp
  
/teams/{teamId}/members/{userId}
  - role: 'admin' | 'manager' | 'editor'
  - userId: string

/categories/{categoryId}
  - name: string
  - slug: string
  - parentId: string | null
  - teamId: string

/sections/{sectionId}
  - name: string
  - type: 'homepage' | 'featured' | 'promotions' | 'category'
  - description: string
  - teamId: string

/products/{productId}
  - name: string
  - description: string
  - images: string[]
  - status: 'active' | 'draft' | 'archived'
  - sectionId: string | null
  - categoryIds: string[]
  - lowStockThreshold: number
  - teamId: string

/products/{productId}/variants/{variantId}
  - name: string
  - sku: string
  - price: number
  - compareAtPrice: number
  - inventory: number
  - lowStockThreshold: number
  - attributes: object

/alerts/{alertId}
  - productId: string
  - variantId: string | null
  - type: 'low_stock' | 'out_of_stock'
  - threshold: number
  - currentInventory: number
  - acknowledged: boolean
  - teamId: string
```

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Firebase

1. Create Firebase project
2. Enable Firestore & Auth
3. Deploy rules from `firebase/firestore.rules`
4. Connect to Vercel

## License

MIT
