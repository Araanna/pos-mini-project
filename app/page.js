"use client";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import POS from "./Point-of-Sale/Dashboard";

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (user) => {
    setUser(user);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/pos" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/pos"
          element={
            user ? <POS user={user} setUser={setUser} /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
