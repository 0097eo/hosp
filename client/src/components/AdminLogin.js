//login
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

function AdminLogIn({setLoggedIn, loggedIn}) {
  const Navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const resetLoggedIn = (state) => {
    return new Promise((resolve) => {
      setLoggedIn(state);
      resolve();
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        await resetLoggedIn(true);
        console.log(data,response.status,loggedIn);
        Navigate('/admin_dashboard')
      }
    }
    catch (error) {
      console.error("Login failed:", error.message);
    }
  };
console.log(loggedIn)
  return (
    <>
    <Navbar/>
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Login as Admin.</h1>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter your username"
            onChange={handleChange}
            name="username"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter your password"
            onChange={handleChange}
            name="password"
          />
        </div>
        <button type="submit" className="btn btn-info">Log In</button>
      </form>
    </div>
    </>
  );
}

export default AdminLogIn;
