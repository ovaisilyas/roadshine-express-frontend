import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../../static/css/Header.css";
import { useUser } from "../../UserContext";
import logo from "../../static/images/logo.jpg"

const Header = () => {
  const { user, setUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = user?.role === "Administrator";
  const isEmployee = user?.role === "Employee";
  const isUser = user?.role === "User";

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleSignOut = () => {
    // Clear user info from state and localStorage
    setUser(null);
    localStorage.removeItem("user");

    // Redirect to the sign-in page
    navigate("/signin");
  };

  return (
    <>
      <header className="header">
        <div className="logo-heading">
          <img className="logo-img" src={logo} alt="Roadshine Express LLC"/>
          <h1 className="header-logo" onClick={() => navigate("/")}>
            Roadshine Express LLC
          </h1>
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        {user ? (
          <div className="signin">
            <p className="signin-username">Hello, {user.first_name}!</p>
            <button className="signout-button" onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <button onClick={() => navigate("/signin")}>Sign In</button>
        )}
      </header>
      <nav>
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li onClick={() => navigate("/")}>Home</li>
          {isUser && (
            <>
              <li onClick={() => navigate("/user")}>Place Order</li>
              <li onClick={() => navigate("/user/orders")}>Orders</li>
            </>
          )}
          {isAdmin && (
            <>
              <li onClick={() => navigate("/admin")}>Dashboard</li>
              <li onClick={() => navigate("/admin/manage-truck-companies")}>Manage Truck Companies</li>
              <li onClick={() => navigate("/admin/manage-trucks")}>Manage Trucks</li>
              <li onClick={() => navigate("/admin/manage-users")}>Manage Users</li>
              <li onClick={() => navigate("/admin/manage-orders")}>Manage Orders</li>
              <li onClick={() => navigate("/admin/invoice-list")}>Invoicing</li>
              <li onClick={() => navigate("/admin/reports")}>Reports</li>
            </>
          )}
          {isEmployee && (
            <>
              <li onClick={() => navigate("/admin")}>Dashboard</li>
              <li onClick={() => navigate("/admin/manage-truck-companies")}>Manage Truck Companies</li>
              <li onClick={() => navigate("/admin/manage-trucks")}>Manage Trucks</li>
              <li onClick={() => navigate("/admin/manage-orders")}>Manage Orders</li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Header;