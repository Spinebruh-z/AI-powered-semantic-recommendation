import dotenv from 'dotenv';
import { initDatabase, createTables, dbRun } from '../config/database.js';
import pexelsService from '../services/pexelsService.js';

dotenv.config();

/**
 * Product categories with their subcategories
 */
const CATEGORIES_DATA = [
  {
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    subcategories: [
      'Smartphones', 'Laptops', 'Tablets', 'Smartwatches', 'Headphones',
      'Cameras', 'Gaming Consoles', 'TVs', 'Speakers', 'Drones'
    ]
  },
  {
    name: 'Fashion',
    description: 'Clothing and accessories',
    subcategories: [
      'Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Bags', 'Watches',
      'Jewelry', 'Sunglasses', 'Hats', 'Belts', 'Scarves'
    ]
  },
  {
    name: 'Home & Kitchen',
    description: 'Home improvement and kitchen essentials',
    subcategories: [
      'Furniture', 'Cookware', 'Bedding', 'Lighting', 'Storage',
      'Appliances', 'Decor', 'Rugs', 'Curtains', 'Wall Art'
    ]
  },
  {
    name: 'Sports & Outdoors',
    description: 'Sports equipment and outdoor gear',
    subcategories: [
      'Fitness Equipment', 'Camping Gear', 'Cycling', 'Water Sports', 'Team Sports',
      'Winter Sports', 'Running', 'Yoga', 'Fishing', 'Hiking'
    ]
  },
  {
    name: 'Beauty & Personal Care',
    description: 'Beauty products and personal care items',
    subcategories: [
      'Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Bath Products',
      'Nail Care', 'Men\'s Grooming', 'Oral Care', 'Massage Tools', 'Beauty Tools'
    ]
  },
  {
    name: 'Books & Media',
    description: 'Books, movies, music, and games',
    subcategories: [
      'Fiction Books', 'Non-Fiction Books', 'Comics', 'Movies', 'Music',
      'Video Games', 'Board Games', 'Audiobooks', 'Magazines', 'E-Readers'
    ]
  },
  {
    name: 'Toys & Games',
    description: 'Toys and games for all ages',
    subcategories: [
      'Action Figures', 'Dolls', 'Building Blocks', 'Educational Toys', 'Puzzles',
      'RC Toys', 'Arts & Crafts', 'Stuffed Animals', 'Outdoor Play', 'Baby Toys'
    ]
  },
  {
    name: 'Automotive',
    description: 'Car parts and accessories',
    subcategories: [
      'Car Electronics', 'Tires', 'Car Care', 'Interior Accessories', 'Exterior Accessories',
      'Tools', 'Oils & Fluids', 'Motorcycle Parts', 'Car Audio', 'GPS & Navigation'
    ]
  },
  {
    name: 'Pet Supplies',
    description: 'Products for your pets',
    subcategories: [
      'Dog Supplies', 'Cat Supplies', 'Bird Supplies', 'Fish Supplies', 'Small Animal Supplies',
      'Pet Food', 'Pet Toys', 'Pet Grooming', 'Pet Beds', 'Pet Health'
    ]
  },
  {
    name: 'Office Supplies',
    description: 'Office essentials and stationery',
    subcategories: [
      'Desk Organizers', 'Pens & Pencils', 'Notebooks', 'Printers', 'Office Furniture',
      'Filing & Storage', 'Calendars', 'Whiteboards', 'Labels', 'Paper Products'
    ]
  },
  {
    name: 'Garden & Outdoor',
    description: 'Gardening tools and outdoor living',
    subcategories: [
      'Gardening Tools', 'Plants & Seeds', 'Outdoor Furniture', 'Grills', 'Lawn Care',
      'Patio Decor', 'Outdoor Lighting', 'Fencing', 'Bird Feeders', 'Garden Hoses'
    ]
  },
  {
    name: 'Food & Beverages',
    description: 'Food items and beverages',
    subcategories: [
      'Snacks', 'Beverages', 'Cooking Ingredients', 'Breakfast Foods', 'Canned Goods',
      'Frozen Foods', 'Bakery', 'Dairy Products', 'Organic Foods', 'Specialty Diets'
    ]
  },
  {
    name: 'Health & Wellness',
    description: 'Health and wellness products',
    subcategories: [
      'Vitamins', 'Supplements', 'First Aid', 'Medical Supplies', 'Fitness Trackers',
      'Protein Powders', 'Weight Management', 'Sleep Aids', 'Pain Relief', 'Mobility Aids'
    ]
  },
  {
    name: 'Baby Products',
    description: 'Baby care essentials',
    subcategories: [
      'Diapers', 'Baby Food', 'Baby Clothing', 'Strollers', 'Car Seats',
      'Baby Monitors', 'Nursery Furniture', 'Feeding Accessories', 'Baby Toys', 'Baby Health'
    ]
  },
  {
    name: 'Musical Instruments',
    description: 'Instruments and music equipment',
    subcategories: [
      'Guitars', 'Keyboards', 'Drums', 'Wind Instruments', 'String Instruments',
      'DJ Equipment', 'Recording Equipment', 'Amplifiers', 'Music Accessories', 'Sheet Music'
    ]
  },
  {
    name: 'Tools & Hardware',
    description: 'Tools and hardware supplies',
    subcategories: [
      'Power Tools', 'Hand Tools', 'Tool Storage', 'Hardware', 'Electrical',
      'Plumbing', 'Measuring Tools', 'Safety Equipment', 'Fasteners', 'Adhesives'
    ]
  },
  {
    name: 'Jewelry & Accessories',
    description: 'Fine jewelry and fashion accessories',
    subcategories: [
      'Necklaces', 'Bracelets', 'Earrings', 'Rings', 'Brooches',
      'Cufflinks', 'Anklets', 'Charms', 'Jewelry Boxes', 'Body Jewelry'
    ]
  },
  {
    name: 'Luggage & Travel',
    description: 'Travel gear and accessories',
    subcategories: [
      'Suitcases', 'Backpacks', 'Travel Bags', 'Travel Accessories', 'Packing Organizers',
      'Travel Pillows', 'Luggage Tags', 'Travel Adapters', 'Travel Security', 'Carry-Ons'
    ]
  },
  {
    name: 'Arts & Crafts',
    description: 'Art supplies and craft materials',
    subcategories: [
      'Painting Supplies', 'Drawing Supplies', 'Craft Kits', 'Scrapbooking', 'Sewing',
      'Knitting', 'Beading', 'Clay & Pottery', 'Fabric', 'Craft Tools'
    ]
  },
  {
    name: 'Party Supplies',
    description: 'Party decorations and supplies',
    subcategories: [
      'Balloons', 'Party Decorations', 'Tableware', 'Party Favors', 'Costumes',
      'Banners', 'Candles', 'Gift Wrap', 'Party Games', 'Photo Props'
    ]
  }
];

/**
 * Available colors for products
 */
const COLORS = [
  'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple',
  'Pink', 'Brown', 'Gray', 'Silver', 'Gold', 'Beige', 'Navy', 'Teal'
];

/**
 * Generate a random price within a range
 */
function generatePrice(min = 10, max = 1000) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

/**
 * Generate a random color
 */
function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

/**
 * Generate product titles based on category and subcategory
 */
function generateProductTitle(subcategoryName, index) {
  const adjectives = ['Premium', 'Professional', 'Deluxe', 'Elite', 'Classic', 'Modern', 'Vintage', 'Ultra', 'Super', 'Advanced'];
  const descriptors = ['Series', 'Edition', 'Pro', 'Plus', 'Max', 'Lite', 'Standard', 'Ultimate', 'Essential', 'Premium'];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const desc = descriptors[Math.floor(Math.random() * descriptors.length)];
  
  return `${adj} ${subcategoryName} ${desc} ${index + 1}`;
}

/**
 * Generate product description
 */
function generateDescription(title, subcategory) {
  const features = [
    'high-quality materials',
    'ergonomic design',
    'durable construction',
    'sleek appearance',
    'easy to use',
    'long-lasting performance',
    'innovative features',
    'excellent value',
    'trusted brand',
    'customer favorite'
  ];
  
  const feature1 = features[Math.floor(Math.random() * features.length)];
  const feature2 = features[Math.floor(Math.random() * features.length)];
  
  return `${title} is a top-rated ${subcategory.toLowerCase()} featuring ${feature1} and ${feature2}. Perfect for daily use and backed by our quality guarantee.`;
}

/**
 * Generate unique product ID
 */
function generateProductId(categoryIndex, subcategoryIndex, productIndex) {
  return `PROD${String(categoryIndex).padStart(2, '0')}${String(subcategoryIndex).padStart(2, '0')}${String(productIndex).padStart(3, '0')}`;
}

/**
 * Seed the database with categories, subcategories, and products
 */
async function seedDatabase() {
  console.log('🌱 Starting database seeding process...\n');
  
  const db = initDatabase();
  
  try {
    // Create tables
    await createTables(db);
    
    // Clear existing data
    await dbRun(db, 'DELETE FROM products');
    await dbRun(db, 'DELETE FROM subcategories');
    await dbRun(db, 'DELETE FROM categories');
    console.log('✅ Cleared existing data\n');
    
    let totalProducts = 0;
    
    // Insert categories and their data
    for (let catIndex = 0; catIndex < CATEGORIES_DATA.length; catIndex++) {
      const category = CATEGORIES_DATA[catIndex];
      
      console.log(`📁 Processing category: ${category.name} (${catIndex + 1}/${CATEGORIES_DATA.length})`);
      
      // Insert category
      const catResult = await dbRun(
        db,
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [category.name, category.description]
      );
      const categoryId = catResult.lastID;
      
      // Insert subcategories
      for (let subIndex = 0; subIndex < category.subcategories.length; subIndex++) {
        const subcategoryName = category.subcategories[subIndex];
        
        const subResult = await dbRun(
          db,
          'INSERT INTO subcategories (category_id, name, description) VALUES (?, ?, ?)',
          [categoryId, subcategoryName, `${subcategoryName} products in ${category.name}`]
        );
        const subcategoryId = subResult.lastID;
        
        console.log(`  ├─ ${subcategoryName}: Generating 20 products...`);
        
        // Insert 20 products per subcategory
        for (let prodIndex = 0; prodIndex < 20; prodIndex++) {
          const productId = generateProductId(catIndex, subIndex, prodIndex);
          const title = generateProductTitle(subcategoryName, prodIndex);
          const description = generateDescription(title, subcategoryName);
          const price = generatePrice(10, 999);
          const color = getRandomColor();
          
          // Fetch image from Pexels
          let imageUrl = null;
          try {
            imageUrl = await pexelsService.getProductImage({ title, color });
            // Small delay to respect API rate limits
            await pexelsService.delay(100);
          } catch (error) {
            console.warn(`    ⚠️  Could not fetch image for ${productId}`);
            imageUrl = `https://via.placeholder.com/400x300?text=${encodeURIComponent(title)}`;
          }
          
          await dbRun(
            db,
            `INSERT INTO products (subcategory_id, product_id, title, description, price, color, image_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [subcategoryId, productId, title, description, price, color, imageUrl]
          );
          
          totalProducts++;
        }
      }
      
      console.log(`✅ Completed ${category.name}\n`);
    }
    
    console.log('═══════════════════════════════════════════════════');
    console.log(`🎉 Database seeding completed successfully!`);
    console.log(`📊 Statistics:`);
    console.log(`   - Categories: ${CATEGORIES_DATA.length}`);
    console.log(`   - Subcategories: ${CATEGORIES_DATA.length * 10}`);
    console.log(`   - Products: ${totalProducts}`);
    console.log('═══════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    db.close((err) => {
      if (err) console.error(err.message);
      console.log('Database connection closed.');
    });
  }
}

// Run the seeding process
seedDatabase();
