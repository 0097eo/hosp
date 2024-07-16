import React from 'react';

function Logout({ onLogout }) {
  const handleLogout = async () => {
    try {
      onLogout();
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Logout
    </button>
  );
}

export default Logout;