import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import "../../static/css/AdminDashboard.css";

const AdminDashboard = ({ user, setUser }) => {
    const [vin, setVin] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
      e.preventDefault();
      // Navigate to search results page or fetch data
      console.log(`Searching for VIN: ${vin}`);
      alert(`Searching for VIN: ${vin}`);
    };

  return (
    <div className="dashboard">
      <Header user={user} setUser={setUser}/>
      <main>
        <section className="links-section">
          <h2>Admin Options</h2>
          <ul>
            <li onClick={() => navigate("/admin/manage-truck-companies")}>Manage Truck Companies</li>
            <li onClick={() => navigate("/admin/manage-trucks")}>Manage Trucks</li>
            <li onClick={() => navigate("/admin/manage-users")}>Manage Users</li>
            <li onClick={() => navigate("/admin/manage-orders")}>Manage Orders</li>
            <li onClick={() => navigate("/admin/invoice-list")}>Invoicing</li>
            <li onClick={() => navigate("/admin/reports")}>Reports</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;