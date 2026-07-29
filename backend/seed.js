import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './src/config/db.js';
import User from './src/models/User.js';
import Product from './src/models/Product.js';

dotenv.config();

const PRODUCTS = [
  {
    title: 'Nova UI Kit — 200+ Components',
    description: 'A comprehensive Figma UI kit featuring over 200 meticulously crafted components. Perfect for building modern web applications, dashboards, and landing pages. Includes dark and light modes, responsive grids, and a complete design system.',
    price: 49.99,
    imageUrl: '/images/ui-kit-preview.png',
    category: 'UI Kits',
    tags: ['figma', 'components', 'dashboard', 'responsive'],
    downloads: 1248,
    rating: 4.9,
  },
  {
    title: 'SaaS Landing Page Template',
    description: 'A stunning, fully-responsive SaaS landing page template built with React and Tailwind CSS. Includes all the sections you need: hero, features, pricing, testimonials, and CTA. Easily customizable and production-ready.',
    price: 29.99,
    imageUrl: '/images/saas-template-preview.png',
    category: 'Templates',
    tags: ['saas', 'react', 'landing', 'tailwind'],
    downloads: 876,
    rating: 4.8,
  },
  {
    title: 'Lucid Icon Pack — 1000 Icons',
    description: 'A massive icon library with 1000+ pixel-perfect SVG icons across 20 categories. Available in outline, filled, and duotone styles. Compatible with Figma, Sketch, and direct SVG export.',
    price: 19.99,
    imageUrl: '/images/icon-set-preview.png',
    category: 'Icons',
    tags: ['svg', 'icons', 'figma', 'outline'],
    downloads: 3420,
    rating: 4.7,
  },
  {
    title: 'Abstract Gradient Illustrations',
    description: 'A collection of 50 vibrant, hand-crafted abstract illustrations perfect for hero sections, error pages, and empty states. Available in SVG and PNG formats. Easily customizable colors.',
    price: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
    category: 'Illustrations',
    tags: ['abstract', 'gradient', 'svg', 'hero'],
    downloads: 654,
    rating: 4.6,
  },
  {
    title: 'Inter Pro — Extended Font Pack',
    description: 'The professional extended version of the popular Inter typeface, including 18 weights, italics, and variable font files. Perfect for UI design and web typography. Licensed for commercial use.',
    price: 0,
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop',
    category: 'Fonts',
    tags: ['typography', 'sans-serif', 'variable', 'free'],
    downloads: 5890,
    rating: 5.0,
  },
  {
    title: 'Analytics Dashboard Template',
    description: 'A complete React analytics dashboard template with 15+ pre-built pages. Includes charts, data tables, user management, and dark mode. Built with React, Redux, and Recharts.',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    category: 'Templates',
    tags: ['analytics', 'dashboard', 'react', 'charts'],
    downloads: 432,
    rating: 4.8,
  },
  {
    title: 'Aerial City Photography Bundle',
    description: 'A stunning collection of 80 high-resolution aerial city photographs. Perfect for website backgrounds, presentations, and editorial use. All photos are 6000x4000px and licensed for commercial use.',
    price: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop',
    category: 'Photography',
    tags: ['aerial', 'city', 'background', 'commercial'],
    downloads: 298,
    rating: 4.5,
  },
  {
    title: 'Ambient Background Music Pack',
    description: '25 royalty-free ambient and lo-fi music tracks perfect for product demos, promotional videos, and background audio. Available in MP3 and WAV formats. All tracks are fully licensed for commercial use.',
    price: 34.99,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop',
    category: 'Music',
    tags: ['royalty-free', 'ambient', 'lofi', 'background'],
    downloads: 187,
    rating: 4.4,
  },
  {
    title: 'E-commerce Product UI Kit',
    description: 'A comprehensive e-commerce design system with product cards, cart flows, checkout screens, and order tracking interfaces. Includes 180+ components for Figma and Adobe XD.',
    price: 59.99,
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop',
    category: 'UI Kits',
    tags: ['ecommerce', 'figma', 'xd', 'checkout'],
    downloads: 721,
    rating: 4.9,
  },
  {
    title: 'CSS Animation Library',
    description: 'A powerful collection of 100+ CSS animation classes and keyframes. Includes entrance animations, hover effects, loaders, and page transitions. Drop-in ready with no JavaScript required.',
    price: 0,
    imageUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&auto=format&fit=crop',
    category: 'Plugins',
    tags: ['css', 'animation', 'free', 'keyframes'],
    downloads: 4120,
    rating: 4.7,
  },
  {
    title: 'Mobile App UI Kit — iOS & Android',
    description: 'A versatile mobile UI kit featuring screens for onboarding, authentication, dashboards, and settings. Designed for both iOS and Android with platform-specific components included.',
    price: 44.99,
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop',
    category: 'UI Kits',
    tags: ['mobile', 'ios', 'android', 'onboarding'],
    downloads: 956,
    rating: 4.8,
  },
  {
    title: 'Explainer Video Templates',
    description: 'A pack of 10 professionally designed explainer video templates for After Effects. Easily customizable with your brand colors, text, and images. Includes free fonts and sound effects.',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop',
    category: 'Video',
    tags: ['after-effects', 'explainer', 'animation', 'template'],
    downloads: 156,
    rating: 4.6,
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});

    console.log('👤 Creating admin user...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@assetvault.io',
      password: 'admin123',
      role: 'admin',
    });

    console.log('👤 Creating demo customer...');
    await User.create({
      name: 'John Doe',
      email: 'user@assetvault.io',
      password: 'user1234',
      role: 'customer',
    });

    console.log(`📦 Seeding ${PRODUCTS.length} products...`);
    await Product.insertMany(PRODUCTS.map(p => ({ ...p, seller: admin._id })));

    console.log(`\n✅ Database seeded successfully!`);
    console.log(`   Admin: admin@assetvault.io / admin123`);
    console.log(`   User:  user@assetvault.io / user1234`);
    console.log(`   Products: ${PRODUCTS.length}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
