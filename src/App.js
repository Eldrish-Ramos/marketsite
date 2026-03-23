
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import AdminLogin from "./components/AdminLogin";

const AdminPanel = React.lazy(() => import("./components/AdminPanel")); // Placeholder for future admin panel

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <Header />
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin/login"
            element={<AdminLogin onLogin={() => setIsAdmin(true)} />}
          />
          <Route
            path="/admin"
            element={
              isAdmin ? <AdminPanel /> : <Navigate to="/admin/login" replace />
            }
          />
        </Routes>
      </React.Suspense>
      <Footer />
    </div>
  );
}

export default App;
