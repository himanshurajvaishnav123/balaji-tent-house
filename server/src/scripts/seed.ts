import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { Service } from '../models/Service.js';
import { GalleryItem } from '../models/GalleryItem.js';

dotenv.config();

const seedDatabase = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error('MONGO_URI is missing in .env');
    process.exit(1);
  }

  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected successfully.');

    // 1. Seed or Upsert Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || 'himansu@gmail.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || '123456789';
    const adminName = process.env.ADMIN_NAME || 'Yamuna Shankar Bairagi';
    const adminPhone = process.env.ADMIN_NUMBER || process.env.ADMIN_PHONE || '+919783950350';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = new User({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        phone: adminPhone,
        role: 'admin',
      });
      await admin.save();
      console.log(`[Seed] Created default Admin: ${adminEmail}`);
    } else {
      admin.name = adminName;
      admin.phone = adminPhone;
      admin.password = adminPassword; // Pre-save hook will hash it
      await admin.save();
      console.log(`[Seed] Updated existing Admin: ${adminEmail}`);
    }

    // 2. Seed or Upsert SiteSettings
    let settings = await SiteSettings.findOne();
    const settingsData = {
      businessName: 'BALAJI TENT HOUSE',
      ownerName: adminName,
      phone: adminPhone,
      email: adminEmail,
      address: 'Malka khera, sarkari samiti ke samne, bijoliya, Bhilwara',
      ownerPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      logoUrl: '',
      heroTitle: 'Grand Tent Setup, Royal Weddings & Catering Equipment',
      heroSubtitle: 'Your most trusted event partner in Bijoliya & Bhilwara region. Specialized in Royal Mandap, Waterproof Monsoon Tents & Full Cooking Utensils Rental.',
      heroBannerUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop',
      aboutText: 'Welcome to Balaji Tent House, led by Yamuna Shankar Bairagi. With over 15+ years of dedicated service across Bijoliya and the greater Bhilwara district, we deliver majestic shamianas, waterproof pavilions for monsoon events, luxury lighting, and complete sets of traditional cooking equipment and catering utensils for all your celebratory needs.',
    };

    if (!settings) {
      settings = await SiteSettings.create(settingsData);
      console.log('[Seed] Created initial SiteSettings.');
    } else {
      Object.assign(settings, settingsData);
      await settings.save();
      console.log('[Seed] Refreshed SiteSettings.');
    }

    // 3. Seed Services if empty
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      const defaultServices = [
        {
          title: 'Royal Wedding & Event Tent Setup',
          description: 'Luxurious shamianas, grand entry gates, thematic wedding mandaps, banquet carpets, VIP sofas, and high-intensity decorative lighting for weddings and corporate gatherings.',
          iconName: 'Tent',
          imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
          priceTag: 'Custom Wedding Packages',
          isAvailable: true,
        },
        {
          title: 'Waterproof / Monsoon Tents (Barsat ke Tent)',
          description: 'Specialized 100% leak-proof German waterproof tents and heavy-duty tarpaulins designed specifically for monsoon weddings, religious katha, and outdoor festivities.',
          iconName: 'ShieldCheck',
          imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200&auto=format&fit=crop',
          priceTag: 'All-Weather Guaranteed',
          isAvailable: true,
        },
        {
          title: 'Cooking Utensils & Catering Equipment Rental',
          description: 'Complete Halwai & catering set: Big Bhagone, Kadai, Parat, Bhati, Chamach, Gas Bhatti, Chulha, stainless steel dinner sets, water drums, and hot-pots for gatherings of 100 to 5,000+ guests.',
          iconName: 'UtensilsCrossed',
          imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
          priceTag: 'Flexible Daily / Event Rates',
          isAvailable: true,
        },
        {
          title: 'Lighting, Sound & Stage Decor',
          description: 'Halogen, LED par cans, fairy serial lights, dynamic focus lights, audio amplifiers, and designer floral backdrops for sangeet and reception nights.',
          iconName: 'Sparkles',
          imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
          priceTag: 'Stage & Ambience Packages',
          isAvailable: true,
        },
      ];

      await Service.insertMany(defaultServices);
      console.log(`[Seed] Seeded ${defaultServices.length} default services.`);
    }

    // 4. Seed Gallery Items if empty
    const galleryCount = await GalleryItem.countDocuments();
    if (galleryCount === 0) {
      const defaultGallery = [
        {
          title: 'Grand Royal Mandap & Reception Pavilion',
          description: 'Spectacular maroon & gold thematic tent setup with crystal chandeliers and floral arches for a royal wedding celebration.',
          imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
          location: 'Bijoliya Royal Palace Grounds',
          category: 'Tent Decoration',
        },
        {
          title: 'All-Weather Monsoon Waterproof Tent',
          description: 'Complete waterproof shelter built to withstand heavy summer rains, keeping 1,200 guests completely dry and comfortable.',
          imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200&auto=format&fit=crop',
          location: 'Malka Khera Main Ground, Bijoliya',
          category: 'Waterproof Tents',
        },
        {
          title: 'Complete Traditional Halwai Utensil Setup',
          description: 'Giant copper & stainless steel Bhagone, Kadai, Bhati, and serving spoons deployed for a 2,000 person community feast (Prasadi).',
          imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
          location: 'Bhilwara Road, Bijoliya',
          category: 'Utensils Rental',
        },
        {
          title: 'Festive Night Illumination & Shamiana',
          description: 'Warm golden fairy lighting, red carpet runways, and VIP sofa lounge for sangeet & ring ceremony.',
          imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
          location: 'Mandalgarh Road Area',
          category: 'Tent Decoration',
        },
        {
          title: 'Industrial Waterproof Marquee for Katha',
          description: 'Heavy duty German frame waterproof hangar tent with storm anchoring and side curtains.',
          imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop',
          location: 'Sarkari Samiti Campus, Bijoliya',
          category: 'Waterproof Tents',
        },
        {
          title: 'Catering Buffet & Cookware Inventory',
          description: 'Stainless steel Parat, heavy frying Kadai, large ladles, and commercial cooking burners ready for dispatch.',
          imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop',
          location: 'Balaji Tent House Warehouse, Bijoliya',
          category: 'Utensils Rental',
        },
      ];

      await GalleryItem.insertMany(defaultGallery);
      console.log(`[Seed] Seeded ${defaultGallery.length} default gallery items.`);
    }

    // 5. Seed Enquiries if empty
    const { Enquiry } = await import('../models/Enquiry.js');
    const enquiryCount = await Enquiry.countDocuments();
    if (enquiryCount === 0) {
      const sampleEnquiries = [
        {
          customerName: 'Suresh Gurjar',
          phone: '+919829123456',
          eventType: 'Wedding / Vivah',
          eventDate: '2026-11-20',
          location: 'Bijoliya Main Road',
          details: 'Require Royal Mandap, stage lighting, 800 chairs, and full Halwai utensils (5 Bhagone, 2 Kadai, 3 Bhati).',
          status: 'Pending',
        },
        {
          customerName: 'Radheshyam Sharma',
          phone: '+919414987654',
          eventType: 'Bhagwat Katha / Satsang',
          eventDate: '2026-10-15',
          location: 'Malka Khera, Bijoliya',
          details: 'Waterproof Monsoon Tent (German frame) for 1,500 people, carpets and sound system.',
          status: 'Contacted',
        },
      ];
      await Enquiry.insertMany(sampleEnquiries);
      console.log(`[Seed] Seeded ${sampleEnquiries.length} sample booking enquiries.`);
    }

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
