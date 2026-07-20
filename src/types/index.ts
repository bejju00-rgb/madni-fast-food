import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      phone: string;
      role: string;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name: string;
    phone: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone: string;
    role: string;
  }
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  type: "product" | "deal";
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  categoryId: string;
  category?: { name: string; slug: string };
  available: boolean;
  featured?: boolean;
}

export interface Deal {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  items: string[];
  image?: string | null;
  active: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: "product" | "deal";
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  address: string;
  city: string;
  landmark?: string | null;
  notes?: string | null;
  phone: string;
  customerName: string;
  paymentMethod: string;
  status: string;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  sortOrder: number;
  _count?: { products: number };
}

export interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  landmark?: string | null;
  isDefault: boolean;
}
