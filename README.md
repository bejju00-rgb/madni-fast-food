# Madni Fast Food

Premium fast food ordering website built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, GSAP, Prisma, and PostgreSQL.

## Features

- Cinematic video hero backgrounds with parallax scrolling
- GSAP ScrollTrigger + Lenis smooth scrolling animations
- Custom cursor with magnetic buttons and particle effects
- Full menu system loaded from PostgreSQL database
- 8 special combo deals with horizontal scroll section
- User authentication (mobile number signup)
- Cart, checkout with JazzCash/Easypaisa/COD
- Order tracking with status updates
- Admin panel at `/admin` with full CRUD
- PWA support, dark mode, WhatsApp ordering

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion, GSAP
- **Backend:** Next.js API Routes, Prisma ORM, PostgreSQL
- **Auth:** NextAuth.js
- **State:** Zustand
- **Forms:** React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your database URL and secrets.

4. Push database schema and seed:
```bash
npx prisma db push
npm run db:seed
```

5. Start development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Admin Access

- URL: `/admin`
- Phone: `03000000000`
- Password: `admin123` (or value set in ADMIN_PASSWORD env)

## Menu Data

All menu items and deals are seeded from the printed menu including:
- Shawarma, Burgers, Pizza, Paratha Rolls
- Fries, Sandwiches, Wraps, Rice, Pasta
- Wings, Drinks, Tea, Ice Cream
- 8 Special Deals (Student, Family, Friday, Sunday, etc.)

## Contact

- Phone: 0322-3572541 / 0307-6980041
- WhatsApp: 923223572541
- Social: @akmal.raza.9619
