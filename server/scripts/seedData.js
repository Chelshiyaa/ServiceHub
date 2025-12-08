import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Category from '../models/Category.js';
import connectDB from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from server directory
dotenv.config({ path: join(__dirname, '../.env') });

// Indian cities with coordinates
const indianCities = [
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  { name: 'Delhi', lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  { name: 'Surat', lat: 21.1702, lng: 72.8311, state: 'Gujarat' },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
  { name: 'Kanpur', lat: 26.4499, lng: 80.3319, state: 'Uttar Pradesh' },
  { name: 'Nagpur', lat: 21.1458, lng: 79.0882, state: 'Maharashtra' },
  { name: 'Indore', lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh' },
  { name: 'Thane', lat: 19.2183, lng: 72.9781, state: 'Maharashtra' },
  { name: 'Bhopal', lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh' },
  { name: 'Visakhapatnam', lat: 17.6869, lng: 83.2185, state: 'Andhra Pradesh' },
  { name: 'Patna', lat: 25.5941, lng: 85.1376, state: 'Bihar' },
  { name: 'Vadodara', lat: 22.3072, lng: 73.1812, state: 'Gujarat' },
  { name: 'Ghaziabad', lat: 28.6692, lng: 77.4538, state: 'Uttar Pradesh' },
  { name: 'Ludhiana', lat: 30.9010, lng: 75.8573, state: 'Punjab' },
  { name: 'Agra', lat: 27.1767, lng: 78.0081, state: 'Uttar Pradesh' },
  { name: 'Nashik', lat: 19.9975, lng: 73.7898, state: 'Maharashtra' },
  { name: 'Faridabad', lat: 28.4089, lng: 77.3178, state: 'Haryana' },
  { name: 'Meerut', lat: 28.9845, lng: 77.7064, state: 'Uttar Pradesh' },
  { name: 'Rajkot', lat: 22.3039, lng: 70.8022, state: 'Gujarat' },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739, state: 'Uttar Pradesh' },
  { name: 'Srinagar', lat: 34.0837, lng: 74.7973, state: 'Jammu and Kashmir' },
  { name: 'Amritsar', lat: 31.6340, lng: 74.8723, state: 'Punjab' },
  { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, state: 'Chandigarh' },
  { name: 'Jodhpur', lat: 26.2389, lng: 73.0243, state: 'Rajasthan' },
  { name: 'Raipur', lat: 21.2514, lng: 81.6296, state: 'Chhattisgarh' },
  { name: 'Allahabad', lat: 25.4358, lng: 81.8463, state: 'Uttar Pradesh' },
  { name: 'Coimbatore', lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu' },
  { name: 'Madurai', lat: 9.9252, lng: 78.1198, state: 'Tamil Nadu' },
  { name: 'Vijayawada', lat: 16.5062, lng: 80.6480, state: 'Andhra Pradesh' },
  { name: 'Jabalpur', lat: 23.1815, lng: 79.9864, state: 'Madhya Pradesh' },
  { name: 'Gwalior', lat: 26.2183, lng: 78.1828, state: 'Madhya Pradesh' },
  { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245, state: 'Odisha' },
  { name: 'Mysore', lat: 12.2958, lng: 76.6394, state: 'Karnataka' },
];

// Service categories
const categories = [
  { name: 'Electrician', icon: '⚡', description: 'Electrical services and repairs' },
  { name: 'Plumber', icon: '🔧', description: 'Plumbing services and installations' },
  { name: 'Carpenter', icon: '🪚', description: 'Carpentry and woodwork services' },
  { name: 'Painter', icon: '🎨', description: 'Painting and decoration services' },
  { name: 'Mechanic', icon: '🔩', description: 'Vehicle repair and maintenance' },
  { name: 'Beautician', icon: '💄', description: 'Beauty and salon services' },
  { name: 'Tutor', icon: '📚', description: 'Educational and tutoring services' },
  { name: 'Cook', icon: '👨‍🍳', description: 'Cooking and catering services' },
  { name: 'Driver', icon: '🚗', description: 'Driving and transportation services' },
  { name: 'Cleaner', icon: '🧹', description: 'Cleaning and housekeeping services' },
  { name: 'AC Repair', icon: '❄️', description: 'AC installation and repair services' },
  { name: 'Photographer', icon: '📷', description: 'Photography and videography services' },
  { name: 'Tailor', icon: '✂️', description: 'Tailoring and stitching services' },
  { name: 'Gardener', icon: '🌳', description: 'Gardening and landscaping services' },
  { name: 'Interior Designer', icon: '🏠', description: 'Interior design and decoration' },
];

// Indian first names
const firstNames = [
  'Raj', 'Priya', 'Amit', 'Anjali', 'Rahul', 'Kavita', 'Vikram', 'Sneha',
  'Arjun', 'Divya', 'Suresh', 'Meera', 'Karan', 'Pooja', 'Ravi', 'Neha',
  'Mohit', 'Shreya', 'Ankit', 'Riya', 'Deepak', 'Anita', 'Nikhil', 'Sonia',
  'Rohit', 'Kiran', 'Sachin', 'Manisha', 'Vishal', 'Sunita', 'Gaurav', 'Preeti',
  'Ajay', 'Radha', 'Manish', 'Jyoti', 'Pankaj', 'Lakshmi', 'Harsh', 'Swati',
  'Yash', 'Nisha', 'Abhishek', 'Rekha', 'Tarun', 'Madhuri', 'Kunal', 'Sapna',
  'Ritesh', 'Anamika', 'Siddharth', 'Kavya', 'Aditya', 'Shilpa', 'Varun', 'Deepika',
];

// Indian last names
const lastNames = [
  'Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Reddy', 'Mehta',
  'Jain', 'Shah', 'Agarwal', 'Malhotra', 'Chopra', 'Kapoor', 'Bansal', 'Arora',
  'Tiwari', 'Yadav', 'Pandey', 'Mishra', 'Joshi', 'Nair', 'Iyer', 'Menon',
  'Nair', 'Rao', 'Naidu', 'Krishnan', 'Raman', 'Subramanian', 'Venkatesh', 'Srinivasan',
];

// Service-specific names and descriptions
const serviceData = {
  'Electrician': {
    names: ['Electric Solutions', 'Power Pro', 'Bright Electric', 'Current Masters', 'Volt Experts'],
    skills: ['Wiring', 'Panel Installation', 'Repair', 'Maintenance', 'Safety Inspection'],
    pricing: ['₹300/hour', '₹500/hour', '₹400/hour', '₹350/hour', '₹450/hour'],
  },
  'Plumber': {
    names: ['Aqua Flow', 'Pipe Masters', 'Water Works', 'Drain Experts', 'Plumb Pro'],
    skills: ['Pipe Repair', 'Installation', 'Leak Fixing', 'Drain Cleaning', 'Fixture Installation'],
    pricing: ['₹400/hour', '₹500/hour', '₹350/hour', '₹450/hour', '₹400/hour'],
  },
  'Carpenter': {
    names: ['Wood Craft', 'Furniture Masters', 'Carpentry Pro', 'Timber Works', 'Craft Masters'],
    skills: ['Furniture Making', 'Repair', 'Custom Work', 'Installation', 'Polishing'],
    pricing: ['₹500/hour', '₹600/hour', '₹550/hour', '₹450/hour', '₹500/hour'],
  },
  'Painter': {
    names: ['Color Masters', 'Paint Pro', 'Brush Experts', 'Wall Art', 'Color Craft'],
    skills: ['Interior Painting', 'Exterior Painting', 'Wallpaper', 'Texture', 'Waterproofing'],
    pricing: ['₹300/hour', '₹350/hour', '₹400/hour', '₹250/hour', '₹300/hour'],
  },
  'Mechanic': {
    names: ['Auto Care', 'Car Masters', 'Vehicle Pro', 'Motor Experts', 'Auto Service'],
    skills: ['Engine Repair', 'Brake Service', 'AC Repair', 'Oil Change', 'General Service'],
    pricing: ['₹400/hour', '₹500/hour', '₹450/hour', '₹350/hour', '₹400/hour'],
  },
  'Beautician': {
    names: ['Beauty Salon', 'Glamour Studio', 'Style Zone', 'Beauty Care', 'Glam Experts'],
    skills: ['Haircut', 'Hair Color', 'Facial', 'Manicure', 'Pedicure'],
    pricing: ['₹500/session', '₹600/session', '₹400/session', '₹550/session', '₹450/session'],
  },
  'Tutor': {
    names: ['EduCare', 'Study Hub', 'Learn Pro', 'Tutor Zone', 'Education Experts'],
    skills: ['Math', 'Science', 'English', 'Computer', 'Physics'],
    pricing: ['₹500/hour', '₹600/hour', '₹400/hour', '₹550/hour', '₹450/hour'],
  },
  'Cook': {
    names: ['Kitchen Masters', 'Chef Services', 'Food Craft', 'Culinary Experts', 'Home Chef'],
    skills: ['North Indian', 'South Indian', 'Continental', 'Baking', 'Tiffin Service'],
    pricing: ['₹800/day', '₹1000/day', '₹600/day', '₹900/day', '₹700/day'],
  },
  'Driver': {
    names: ['Drive Safe', 'Car Service', 'Transport Pro', 'Drive Masters', 'Auto Service'],
    skills: ['City Driving', 'Highway', 'Long Distance', 'Event Service', 'Regular Service'],
    pricing: ['₹1500/day', '₹2000/day', '₹1200/day', '₹1800/day', '₹1600/day'],
  },
  'Cleaner': {
    names: ['Clean Pro', 'Sparkle Clean', 'Hygiene Masters', 'Clean Care', 'Spotless Service'],
    skills: ['House Cleaning', 'Office Cleaning', 'Deep Clean', 'Carpet Clean', 'Window Clean'],
    pricing: ['₹300/hour', '₹400/hour', '₹250/hour', '₹350/hour', '₹300/hour'],
  },
  'AC Repair': {
    names: ['Cool Air', 'AC Masters', 'Climate Control', 'Cool Pro', 'Air Experts'],
    skills: ['AC Repair', 'Installation', 'Gas Filling', 'Cleaning', 'Maintenance'],
    pricing: ['₹500/service', '₹600/service', '₹400/service', '₹550/service', '₹450/service'],
  },
  'Photographer': {
    names: ['Photo Studio', 'Capture Moments', 'Lens Masters', 'Photo Pro', 'Frame Experts'],
    skills: ['Wedding', 'Portrait', 'Event', 'Product', 'Video'],
    pricing: ['₹5000/event', '₹8000/event', '₹3000/event', '₹6000/event', '₹4000/event'],
  },
  'Tailor': {
    names: ['Stitch Pro', 'Fashion Tailor', 'Design Studio', 'Tailor Masters', 'Custom Fit'],
    skills: ['Alteration', 'Stitching', 'Design', 'Repair', 'Custom Work'],
    pricing: ['₹200/item', '₹300/item', '₹150/item', '₹250/item', '₹200/item'],
  },
  'Gardener': {
    names: ['Green Thumb', 'Garden Care', 'Plant Masters', 'Garden Pro', 'Nature Care'],
    skills: ['Landscaping', 'Planting', 'Maintenance', 'Pruning', 'Lawn Care'],
    pricing: ['₹400/hour', '₹500/hour', '₹300/hour', '₹450/hour', '₹350/hour'],
  },
  'Interior Designer': {
    names: ['Design Studio', 'Interior Pro', 'Home Design', 'Space Masters', 'Design Experts'],
    skills: ['Home Design', 'Office Design', '3D Planning', 'Color Consultation', 'Furniture Selection'],
    pricing: ['₹2000/hour', '₹2500/hour', '₹1500/hour', '₹2200/hour', '₹1800/hour'],
  },
};

// Generate random Indian phone number
const generatePhone = () => {
  const prefixes = ['91', '91', '91', '91', '91'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(1000000000 + Math.random() * 9000000000);
  return `${prefix}${number}`;
};

// Generate random email
const generateEmail = (name) => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'rediffmail.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const cleanName = name.toLowerCase().replace(/\s+/g, '');
  const randomNum = Math.floor(Math.random() * 1000);
  return `${cleanName}${randomNum}@${domain}`;
};

// Generate random address
const generateAddress = (city) => {
  const areas = [
    'Main Road', 'MG Road', 'Park Street', 'Market Area', 'Residential Colony',
    'Commercial Street', 'High Street', 'Gandhi Nagar', 'Nehru Road', 'Station Road',
  ];
  const area = areas[Math.floor(Math.random() * areas.length)];
  const number = Math.floor(Math.random() * 500) + 1;
  return `${number}, ${area}, ${city.name}, ${city.state}`;
};

// Generate experience
const generateExperience = () => {
  const years = Math.floor(Math.random() * 15) + 1;
  return `${years} years of experience`;
};

// Generate rating
const generateRating = () => {
  const average = (Math.random() * 1.5 + 3.5).toFixed(1); // Between 3.5 and 5.0
  const count = Math.floor(Math.random() * 50) + 5;
  return {
    average: parseFloat(average),
    count: count,
  };
};

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Provider.deleteMany({});
    // await Category.deleteMany({});
    // console.log('Cleared existing data');

    // Create categories
    console.log('Creating categories...');
    const createdCategories = [];
    for (const cat of categories) {
      const existing = await Category.findOne({ name: cat.name });
      if (!existing) {
        const category = await Category.create(cat);
        createdCategories.push(category);
        console.log(`Created category: ${cat.name}`);
      } else {
        createdCategories.push(existing);
        console.log(`Category already exists: ${cat.name}`);
      }
    }

    // Create 200 service providers
    console.log('\nCreating service providers...');
    const providers = [];
    const totalProviders = 200;

    for (let i = 0; i < totalProviders; i++) {
      // Random category
      const category = createdCategories[Math.floor(Math.random() * createdCategories.length)];
      const categoryName = category.name;
      const serviceInfo = serviceData[categoryName];

      // Random city
      const city = indianCities[Math.floor(Math.random() * indianCities.length)];

      // Generate names
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const ownerName = `${firstName} ${lastName}`;
      const serviceName = serviceInfo.names[Math.floor(Math.random() * serviceInfo.names.length)];

      // Generate data
      const email = generateEmail(ownerName);
      const phone = generatePhone();
      const address = generateAddress(city);
      const pricing = serviceInfo.pricing[Math.floor(Math.random() * serviceInfo.pricing.length)];
      const skills = serviceInfo.skills
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 2); // 2-4 random skills

      const description = `Professional ${categoryName.toLowerCase()} services in ${city.name}. ${serviceName} provides quality ${categoryName.toLowerCase()} solutions with ${generateExperience()}. Contact us for reliable and affordable services.`;

      // Add slight random variation to coordinates (within city area)
      const lat = city.lat + (Math.random() - 0.5) * 0.1;
      const lng = city.lng + (Math.random() - 0.5) * 0.1;

      const providerData = {
        ownerName,
        serviceName: `${serviceName} - ${city.name}`,
        description,
        email,
        password: 'Provider@123', // Default password for all providers
        phone,
        address,
        geolocation: {
          lat: parseFloat(lat.toFixed(6)),
          lng: parseFloat(lng.toFixed(6)),
        },
        category: category._id,
        pricing,
        ratings: generateRating(),
        skills,
        experience: generateExperience(),
        status: Math.random() > 0.2 ? 'approved' : 'pending', // 80% approved, 20% pending
        availability: {
          isAvailable: Math.random() > 0.1, // 90% available
        },
      };

      try {
        const provider = await Provider.create(providerData);
        providers.push(provider);
        if ((i + 1) % 20 === 0) {
          console.log(`Created ${i + 1}/${totalProviders} providers...`);
        }
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate email, skip
          console.log(`Skipping duplicate email: ${email}`);
        } else {
          console.error(`Error creating provider ${i + 1}:`, error.message);
        }
      }
    }

    console.log(`\n✅ Successfully created ${providers.length} service providers!`);
    console.log(`📊 Categories: ${createdCategories.length}`);
    console.log(`📍 Locations: ${indianCities.length} cities across India`);
    console.log('\nDefault password for all providers: Provider@123');
    console.log('\nYou can now login with any provider email and password: Provider@123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

