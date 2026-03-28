
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import AdminLogin from "./components/AdminLogin";
import ProductDetail from "./components/ProductDetail";

const AdminPanel = React.lazy(() => import("./components/AdminPanel")); // Placeholder for future admin panel

function App() {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("adminToken") || "");

  const handleLogin = (token) => {
    localStorage.setItem("adminToken", token);
    setAdminToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setAdminToken("");
  };

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <Header />
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/items/:id" element={<ProductDetail />} />
          <Route
            path="/admin/login"
            element={<AdminLogin onLogin={handleLogin} />}
          />
          <Route
            path="/admin"
            element={
              adminToken ? (
                <AdminPanel adminToken={adminToken} onLogout={handleLogout} />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />
        </Routes>
      </React.Suspense>
      <Footer />
    </div>
  );
}

export default App;
