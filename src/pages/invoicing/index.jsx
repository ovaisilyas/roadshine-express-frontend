import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import "../../static/css/Invoicing.css"
import apiClient from "../../utils/ApiClient";

const InvoicePage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    truckCompany: "",
    truckType: "",
    orderDate: "",
    company: "",
  });
  const [invoiceLink, setInvoiceLink] = useState("");

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleGenerateInvoice = async () => {
    try {
      const response = await apiClient.post(`/invoices`, filters);
      setInvoiceLink(response.data.filePath);
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("Failed to generate invoice. Please try again.");
    }
  };

  return (
    <div className="invoice-page">
      <Header user={user} setUser={setUser}/>
      <h2>Generate Invoice</h2>
      <form>
        <label>Truck Company:</label>
        <select name="truckCompany" value={filters.truckCompany} onChange={handleChange}>
          <option value="">All</option>
          <option value="Adam's">Adam's</option>
          <option value="Averitt">Averitt</option>
          <option value="Western">Western</option>
          <option value="Western Star">Western Star</option>
          <option value="Titans">Titans</option>
        </select>

        <label>Truck Type:</label>
        <select name="truckType" value={filters.truckType} onChange={handleChange}>
          <option value="">All</option>
          <option value="Day Cab">Day Cab</option>
          <option value="Sleeper">Sleeper</option>
        </select>

        <label>Order Date:</label>
        <input type="date" name="orderDate" value={filters.orderDate} onChange={handleChange} />

        <label>Company:</label>
        <select name="company" value={filters.company} onChange={handleChange}>
          <option value="">All</option>
          <option value="Velocity">Velocity</option>
          <option value="Kenworth">Kenworth</option>
          <option value="Volvo">Volvo</option>
          <option value="International">International</option>
          <option value="Peterbilt">Peterbilt</option>
          <option value="Custom">Custom</option>
        </select>

        <button onClick={handleGenerateInvoice}>Generate Invoice</button>
        <button onClick={() => navigate("/admin/invoice-list")}>Back to Invoice List</button>
      </form>

      {invoiceLink && (
        <div>
          <p>Invoice generated successfully!</p>
          <a href={`/${invoiceLink}`} download>
            Download Invoice
          </a>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default InvoicePage;
