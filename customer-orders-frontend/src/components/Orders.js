import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ customerId: "", product: "", quantity: 1, price: 0, status: "Pending" });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchCustomers()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders. Please check if the backend is running on http://localhost:5000");
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/customers");
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      alert("Failed to load customers. Please check if the backend is running on http://localhost:5000");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerId || !form.product || !form.quantity || !form.price) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await axios.put(`http://localhost:5000/orders/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/orders", form);
      }
      setForm({ customerId: "", product: "", quantity: 1, price: 0, status: "Pending" });
      await fetchOrders();
    } catch (error) {
      console.error("Error saving order:", error);
      alert(error.response?.data?.message || "Error saving order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (order) => {
    setForm({
      customerId: order.customerId._id || order.customerId,
      product: order.product,
      quantity: order.quantity,
      price: order.price,
      status: order.status
    });
    setEditingId(order._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`http://localhost:5000/orders/${id}`);
        fetchOrders();
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Error deleting order");
      }
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/orders/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
    }
  };

  const handleCancel = () => {
    setForm({ customerId: "", product: "", quantity: 1, price: 0, status: "Pending" });
    setEditingId(null);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    return order.status.toLowerCase() === filter;
  });

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.price * order.quantity), 0);

  return (
    <div>
      <h2>📦 Order Management</h2>
      
      <div className="card">
        <h3>{editingId ? "Edit Order" : "Create New Order"}</h3>
        <form onSubmit={handleSubmit} className="form">
          <select 
            value={form.customerId} 
            onChange={e => setForm({ ...form, customerId: e.target.value })}
            required
          >
            <option value="">Select Customer *</option>
            {customers.map(customer => (
              <option key={customer._id} value={customer._id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>
          <input 
            placeholder="Product Name *" 
            value={form.product} 
            onChange={e => setForm({ ...form, product: e.target.value })}
            required
          />
          <input 
            type="number" 
            placeholder="Quantity *" 
            value={form.quantity} 
            onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) })}
            min="1"
            required
          />
          <input 
            type="number" 
            placeholder="Price (₹) *" 
            value={form.price} 
            onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })}
            min="0"
            step="0.01"
            required
          />
          <select 
            value={form.status} 
            onChange={e => setForm({ ...form, status: e.target.value })}
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
          <div>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Saving..." : (editingId ? "Update Order" : "Create Order")}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className="btn" style={{marginLeft: '10px', background: '#6c757d'}}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h3>Orders List ({filteredOrders.length}) - Total: ₹{totalRevenue.toLocaleString()}</h3>
          <div>
            <label>Filter: </label>
            <select value={filter} onChange={e => setFilter(e.target.value)} style={{marginLeft: '0.5rem'}}>
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <p>Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p>No orders found. Create your first order above!</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Status</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>{order.customerId?.name || "Unknown"}</td>
                  <td>{order.product}</td>
                  <td>{order.quantity}</td>
                  <td>₹{order.price.toLocaleString()}</td>
                  <td>₹{(order.price * order.quantity).toLocaleString()}</td>
                  <td>
                    <select 
                      value={order.status} 
                      onChange={e => handleStatusUpdate(order._id, e.target.value)}
                      className={`status ${order.status.toLowerCase()}`}
                      style={{border: 'none', background: 'transparent'}}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(order)}
                      className="btn btn-success"
                      style={{marginRight: '5px', padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(order._id)}
                      className="btn btn-danger"
                      style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
