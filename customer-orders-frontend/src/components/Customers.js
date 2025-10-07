import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from '../config';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/customers`);
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      alert("Failed to load customers. Please check if the backend is running on http://localhost:5000");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      alert("Please fill in required fields");
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await axios.put(`${API_URL}/customers/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/customers`, form);
      }
      setForm({ name: "", email: "", phone: "", address: "" });
      await fetchCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
      alert(error.response?.data?.message || "Error saving customer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (customer) => {
    setForm(customer);
    setEditingId(customer._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`${API_URL}/customers/${id}`);
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("Error deleting customer");
      }
    }
  };

  const handleCancel = () => {
    setForm({ name: "", email: "", phone: "", address: "" });
    setEditingId(null);
  };

  return (
    <div>
      <h2>👥 Customer Management</h2>
      
      <div className="card">
        <h3>{editingId ? "Edit Customer" : "Add New Customer"}</h3>
        <form onSubmit={handleSubmit} className="form">
          <input 
            placeholder="Name *" 
            value={form.name} 
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input 
            type="email"
            placeholder="Email *" 
            value={form.email} 
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <input 
            placeholder="Phone *" 
            value={form.phone} 
            onChange={e => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input 
            placeholder="Address" 
            value={form.address} 
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
          <div>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Saving..." : (editingId ? "Update Customer" : "Add Customer")}
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
        <h3>Customer List ({customers.length})</h3>
        {loading ? (
          <p>Loading customers...</p>
        ) : customers.length === 0 ? (
          <p>No customers found. Add your first customer above!</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.address || "N/A"}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(customer)}
                      className="btn btn-success"
                      style={{marginRight: '10px', padding: '0.5rem 1rem'}}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(customer._id)}
                      className="btn btn-danger"
                      style={{padding: '0.5rem 1rem'}}
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
