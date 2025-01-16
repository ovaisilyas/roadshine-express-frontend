import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../static/css/Header.css";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const handleSignOut = () => {
    // Clear user info from state and localStorage
    setUser(null);
    localStorage.removeItem("user");

    // Redirect to the sign-in page
    navigate("/signin");
  };

  return (
    <header className="header">
      <h1>Truck Wash Services</h1>
      <nav>
        <button onClick={() => navigate("/")}>Home</button>
        {user ? (
          <div>
            <p>Hello, {user.first_name}!</p>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <button onClick={() => navigate("/signin")}>Sign In</button>
        )}
      </nav>
    </header>
  );
};

export default Header;