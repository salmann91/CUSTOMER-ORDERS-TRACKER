import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchRecentOrders()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const fetchStats = async () => {
    try {
      const [customersRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:5000/customers"),
        axios.get("http://localhost:5000/orders")
      ]);
      
      const orders = ordersRes.data;
      const pendingCount = orders.filter(o => o.status === "Pending").length;
      const totalRevenue = orders.reduce((sum, o) => sum + (o.price * o.quantity), 0);

      setStats({
        totalCustomers: customersRes.data.length,
        totalOrders: orders.length,
        pendingOrders: pendingCount,
        totalRevenue
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/orders");
      setRecentOrders(res.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <h2>📊 Dashboard</h2>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>📊 Dashboard</h2>
      
      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{stats.totalCustomers}</div>
          <div className="stat-label">Total Customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pendingOrders}</div>
          <div className="stat-label">Pending Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">₹{stats.totalRevenue.toLocaleString()}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
      </div>

      <div className="card">
        <h3>🕒 Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.customerId?.name || "Unknown"}</td>
                  <td>{order.product}</td>
                  <td>{order.quantity}</td>
                  <td>₹{order.price.toLocaleString()}</td>
                  <td>
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}