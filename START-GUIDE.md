# 🚀 Quick Start Guide

## Step 1: Start MongoDB
```bash
net start MongoDB
```

## Step 2: Start Backend
```bash
cd customer-orders-backend
npm install
npm run seed
npm run dev
```
Backend will run on http://localhost:5000

## Step 3: Start Frontend
```bash
cd customer-orders-frontend
npm install
npm start
```
Frontend will run on http://localhost:3000

## Step 4: Test Backend (Optional)
```bash
node test-backend.js
```

## 🔧 Troubleshooting

**If frontend shows no data:**
1. Check if backend is running on http://localhost:5000
2. Check browser console for CORS errors
3. Verify MongoDB is running
4. Run seed script: `npm run seed` in backend folder

**Common Issues:**
- MongoDB not running → `net start MongoDB`
- Backend not started → `cd customer-orders-backend && npm run dev`
- No sample data → `cd customer-orders-backend && npm run seed`
- CORS errors → Backend should have CORS enabled (already configured)