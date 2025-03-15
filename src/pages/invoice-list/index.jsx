import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/ApiClient";
import Header from "../../components/header";
import Footer from "../../components/footer";
import "../../static/css/InvoiceList.css";

const InvoiceList = ({ user }) => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await apiClient.get("/invoices");
      setInvoices(response.data.invoices);
      setFilteredInvoices(response.data.invoices);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (invoiceId, newStatus) => {
    try {
      await apiClient.put(`/invoices/${invoiceId}/status`, { status: newStatus });
      fetchInvoices();
    } catch (error) {
      console.error("Error updating invoice status:", error);
    }
  };

  const handleFilterChange = (status) => {
    setSelectedStatus(status);
    if (status) {
      setFilteredInvoices(invoices.filter(invoice => invoice.status === status));
    } else {
      setFilteredInvoices(invoices);
    }
  };

  const handleDownloadInvoice = async (invoiceId) => {
    try {
      const response = await apiClient.get(`/invoices/download/${invoiceId}`, {
          responseType: "blob", // Required to handle binary data
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank"); // Open PDF in a new tab

    } catch (error) {
        console.error("Error downloading invoice:", error);
    }
  };

  const handleSendInvoice = async (invoiceId) => {
    try {
      await apiClient.post(`/invoices/send-invoice/${invoiceId}`);
    } catch (error) {
        console.error("Error sending invoice:", error);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    try {

      await apiClient.delete(`/invoices/${invoiceId}`);
      alert("Invoice deleted successfully!");
      fetchInvoices();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  if (loading) return <p>Loading invoices...</p>;

  return (
    <div className="invoice-list-page">
      <Header user={user} />
      <div className="invoice-list-head">
        <h2>Invoice List</h2>

        <button onClick={() => navigate("/admin/invoicing")}>
            Generate Invoice
        </button>
      </div>

      {/* Status Filter */}
      <label>Filter by Status:</label>
      <select value={selectedStatus} onChange={(e) => handleFilterChange(e.target.value)}>
        <option value="">All</option>
        <option value="Pending">Pending</option>
        <option value="Sent">Sent</option>
        <option value="Completed">Completed</option>
        <option value="Paid">Paid</option>
      </select>

      {/* Invoice Table */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>PO Number</th>
            <th>Company</th>
            <th>Truck Category</th>
            <th>Total Amount</th>
            <th>Invoice Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.length === 0 ? (
            <tr>
              <td colSpan="7">No invoices found</td>
            </tr>
          ) : (
            filteredInvoices.map((invoice) => (
              <tr key={invoice.invoice_id}>
                <td>{invoice.invoice_number}</td>
                <td>{invoice.po_number}</td>
                <td>{invoice.company}</td>
                <td>{invoice.truck_category}</td>
                <td>${parseFloat(invoice.total_amount).toFixed(2)}</td>
                <td>{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                <td>
                  <select value={invoice.status} onChange={(e) => handleStatusChange(invoice.invoice_id, e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Sent">Sent</option>
                    <option value="Completed">Completed</option>
                    <option value="Paid">Paid</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDownloadInvoice(invoice.invoice_id)}>Download</button>
                  <button onClick={() => handleSendInvoice(invoice.invoice_id)}>Send Email</button>
                  <button className="delete-btn" onClick={() => handleDeleteInvoice(invoice.invoice_id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Footer />
    </div>
  );
};

export default InvoiceList;