import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import "../../static/css/AdminDashboard.css";

const AdminDashboard = ({ user, setUser }) => {
    const navigate = useNavigate();
    const isAdmin = user?.role === "Administrator";
    const isEmployee = user?.role === "Employee";

  return (
    <div className="dashboard">
      <Header user={user} setUser={setUser}/>
      <main>
        <section className="links-section">
          <h2>Admin Options</h2>
          <ul>
            {isAdmin && (
              <>
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
                <li onClick={() => navigate("/admin/manage-truck-companies")}>Manage Truck Companies</li>
                <li onClick={() => navigate("/admin/manage-trucks")}>Manage Trucks</li>
                <li onClick={() => navigate("/admin/manage-orders")}>Manage Orders</li>
              </>
            )}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;