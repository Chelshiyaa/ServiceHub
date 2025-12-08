import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from '../config/database.js';
import Provider from '../models/Provider.js';
import Category from '../models/Category.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const verifyData = async () => {
  try {
    await connectDB();
    
    const providerCount = await Provider.countDocuments();
    const categoryCount = await Category.countDocuments();
    
    console.log('\n📊 Database Statistics:');
    console.log(`Total Providers: ${providerCount}`);
    console.log(`Total Categories: ${categoryCount}`);
    
    // Count by status
    const approved = await Provider.countDocuments({ status: 'approved' });
    const pending = await Provider.countDocuments({ status: 'pending' });
    console.log(`\nProvider Status:`);
    console.log(`  Approved: ${approved}`);
    console.log(`  Pending: ${pending}`);
    
    // Count by category
    const byCategory = await Provider.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $sort: { count: -1 } },
    ]);
    
    console.log(`\nProviders by Category:`);
    byCategory.forEach(item => {
      console.log(`  ${item.category.name}: ${item.count}`);
    });
    
    // Sample providers
    const samples = await Provider.find().limit(5).populate('category');
    console.log(`\n📍 Sample Providers:`);
    samples.forEach(p => {
      const city = p.address.split(',')[2]?.trim() || 'Unknown';
      console.log(`  - ${p.serviceName}`);
      console.log(`    Category: ${p.category.name} | City: ${city} | Rating: ${p.ratings.average}/5`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

verifyData();

