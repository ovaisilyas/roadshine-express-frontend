import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../static/css/Header.css";

const Header = ({ user, setUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = user?.role === "Administrator";

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSignOut = () => {
    // Clear user info from state and localStorage
    setUser(null);
    localStorage.removeItem("user");

    // Redirect to the sign-in page
    navigate("/signin");
  };

  return (
    <header className="header">
      <h1>Roadshine Express</h1>
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <nav>
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li onClick={() => navigate("/")}>Home</li>
          {isAdmin && (
            <>
              <li onClick={() => navigate("/admin/manage-trucks")}>Manage Trucks</li>
              <li onClick={() => navigate("/admin/manage-users")}>Manage Users</li>
              <li onClick={() => navigate("/admin/manage-orders")}>Manage Orders</li>
              <li onClick={() => navigate("/admin/invoicing")}>Invoicing</li>
              <li onClick={() => navigate("/admin/reports")}>Reports</li>
            </>
          )}
        </ul>
        {user ? (
            <div className="signin">
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