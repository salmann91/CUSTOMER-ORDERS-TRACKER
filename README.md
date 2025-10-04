# Customer Orders Management System

A full-stack application for managing customers and their orders using Node.js, Express, MongoDB, and React.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- npm or yarn

## Setup Instructions

### 1. Install MongoDB
Make sure MongoDB is installed and running on your system:
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or start manually
mongod --dbpath "C:\data\db"
```

### 2. Backend Setup
```bash
cd customer-orders-backend
npm install
npm run dev
```
Backend will run on http://localhost:5000

### 3. Frontend Setup
```bash
cd customer-orders-frontend
npm install
npm start
```
Frontend will run on http://localhost:3000

## API Endpoints

### Customers
- `GET /customers` - Get all customers
- `POST /customers` - Create new customer
- `GET /customers/:id` - Get customer by ID
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Orders
- `GET /orders` - Get all orders
- `POST /orders` - Create new order
- `GET /orders/customer/:customerId` - Get orders by customer
- `PUT /orders/:id` - Update order
- `DELETE /orders/:id` - Delete order

## Usage

1. Start MongoDB service
2. Run backend: `npm run dev` in backend folder
3. Run frontend: `npm start` in frontend folder
4. Access application at http://localhost:3000

## Database Schema

### Customer
```json
{
  "name": "String (required)",
  "email": "String (required, unique)",
  "phone": "String (required)",
  "address": "String (optional)"
}
```

### Order
```json
{
  "customerId": "ObjectId (required)",
  "product": "String (required)",
  "quantity": "Number (required, min: 1)",
  "price": "Number (required)",
  "status": "String (Pending/Shipped/Delivered)",
  "orderDate": "Date (auto-generated)"
}
```