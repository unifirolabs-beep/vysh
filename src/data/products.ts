export interface Product {
  id: string;
  _id?: string;
  code?: string;
  productCode?: string;
  name: string;
  subtitle?: string;
  category: string;
  categorySlug?: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewsCount?: number;
  image: string;
  imageUrl?: string;
  images?: string[];
  hoverImage?: string;
  badge?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isHandcrafted?: boolean;
  isPureSilver?: boolean;
  description?: string;
  material?: string;
  weight?: string | number;
  metalType?: string;
  purity?: string;
  stock?: number;
  inStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: number;
}

export const CATEGORIES: Category[] = [
  { id: "cat-1", name: "Rakhis", slug: "rakhis", image: "/category-cards/rakhi.png", itemCount: 42 },
];

export const PRODUCTS: Product[] = [];

export const BUDGET_TIERS = [
  { label: "Under ₹999", maxPrice: 999, tag: "Budget Friendly" },
  { label: "Under ₹1499", maxPrice: 1499, tag: "Most Popular" },
  { label: "Under ₹2499", maxPrice: 2499, tag: "Premium Silver" },
  { label: "Under ₹4999", maxPrice: 4999, tag: "Luxury Hampers" },
];

export const REVIEWS = [
  {
    id: "rev-1",
    name: "Ananya Sharma",
    location: "Mumbai",
    rating: 5,
    date: "July 2026",
    comment: "The Big B 925 Pure Silver Rakhi was even more beautiful in person! The packaging felt like opening a royal heirloom. My brother loved it!",
    productName: "Big B Rakhi in 92.5 Silver",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    verified: true,
  },
  {
    id: "rev-2",
    name: "Rohan Verma",
    location: "Bengaluru",
    rating: 5,
    date: "July 2026",
    comment: "Ordered the Om Stone Rakhi and received it within 48 hours. Exceptional silver finish and sturdy thread. 10/10 service!",
    productName: "Om Stone Rakhi in 92.5 Silver",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    verified: true,
  },
  {
    id: "rev-3",
    name: "Priya & Harsh",
    location: "New Delhi",
    rating: 5,
    date: "June 2026",
    comment: "The Serenora rings in 92.5 silver are pure elegance. The velvet gift box and silver authenticity certificate added so much value!",
    productName: "Serenora Rings in 92.5 Silver",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    verified: true,
  },
];

export const INSTAGRAM_POSTS = [
  { id: "ig-1", image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=600&auto=format&fit=crop", likes: "1.4k" },
  { id: "ig-2", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop", likes: "2.8k" },
  { id: "ig-3", image: "https://images.unsplash.com/photo-1611591475140-be360fc64794?q=80&w=600&auto=format&fit=crop", likes: "980" },
  { id: "ig-4", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop", likes: "3.1k" },
  { id: "ig-5", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop", likes: "1.9k" },
  { id: "ig-6", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop", likes: "4.2k" },
];
