"use client";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";

import AdminDashboard from "./Admin/admin"; // Adjust the path as needed
import POS from "./Point-of-Sale/Dashboard";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/admin" element={<AdminDashboard user={user} />} />
        <Route path="/pos" element={<POS user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
