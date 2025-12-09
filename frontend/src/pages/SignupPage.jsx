// frontend/src/pages/SignupPage.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios.js";

const SignupPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (credentials.password !== credentials.confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }
    
    if (!credentials.username || !credentials.password) {
        toast.error("Username and password are required.");
        setLoading(false);
        return;
    }


    try {
      await api.post("/users/register", {
        username: credentials.username,
        password: credentials.password,
      });

      toast.success("Account created successfully! Please log in.");
      navigate("/login"); 

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed. Try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="label text-base-content/70">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              className="input input-bordered w-full bg-base-200 text-base-content"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="label text-base-content/70">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="input input-bordered w-full bg-base-200 text-base-content"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="label text-base-content/70">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="input input-bordered w-full bg-base-200 text-base-content"
              value={credentials.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full text-lg" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        
        <p className="text-center text-base-content/70 mt-4">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};
export default SignupPage;