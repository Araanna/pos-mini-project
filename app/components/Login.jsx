import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Row } from "react-bootstrap";
import "./style.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const url = "http://localhost/API/pos_login_1.php"; // Ensure this URL is correct
      try {
        const response = await axios.get(url, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("Fetched users:", response.data);
        // Ensure the response.data structure is correct
        if (response.data && typeof response.data === "object") {
          setUsers(response.data);
        } else {
          setError("Unexpected response format.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again later.");
      }
    };

    fetchUsers();
  }, []);

  const handleLogin = () => {
    setError("");
    console.log("Users in handleLogin:", users);
    if (users[username] && users[username].password === password) {
      const user = { username, fullname: users[username].fullname };
      onLogin(user);
      navigate("/pos"); // Navigate to POS page on successful login
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <>
      <body>
        <div class="container">
          <div class="bubble">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="bubble">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="bubble">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="bubble">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="bubble">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <Row className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center ">
          {" "}
          <div className="relative">
            <div className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg animate-pulse"></div>
            <div className="bg-white p-16 rounded-lg shadow-2xl w-80 relative z-10 transform transition duration-500 ease-in-out">
              <h2 className="text-center text-3xl font-bold mb-10 text-gray-900">
                Login
              </h2>
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <input
                  type="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-900 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:ring-offset-gray-800 text-white"
                  placeholder="username"
                  required
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  class="bg-slate-900 w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:ring-offset-2 focus:ring-offset-gray-800 text-white"
                  placeholder="Password"
                  required
                />
                <button
                  type="submit"
                  className="w-full h-12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Sign in
                </button>
                {error && <p className="text-red-600 text-center">{error}</p>}
              </form>
            </div>
          </div>
        </Row>
      </body>{" "}
    </>
  );
};

export default Login;
