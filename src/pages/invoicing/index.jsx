import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Footer from "../../components/footer";
import Header from "../../components/header";
import "../../static/css/Invoicing.css";
import apiClient from "../../utils/ApiClient";

const InvoicePage = ({ user, setUser }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedTruckCompanies, setSelectedTruckCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [truckCategory, setTruckCategory] = useState("New");
  const [poNumber, setPoNumber] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("000001");
  const [completedOrders, setCompletedOrders] = useState([]);
  const [uniqueTruckCompanies, setUniqueTruckCompanies] = useState([]);

  useEffect(() => {
      fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
      try {
          const response = await apiClient.get("/trucks/companies");
          setCompanies(response.data.map((c) => c.company));
      } catch (error) {
          console.error("Error fetching companies:", error);
      }
  };

  const fetchTruckCompanies = async (company) => {
      if(company === "") {
          setSelectedCompany("");
          return;
      }

      setSelectedCompany(company);
      try {
          const response = await apiClient.get(`/trucks/truckcompanies?company=${company}`);
          const companies = response.data;
          console.log(companies);
          const distinctCompanies = [...new Set(companies.map((c) => c.truck_company))];
          setUniqueTruckCompanies(distinctCompanies);
      } catch (error) {
          console.error("Error fetching truck companies:", error);
      }

  };

  const handleTruckCompanyChange = (e) => {
    setSelectedTruckCompanies([...e.target.selectedOptions].map(opt => opt.value));
  }

  const companyAddresses = {
    "Velocity": "Velocity Truck Centers\nTravis Romelhardt\n5868547491\nKcrawford@vvgtruck.com",
    "Volvo": "456 Volvo Blvd\nNashville, TN 37210\nUSA",
    "International": "789 International Rd\nDallas, TX 75201\nUSA",
    "Peterbilt": "101 Peterbilt Way\nHouston, TX 77002\nUSA",
    "Kenworth": "202 Kenworth Lane\nMiami, FL 33101\nUSA",
    "Custom": "Custom Address\nPlease Contact Admin"
  };

  useEffect(() => {
    fetchCompletedTrucks();
  }, []);

  const fetchCompletedTrucks = async () => {
    try {
      const response = await apiClient.get("/orders/completed");
      setCompletedOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching completed trucks:", error);
    }
  };

  // Convert invoice HTML to PDF
  const exportToPDF = async (id) => {
    const invoiceElement = document.getElementById(`invoice-${id}`);
    const canvas = await html2canvas(invoiceElement, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save(`Invoice_${id}.pdf`);
  };

  // Filtered Orders Based on Selection
  const filteredOrders = completedOrders.filter(order =>
    selectedTruckCompanies.includes(order.truck_company) &&
    selectedCompany === order.company &&
    order.category === truckCategory
  );

  const totalAmount = filteredOrders.reduce((total, order) => total + parseFloat(order.totalprice || 0), 0);

  return (
    <div className="invoice-page">
      <Header user={user} setUser={setUser} />
      <div className="invoice-body">
        <h2>Generate Invoice</h2>

        <label>Invoice Number</label>
        <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />

        <label>Company:</label>
        <select value={selectedCompany} onChange={(e) => fetchTruckCompanies(e.target.value)}>
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>

        <label>Truck Companies:</label>
        <select multiple value={selectedTruckCompanies} onChange={(e) => handleTruckCompanyChange(e)}>
          {uniqueTruckCompanies.map((company) => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>

        <label>Truck Category:</label>
        <select value={truckCategory} onChange={(e) => setTruckCategory(e.target.value)}>
          <option value="New">New</option>
          <option value="Used">Used</option>
        </select>

        {truckCategory === "Used" && (
          <>
            <label>PO Number</label>
            <input type="text" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
          </>
        )}

        <div className="invoice-container">
          {/* Combined Invoice for New Trucks */}
          {truckCategory === "New" && (
            <div className="invoice-wrapper">
              <div id="invoice-new" className="invoice-template">
                <div className="invoice-header">
                  <h1>Rhus Logistics LLC</h1>
                  <p>3043 Sagpate Ln, Nashville, TN 37207</p>
                  <p>Email: rhuslogistics@gmail.com</p>
                </div>
                <table className="invoice-details">
                  <tbody>
                    <tr>
                      <td><strong>Invoice Number:</strong> {invoiceNumber}</td>
                      <td><strong>Invoice Date:</strong> {new Date().toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <td><strong>Amount Due:</strong> ${totalAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
                <h3>Bill To:</h3>
                <p className="invoice-address">{companyAddresses[selectedCompany] || "Address Not Available"}</p>
                <table className="invoice-items">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr key={index}>
                        <td>{order.truck_company} {order.truck_type} New Truck {order.vin_no}</td>
                        <td>1</td>
                        <td>${order.price}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="2"><strong>Total:</strong></td>
                      <td><strong>${totalAmount.toFixed(2)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button className="export-btn" onClick={() => exportToPDF("new")}>Export as PDF</button>
            </div>
          )}

          {/* Separate Invoices for Used Trucks */}
          {truckCategory === "Used" && filteredOrders.map((order, index) => (
            <div key={index} className="invoice-wrapper">
              <div id={`invoice-${order.vin_no}`} className="invoice-template">
                <div className="invoice-header">
                  <h1>Roadshine Express</h1>
                  <p>3043 Sagpate Ln, Nashville, TN 37207</p>
                  <p>Email: roadshineexpress@gmail.com</p>
                </div>
                <table className="invoice-details">
                  <tbody>
                    <tr>
                      <td><strong>Invoice Number:</strong> {invoiceNumber}</td>
                      <td><strong>PO Number:</strong> {poNumber}</td>
                    </tr>
                    <tr>
                      <td><strong>Invoice Date:</strong> {new Date().toLocaleDateString()}</td>
                      <td><strong>Amount Due:</strong> ${order.totalprice}</td>
                    </tr>
                  </tbody>
                </table>
                <h3>Bill To:</h3>
                <p className="invoice-address">{companyAddresses[order.company] || "Address Not Available"}</p>
                <table className="invoice-items">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Truck {order.vin_no} <br />
                      {order.services}</td>
                      <td>1</td>
                      <td>${order.price}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button className="export-btn" onClick={() => exportToPDF(order.vin_no)}>Export as PDF</button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InvoicePage;
