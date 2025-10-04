const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const Order = require('./models/Order');
require('dotenv').config();

// Sample data
const sampleCustomers = [
  { name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St' },
  { name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', address: '456 Oak Ave' },
  { name: 'Bob Johnson', email: 'bob@example.com', phone: '5555555555', address: '789 Pine Rd' }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ordersdb');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Customer.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Insert customers
    const customers = await Customer.insertMany(sampleCustomers);
    console.log('👥 Added sample customers');

    // Insert sample orders
    const sampleOrders = [
      { customerId: customers[0]._id, product: 'Laptop', quantity: 1, price: 50000, status: 'Pending' },
      { customerId: customers[1]._id, product: 'Mouse', quantity: 2, price: 1500, status: 'Shipped' },
      { customerId: customers[0]._id, product: 'Keyboard', quantity: 1, price: 3000, status: 'Delivered' },
      { customerId: customers[2]._id, product: 'Monitor', quantity: 1, price: 25000, status: 'Pending' }
    ];

    await Order.insertMany(sampleOrders);
    console.log('📦 Added sample orders');

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();