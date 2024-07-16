import React, { useState } from "react";
import Navbar from "../navbar";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    contact_number: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Reset the form data to its initial state
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        contact_number: '',
        email: '',
        password: ''
      });
      alert("Account created successfully");
      navigate('/login');
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to create account. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup">
        <form onSubmit={handleSubmit}>
          <h3>Create An Account</h3>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input type="text" className="form-control" id="username" placeholder="Enter your user name" onChange={handleChange} name="username" value={formData.username} />
          </div>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First name</label>
            <input type="text" className="form-control" id="firstName" placeholder="Enter your first name" onChange={handleChange} name="first_name" value={formData.first_name} />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Last name</label>
            <input type="text" className="form-control" id="lastName" placeholder="Enter your last name" onChange={handleChange} name="last_name" value={formData.last_name} />
          </div>
          <div className="mb-3">
            <label htmlFor="dob" className="form-label">Date of Birth</label>
            <input type="date" className="form-control" id="dob" onChange={handleChange} name="date_of_birth" value={formData.date_of_birth} />
          </div>
          <div className="mb-3">
            <label htmlFor="contactNumber" className="form-label">Contact Number</label>
            <input type="text" className="form-control" id="contactNumber" placeholder="Enter your number" onChange={handleChange} name="contact_number" value={formData.contact_number} />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" placeholder="name@example.com" onChange={handleChange} name="email" value={formData.email} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Enter your password" onChange={handleChange} name="password" value={formData.password} />
          </div>
          <button type="submit" className="btn btn-info">Register</button>
        </form>
      </div>
    </>
  );
}

export default SignUp;