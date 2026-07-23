import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "Shawarma", slug: "shawarma", sortOrder: 1 },
  { name: "Burgers", slug: "burgers", sortOrder: 2 },
  { name: "Pizza", slug: "pizza", sortOrder: 3 },
  { name: "Paratha Rolls", slug: "paratha-rolls", sortOrder: 4 },
  { name: "Sandwiches", slug: "sandwiches", sortOrder: 5 },
  { name: "Fries", slug: "fries", sortOrder: 6 },
  { name: "Wraps", slug: "wraps", sortOrder: 7 },
  { name: "Parathas", slug: "parathas", sortOrder: 8 },
  { name: "Rice", slug: "rice", sortOrder: 9 },
  { name: "Pasta", slug: "pasta", sortOrder: 10 },
  { name: "Wings & Nuggets", slug: "wings-nuggets", sortOrder: 11 },
  { name: "Drinks", slug: "drinks", sortOrder: 12 },
  { name: "Tea", slug: "tea", sortOrder: 13 },
  { name: "Ice Cream", slug: "ice-cream", sortOrder: 14 },
  { name: "Deals", slug: "deals", sortOrder: 15 },
];

const products = [
  // Shawarma
  { name: "Chicken Shawarma (Regular)", price: 150, category: "shawarma", description: "Juicy chicken shawarma wrapped in fresh pita bread" },
  { name: "Chicken Shawarma (Jumbo)", price: 200, category: "shawarma", description: "Extra large chicken shawarma with special sauce" },
  { name: "Chicken Shawarma (X Large)", price: 250, category: "shawarma", description: "Our biggest chicken shawarma loaded with toppings" },
  { name: "Zinger Shawarma (Large)", price: 200, category: "shawarma", description: "Crispy zinger chicken in a soft shawarma wrap" },
  { name: "Zinger Shawarma (Jumbo)", price: 250, category: "shawarma", description: "Jumbo zinger shawarma with extra crunch" },
  { name: "Chicken Kabab Shawarma", price: 200, category: "shawarma", description: "Grilled chicken kabab shawarma with fresh veggies" },
  { name: "Chicken Tikka Shawarma", price: 200, category: "shawarma", description: "Smoky chicken tikka wrapped in warm bread" },
  { name: "Bar B Q Shawarma", price: 250, category: "shawarma", description: "BBQ flavored shawarma with smoky taste" },
  { name: "Chinese Shawarma", price: 220, category: "shawarma", description: "Fusion Chinese-style shawarma" },
  // Burgers
  { name: "Omelet Burger", price: 150, category: "burgers", description: "Fluffy omelet in a soft burger bun" },
  { name: "Chicken Burger", price: 250, category: "burgers", description: "Classic grilled chicken burger" },
  { name: "Zinger Burger", price: 299, category: "burgers", description: "Crispy zinger chicken burger with special sauce", featured: true },
  { name: "Jumbo Zinger Burger", price: 399, category: "burgers", description: "Double patty jumbo zinger burger" },
  { name: "Chicken Patty Burger", price: 250, category: "burgers", description: "Juicy chicken patty burger" },
  { name: "Chapli Kabab Burger", price: 250, category: "burgers", description: "Spicy chapli kabab in a burger bun" },
  { name: "Bar B Q Burger", price: 350, category: "burgers", description: "Smoky BBQ chicken burger" },
  { name: "Pizza Burger", price: 299, category: "burgers", description: "Unique pizza-flavored burger fusion" },
  // Pizza
  { name: "Mini Small Pizza", price: 300, category: "pizza", description: "Personal size pizza with your choice of toppings" },
  { name: "Small Pizza", price: 400, category: "pizza", description: "Small pizza perfect for one" },
  { name: "Medium Pizza", price: 600, category: "pizza", description: "Medium pizza for sharing", featured: true },
  { name: "Large Pizza", price: 1000, category: "pizza", description: "Large family-size pizza" },
  { name: "Special Large Pizza", price: 1200, category: "pizza", description: "Premium special large pizza with extra toppings" },
  // Paratha Rolls
  { name: "Chicken Paratha Roll", price: 250, category: "paratha-rolls", description: "Chicken wrapped in flaky paratha" },
  { name: "Zinger Paratha Roll", price: 300, category: "paratha-rolls", description: "Crispy zinger in paratha roll" },
  { name: "Pizza Paratha Roll", price: 350, category: "paratha-rolls", description: "Pizza flavors in a paratha roll" },
  { name: "Chicken Kabab Paratha Roll", price: 250, category: "paratha-rolls", description: "Grilled kabab paratha roll" },
  { name: "Chicken Chinese Paratha Roll", price: 250, category: "paratha-rolls", description: "Chinese-style paratha roll" },
  // Sandwiches
  { name: "Club Sandwich", price: 250, category: "sandwiches", description: "Triple-decker club sandwich" },
  { name: "Chicken Sandwich", price: 200, category: "sandwiches", description: "Classic chicken sandwich" },
  { name: "Bar B Q Sandwich", price: 400, category: "sandwiches", description: "BBQ chicken sandwich with special sauce" },
  // Fries
  { name: "Finger Chips (Small)", price: 100, category: "fries", description: "Crispy finger chips - 15 flavors available" },
  { name: "Finger Chips (Medium)", price: 150, category: "fries", description: "Medium portion finger chips" },
  { name: "Finger Chips (Large)", price: 200, category: "fries", description: "Large portion finger chips" },
  { name: "Finger Chips (XL)", price: 250, category: "fries", description: "Extra large finger chips" },
  { name: "Fries (Small)", price: 150, category: "fries", description: "Classic crispy fries" },
  { name: "Fries (Large)", price: 250, category: "fries", description: "Large portion classic fries" },
  { name: "Loaded Fries", price: 399, category: "fries", description: "Fries loaded with cheese and toppings", featured: true },
  // Wraps
  { name: "Malai Boti Wrap", price: 350, category: "wraps", description: "Creamy malai boti wrap" },
  { name: "Twister Wrap", price: 450, category: "wraps", description: "Spicy twister wrap" },
  { name: "Turkish Wrap", price: 400, category: "wraps", description: "Authentic Turkish-style wrap" },
  { name: "Chicken Wrap", price: 200, category: "wraps", description: "Simple chicken wrap" },
  { name: "Zinger Wrap", price: 250, category: "wraps", description: "Crispy zinger wrap" },
  // Parathas
  { name: "Sada Paratha", price: 80, category: "parathas", description: "Plain flaky paratha" },
  { name: "Aloo Wala Paratha", price: 120, category: "parathas", description: "Potato stuffed paratha" },
  { name: "Chicken Paratha", price: 200, category: "parathas", description: "Chicken stuffed paratha" },
  { name: "Chicken Cheese Paratha", price: 250, category: "parathas", description: "Chicken and cheese stuffed paratha" },
  // Rice
  { name: "Chicken Biryani (Half)", price: 200, category: "rice", description: "Aromatic chicken biryani - half portion" },
  { name: "Chicken Biryani (Full)", price: 400, category: "rice", description: "Full portion chicken biryani" },
  { name: "Chicken Fried Rice (Half)", price: 200, category: "rice", description: "Chinese-style fried rice - half" },
  { name: "Chicken Fried Rice (Full)", price: 400, category: "rice", description: "Full portion chicken fried rice" },
  { name: "Chicken Arabic Rice (Half)", price: 250, category: "rice", description: "Arabic spiced rice - half portion" },
  { name: "Chicken Arabic Rice (Full)", price: 500, category: "rice", description: "Full portion Arabic rice" },
  { name: "Chicken Manchurian (Half)", price: 300, category: "rice", description: "Chicken manchurian with rice - half" },
  { name: "Chicken Manchurian (Full)", price: 600, category: "rice", description: "Full portion chicken manchurian" },
  { name: "Daal Chawal (Half)", price: 80, category: "rice", description: "Comfort daal chawal - half portion" },
  { name: "Daal Chawal (Full)", price: 150, category: "rice", description: "Full portion daal chawal" },
  // Pasta
  { name: "Crunchy Pasta (Small)", price: 350, category: "pasta", description: "Crunchy pasta - small portion" },
  { name: "Crunchy Pasta (Large)", price: 600, category: "pasta", description: "Large crunchy pasta" },
  { name: "Bar B Q Pasta (Small)", price: 400, category: "pasta", description: "BBQ flavored pasta - small" },
  { name: "Bar B Q Pasta (Large)", price: 800, category: "pasta", description: "Large BBQ pasta" },
  { name: "Creamy Pasta (Small)", price: 250, category: "pasta", description: "Creamy white sauce pasta - small" },
  { name: "Creamy Pasta (Large)", price: 500, category: "pasta", description: "Large creamy pasta" },
  // Wings & Nuggets
  { name: "Hot Wings (5 Piece)", price: 200, category: "wings-nuggets", description: "Spicy hot wings - 5 pieces" },
  { name: "Nuggets (5 Piece)", price: 250, category: "wings-nuggets", description: "Crispy chicken nuggets - 5 pieces" },
  // Drinks
  { name: "Regular Drink (500ml)", price: 80, category: "drinks", description: "Chilled soft drink 500ml" },
  { name: "1 Liter Drink", price: 150, category: "drinks", description: "1 liter soft drink" },
  { name: "1.5 Liter Drink", price: 200, category: "drinks", description: "1.5 liter soft drink" },
  { name: "2.25 Liter Drink", price: 250, category: "drinks", description: "2.25 liter jumbo drink" },
  // Tea
  { name: "Tea", price: 80, category: "tea", description: "Hot Pakistani chai" },
  { name: "Gur Wali Tea", price: 100, category: "tea", description: "Traditional jaggery tea" },
  // Ice Cream
  { name: "Mango Ice Cream", price: 70, category: "ice-cream", description: "Creamy mango scoop" },
  { name: "Chocolate Ice Cream", price: 70, category: "ice-cream", description: "Rich chocolate scoop" },
  { name: "Strawberry Ice Cream", price: 70, category: "ice-cream", description: "Fresh strawberry scoop" },
  { name: "Banana Ice Cream", price: 70, category: "ice-cream", description: "Sweet banana scoop" },
  { name: "Totifrutti Ice Cream", price: 70, category: "ice-cream", description: "Mixed fruit scoop" },
  { name: "Kulfa Ice Cream", price: 70, category: "ice-cream", description: "Traditional kulfa flavor" },
  { name: "Khoya Khajoor Ice Cream", price: 70, category: "ice-cream", description: "Khoya and date flavor" },
  // Chicken Shami
  { name: "Chicken Shami", price: 70, category: "sandwiches", description: "Homemade chicken shami kabab" },
  { name: "Naan (Sada)", price: 30, category: "parathas", description: "Plain naan bread" },
];

const deals = [
  {
    title: "Deal 1 - Pizza Feast",
    price: 1299,
    items: ["1 Large Pizza", "6 Hot Wings", "1 - 1.5 Ltr Drink"],
    description: "Perfect for a family pizza night",
  },
  {
    title: "Deal 2 - Medium Combo",
    price: 699,
    items: ["1 Medium Pizza", "1 Regular Fries", "1 - 1 Ltr Drink"],
    description: "Great value medium combo deal",
  },
  {
    title: "Deal 3 - Zinger Special",
    price: 799,
    items: ["2 Zinger Burgers", "1 Zinger Shawarma", "1 Ltr Drink"],
    description: "Zinger lovers special deal",
  },
  {
    title: "Deal 4 - Mega Feast",
    price: 1599,
    items: ["2 Medium Pizzas", "1 Regular Fries", "10 Wings", "1 - 1.5 Ltr Drink"],
    description: "Ultimate feast for the whole family",
  },
  {
    title: "Student Deal",
    price: 499,
    items: ["1 Small Pizza", "1 - 500ml Drink", "1 Regular Fries"],
    description: "Budget-friendly student special",
  },
  {
    title: "Family Deal",
    price: 1499,
    items: ["5 Zinger Burgers", "1 Regular Fries", "1 - 1.5 Ltr Drink"],
    description: "Feed the whole family",
  },
  {
    title: "Blessed Friday",
    price: 999,
    items: ["5 Chicken Jumbo Shawarma", "1 - 1 Ltr Drink"],
    description: "Friday special shawarma deal",
  },
  {
    title: "Happy Sunday",
    price: 2349,
    items: ["2 Large Pizzas", "12 Wings", "1 Jumbo Drink"],
    description: "Sunday celebration mega deal",
  },
];

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 12);

  await prisma.user.upsert({
    where: { phone: "03000000000" },
    update: {},
    create: {
      name: "Admin",
      phone: "03000000000",
      email: process.env.ADMIN_EMAIL || "admin@madnifastfood.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const categoryMap = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );

  for (const product of products) {
    const categoryId = categoryMap[product.category];
    if (!categoryId) continue;

    const existing = await prisma.product.findFirst({
      where: { name: product.name, categoryId },
    });

    if (!existing) {
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          categoryId,
          available: true,
          featured: (product as { featured?: boolean }).featured || false,
          image: `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop`,
        },
      });
    }
  }

  for (const deal of deals) {
    const existing = await prisma.deal.findFirst({ where: { title: deal.title } });
    if (!existing) {
      await prisma.deal.create({
        data: {
          ...deal,
          image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
          active: true,
        },
      });
    }
  }

  await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      deliveryCharge: 150,
      whatsappNumber: "923223572541",
      jazzcashNumber: "0322-3572541",
      jazzcashName: "Madni Fast Food",
      easypaisaNumber: "0307-6980041",
      easypaisaName: "Madni Fast Food",
      heroOpenTime: "6 PM",
      heroCloseTime: "2 AM",
    },
  });

  await prisma.video.createMany({
    data: [
      { title: "Hero Video 1", url: "/videos/hero-1.mp4", active: true, sortOrder: 1 },
      { title: "Hero Video 2", url: "/videos/hero-2.mp4", active: true, sortOrder: 2 },
      { title: "Hero Video 3", url: "/videos/hero-3.mp4", active: true, sortOrder: 3 },
    ],
    skipDuplicates: true,
  });

  console.log("Database seeded successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
