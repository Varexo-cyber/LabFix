import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const sql = getDb();

    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_en TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        image TEXT DEFAULT '',
        description TEXT DEFAULT '',
        description_en TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_en TEXT DEFAULT '',
        description TEXT DEFAULT '',
        description_en TEXT DEFAULT '',
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        compare_price DECIMAL(10,2),
        category TEXT NOT NULL,
        subcategory TEXT DEFAULT '',
        sku TEXT UNIQUE NOT NULL,
        image TEXT DEFAULT '',
        images TEXT[] DEFAULT '{}',
        in_stock BOOLEAN DEFAULT true,
        featured BOOLEAN DEFAULT false,
        is_new BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 100,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        customer_type TEXT DEFAULT 'individual',
        company_name TEXT DEFAULT '',
        kvk_number TEXT DEFAULT '',
        contact_person TEXT DEFAULT '',
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT DEFAULT '',
        address TEXT DEFAULT '',
        city TEXT DEFAULT '',
        postal_code TEXT DEFAULT '',
        country TEXT DEFAULT 'Nederland',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Add billing columns if they don't exist
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_address TEXT DEFAULT ''`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_city TEXT DEFAULT ''`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_postal_code TEXT DEFAULT ''`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_country TEXT DEFAULT 'Nederland'`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_same_as_shipping BOOLEAN DEFAULT true`;
    } catch {
      // Ignore if columns already exist
    }

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        user_email TEXT NOT NULL,
        customer_type TEXT DEFAULT 'individual',
        company_name TEXT DEFAULT '',
        kvk_number TEXT DEFAULT '',
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT DEFAULT '',
        shipping_address TEXT DEFAULT '',
        shipping_city TEXT DEFAULT '',
        shipping_postal_code TEXT DEFAULT '',
        shipping_country TEXT DEFAULT '',
        items JSONB NOT NULL DEFAULT '[]',
        subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
        shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
        total DECIMAL(10,2) NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pending',
        notes TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // News articles table
    await sql`
      CREATE TABLE IF NOT EXISTS news_articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        title_en TEXT DEFAULT '',
        summary TEXT DEFAULT '',
        summary_en TEXT DEFAULT '',
        content TEXT DEFAULT '',
        content_en TEXT DEFAULT '',
        image TEXT DEFAULT '',
        images JSONB DEFAULT '[]',
        published BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Newsletter subscribers table
    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        company_name TEXT DEFAULT '',
        subscribed_at TIMESTAMP DEFAULT NOW(),
        is_active BOOLEAN DEFAULT true
      )
    `;

    // Password reset tokens table
    await sql`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Repair appointments table
    await sql`
      CREATE TABLE IF NOT EXISTS repair_appointments (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        device_type TEXT NOT NULL,
        device_model TEXT NOT NULL,
        problem_description TEXT NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        service_type TEXT NOT NULL DEFAULT 'bring_in',
        shipping_address TEXT DEFAULT '',
        status TEXT NOT NULL DEFAULT 'pending',
        rejection_reason TEXT DEFAULT '',
        admin_notes TEXT DEFAULT '',
        attachments JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Seed default categories
    const existingCats = await sql`SELECT COUNT(*) as count FROM categories`;
    if (Number(existingCats[0].count) === 0) {
      await sql`
        INSERT INTO categories (id, name, name_en, slug, image, description, description_en) VALUES
        ('iphone', 'iPhone Onderdelen', 'iPhone Parts', 'iphone', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop', 'Schermen, batterijen, camera''s en meer voor alle iPhone modellen', 'Screens, batteries, cameras and more for all iPhone models'),
        ('samsung', 'Samsung Onderdelen', 'Samsung Parts', 'samsung', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop', 'Originele en compatibele onderdelen voor Samsung Galaxy', 'Original and compatible parts for Samsung Galaxy'),
        ('ipad', 'iPad Onderdelen', 'iPad Parts', 'ipad', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop', 'Schermen, digitizers en onderdelen voor alle iPad modellen', 'Screens, digitizers and parts for all iPad models'),
        ('macbook', 'MacBook Onderdelen', 'MacBook Parts', 'macbook', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop', 'Toetsenborden, schermen, batterijen voor MacBook', 'Keyboards, screens, batteries for MacBook'),
        ('tools', 'Gereedschap & Supplies', 'Tools & Supplies', 'tools', 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=300&fit=crop', 'Professioneel reparatiegereedschap', 'Professional repair tools'),
        ('accessories', 'Accessoires', 'Accessories', 'accessories', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop', 'Hoesjes, opladers, kabels en meer', 'Cases, chargers, cables and more')
      `;
    }

    return NextResponse.json({ success: true, message: 'Database initialized successfully' });
  } catch (error: any) {
    console.error('DB Init error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
