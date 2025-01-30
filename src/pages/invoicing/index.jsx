import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Footer from "../../components/footer";
import Header from "../../components/header";
import "../../static/css/Invoicing.css"
import apiClient from "../../utils/ApiClient";

const InvoicePage = ({ user, setUser }) => {
  const [selectedTruckCompanies, setSelectedTruckCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [truckCategory, setTruckCategory] = useState("New");
  const [poNumber, setPoNumber] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("000001");
  const [completedOrders, setCompletedOrders] = useState([]);

  const truckCompanies = ["Adam's", "Averitt", "Western", "Western Star", "Titans", "Custom"];
  const companies = ["Velocity", "Peterbilt", "International", "Volvo", "Kenworth", "Custom"];

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
  const exportToPDF = async (companyOrVin) => {
    const invoiceElement = document.getElementById(`invoice-${companyOrVin}`);
    const canvas = await html2canvas(invoiceElement, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save(`Invoice_${companyOrVin}.pdf`);
  };

  // Filtered Orders Based on Selection
  const filteredOrders = completedOrders.filter(order =>
    selectedTruckCompanies.includes(order.truck_company) &&
    selectedCompany === order.company
  );

  // Group "New" Trucks by Truck Company
  const groupedNewTrucks = {};
  filteredOrders.forEach(order => {
    if (order.category === "New") {
      if (!groupedNewTrucks[order.truck_company]) {
        groupedNewTrucks[order.truck_company] = [];
      }
      groupedNewTrucks[order.truck_company].push(order);
    }
  });

  return (
    <div className="invoice-page">
      <Header user={user} setUser={setUser}/>
        <div className="invoice-body">
          <h2>Generate Invoice</h2>

          <label>Invoice Number</label>
          <input type="text" name="invoiceNumber" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />


          {/* Select Truck Companies */}
          <label>Truck Companies:</label>
          <select multiple value={selectedTruckCompanies} onChange={(e) => {
              setSelectedTruckCompanies([...e.target.selectedOptions].map(opt => opt.value));
            }}>
            {truckCompanies.map((company) => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>

          {/* Select Truck Type */}
          <label>Truck Category:</label>
          <select value={truckCategory} onChange={(e) => setTruckCategory(e.target.value)}>
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>

          {truckCategory === "Used" && (
            <>
              <label>PO Number</label>
              <input type="text" name="poNumber" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
            </>
          )}

          {/* Select Truck Company */}
          <label>Company:</label>
          <select value={selectedCompany} onChange={(e) => {
              const newValue = e.target.value;
              setSelectedCompany(newValue);
            }}>
              <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
          <div className="invoice-container">
          {/* Display Used Truck Invoices */}
          {truckCategory === "Used"
            ? filteredOrders.map((order, index) => (
              <div key={index} className="invoice-wrapper">
                <div id={`invoice-${order.vin_no}`} className="invoice-template">
                  <div className="invoice-header">
                    <h1>Rhus Logistics LLC</h1>
                    <p>3043 Sagpate Ln, Nashville, TN 37207</p>
                    <p>Email: rhuslogistics@gmail.com</p>
                  </div>
                  <table className="invoice-details">
                    <tbody>
                      <tr>
                          <td><strong>Invoice Number:</strong> <span id="invoice-number">{invoiceNumber}</span></td>
                          <td><strong>PO Number:</strong> <span id="po-number">{poNumber}</span></td>
                      </tr>
                      <tr>
                          <td><strong>Invoice Date:</strong> <span id="invoice-date">{new Date().toLocaleDateString()}</span></td>
                          <td><strong>Payment Due:</strong> <span id="payment-due"></span></td>
                      </tr>
                      <tr>
                          <td colspan="2"><strong>Amount Due (USD):</strong> $<span id="amount-due">{order.price}</span></td>
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
                    <tbody id="items-list">
                      <tr>
                        <td>{order.truck_company} {order.truck_type} Used Truck {order.vin_no}</td>
                        <td>1</td>
                        <td>${order.price}</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td><strong>Total:</strong></td>
                        <td><strong>${order.price}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="invoice-footer">
                  </div>
                </div>
                <button className="export-btn" onClick={() => exportToPDF(order.vin_no)}>Export as PDF</button>
              </div>
            ))
            : Object.entries(groupedNewTrucks).map(([company, trucks]) => (
              <div key={company} className="invoice-wrapper">
                <div id={`invoice-${company}`} className="invoice-template">
                <div className="invoice-header">
                    <h1>Rhus Logistics LLC</h1>
                    <p>3043 Sagpate Ln, Nashville, TN 37207</p>
                    <p>Email: rhuslogistics@gmail.com</p>
                  </div>
                  <table className="invoice-details">
                    <tbody>
                      <tr>
                          <td><strong>Invoice Number:</strong> <span id="invoice-number">{invoiceNumber}</span></td>
                          <td><strong>PO Number:</strong> <span id="po-number"></span></td>
                      </tr>
                      <tr>
                          <td><strong>Invoice Date:</strong> <span id="invoice-date">{new Date().toLocaleDateString()}</span></td>
                          <td><strong>Payment Due:</strong> <span id="payment-due"></span></td>
                      </tr>
                      <tr>
                          <td colspan="2"><strong>Amount Due (USD):</strong> $<span id="amount-due">{trucks.reduce((sum, truck) => sum + Number(truck.price), 0)}</span></td>
                      </tr>
                    </tbody>
                  </table>
                  <h3>Bill To:</h3>
                  <p className="invoice-address">{companyAddresses[trucks.company] || "Address Not Available"}</p>
                  <table className="invoice-items">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody id="items-list">
                    {trucks.map(truck => (
                      <tr key={truck.vin_no}>
                        <td>{truck.truck_company} {truck.truck_type} New Trucks {truck.vin_no}</td>
                        <td>1</td>
                        <td>${truck.price}</td>
                      </tr>
                      ))}
                      <tr>
                        <td></td>
                        <td><strong>Total:</strong></td>
                        <td><strong>${trucks.reduce((sum, truck) => sum + Number(truck.price), 0)}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="invoice-footer">
                  </div>
                </div>
                <button className="export-btn" onClick={() => exportToPDF(company)}>Export as PDF</button>
              </div>
            ))}
          </div>
        </div>
      <Footer />
    </div>
  );
};

export default InvoicePage;
