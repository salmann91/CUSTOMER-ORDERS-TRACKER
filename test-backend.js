const axios = require('axios');

async function testBackend() {
  try {
    console.log('🧪 Testing Backend Connection...');
    
    // Test root endpoint
    const rootRes = await axios.get('http://localhost:5000/');
    console.log('✅ Root endpoint:', rootRes.data);
    
    // Test customers endpoint
    const customersRes = await axios.get('http://localhost:5000/customers');
    console.log('✅ Customers endpoint:', customersRes.data.length, 'customers found');
    
    // Test orders endpoint
    const ordersRes = await axios.get('http://localhost:5000/orders');
    console.log('✅ Orders endpoint:', ordersRes.data.length, 'orders found');
    
    console.log('🎉 Backend is working correctly!');
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.log('💡 Make sure to:');
    console.log('   1. Start MongoDB: net start MongoDB');
    console.log('   2. Start backend: cd customer-orders-backend && npm run dev');
    console.log('   3. Seed data: cd customer-orders-backend && npm run seed');
  }
}

testBackend();