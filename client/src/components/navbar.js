import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
<nav class="navbar navbar-expand-sm bg-light">
  <div class="container">
    <a class="navbar-brand" href="/">Careconnect</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto"> <li class="nav-item">
          <Link to="/" class="nav-link active">Home</Link> </li>
        <li class="nav-item">
          <Link to="/login" class="nav-link">Login</Link>
        </li>
        <li class="nav-item">
          <Link to="/about-us" class="nav-link">About Us</Link>
        </li>
        <li class="nav-item">
          <Link to="/admin" class="nav-link">Admin</Link>
        </li>
        <li class="nav-item">
          <Link to="/profile" class="nav-link">Profile</Link>
        </li>
      </ul>
    </div>
  </div>
</nav>

  );
}

export default Navbar;