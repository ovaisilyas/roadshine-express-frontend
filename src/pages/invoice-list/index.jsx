import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import "../../static/css/InvoiceList.css"
import apiClient from "../../utils/ApiClient";

const InvoiceList = ({ user, setUser }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await apiClient.get(`/invoices`);
        setInvoices(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Failed to fetch invoices.");
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) return <p>Loading invoices...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="invoice-list">
      <Header user={user} setUser={setUser}/>
      <div className="invoice-header">
        <h2>Generated Invoices</h2>
        <button onClick={() => navigate("/admin/invoicing")}>Generate Invoice</button>
      </div>
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <ul>
          {invoices.map((invoice) => (
            <li key={invoice.name}>
              <a href={invoice.url} target="_blank" rel="noopener noreferrer" download>
                {invoice.name}
              </a>
            </li>
          ))}
        </ul>
      )}
      <Footer />
    </div>
  );
};

export default InvoiceList;
