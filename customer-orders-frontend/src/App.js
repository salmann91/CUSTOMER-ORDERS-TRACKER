import { useState } from "react";
import Customers from "./components/Customers";
import Orders from "./components/Orders";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="app">
      <header className="header">
        <h1>🛒 Customer Orders Management</h1>
        <nav className="nav">
          <button 
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </button>
          <button 
            className={activeTab === "customers" ? "active" : ""}
            onClick={() => setActiveTab("customers")}
          >
            👥 Customers
          </button>
          <button 
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            📦 Orders
          </button>
        </nav>
      </header>

      <main className="main">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "customers" && <Customers />}
        {activeTab === "orders" && <Orders />}
      </main>
    </div>
  );
}

export default App;
