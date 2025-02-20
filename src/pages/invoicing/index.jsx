import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/ApiClient";
import Header from "../../components/header";
import Footer from "../../components/footer";
import '../../static/css/Invoicing.css'

const InvoicePage = ({ user }) => {
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState("");
  const [selectedTruckCompanies, setSelectedTruckCompanies] = useState([]);
  const [uniqueTruckCompanies, setUniqueTruckCompanies] = useState([]);
  const [truckCategory, setTruckCategory] = useState("New");
  const [poNumber, setPoNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const response = await apiClient.get("/trucks/companies");
    setCompanies(response.data.map((c) => c.company));
  };

  const fetchTruckCompanies = async (company) => {
    if(company === "") {
        setCompany("");
        return;
    }

    setCompany(company);
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

  const handleGenerateInvoice = async () => {
    try {
      const payload = {
        po_number: poNumber,
        category: truckCategory,
        company: company,
        truck_companies: selectedTruckCompanies,
      };

      const response = await apiClient.post("/invoices/generate", payload);
      alert("Invoice generated successfully!");
      navigate("/admin/invoice-list");
    } catch (error) {
      setErrorMessage(error.response.data.message);
      console.error("Error generating invoice:", error);
    }
  };

  return (
    <div className="generate-invoice-page">
      <Header user={user} />
      <h2>Generate Invoice</h2>
      {errorMessage && (
        <div className="erorr-message">
          {errorMessage}
        </div>
      )}
      <div className="invoice-body">
        {/* PO Number Input */}
        <label>PO Number:</label>
        <input
          type="text"
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
          placeholder="Enter PO Number (Optional)"
        />

        <label>Select Truck Category:</label>
        <select onChange={(e) => setTruckCategory(e.target.value)}>
            <option value="New">New</option>
            <option value="Used">Used</option>
        </select>

        {/* Select Truck Companies */}
        <label>Select Company:</label>
        <select
          onChange={(e) => fetchTruckCompanies(e.target.value)}
        >
          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>

        <label>Truck Companies:</label>
        <select multiple value={selectedTruckCompanies} onChange={(e) => handleTruckCompanyChange(e)}>
          {uniqueTruckCompanies.map((company) => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>

        <button onClick={handleGenerateInvoice}>Generate Invoice</button>
      </div>
      <Footer />
    </div>
  );
};

export default InvoicePage;
