import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const obj = { email, password };

    try {
      const response = await axios.post(
        "https://backend-6oku.onrender.com/api/login",
        obj
      );

      if (response.data.msg === "User not found") {
        return alert("User not found! Please sign up first.");
      }

      if (response.data.msg === "Invalid password") {
        return alert("Incorrect email or password. Try again!");
      }
      if (response.data.msg === "Login successful") {
        console.log(response.data.user._id);

        // Save token and user data
        localStorage.setItem("chat-token", response.data.token);
        localStorage.setItem("user", response.data.user); // Store full user object

        navigate("/chat"); // Redirect to chat page
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong! Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/signup" className="text-blue-500 hover:underline">
            Don't have an account? Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
