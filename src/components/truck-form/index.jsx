import React, { useState, useEffect } from "react";
import apiClient from "../../utils/ApiClient";

const TruckForm = ({ truck = {}, onSubmit, onCancel }) => {
  const [companies, setCompanies] = useState([]);
  const [truckCompanies, setTruckCompanies] = useState([]);
  const [uniqueTruckCompanies, setUniqueTruckCompanies] = useState([]);
  const [availableTruckTypes, setAvailableTruckTypes] = useState([]);
  const [selectedTruckType, setSelectedTruckType] = useState("Day Cab");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [formData, setFormData] = useState({
    truck_id: truck?.truck_id || "",
    vin_no: truck?.vin_no || "",
    color: truck?.color || "",
    truck_company: truck?.truck_company || "Adams",
    customTruckCompany: truck?.custom_truck_company || "",
    truck_type: truck?.truck_type || "Day Cab",
    price: truck?.price || "",
    company: truck?.company || selectedCompany,
    custom_company: truck?.custom_company || "",
  });
  const [vinNumber, setVinNumber] = useState(formData?.vin_no || "");
  const [error, setError] = useState("");

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
        setUniqueTruckCompanies([]);
        return;
    }

    setSelectedCompany(company);
    try {
        const response = await apiClient.get(`/trucks/truckcompanies?company=${company}`);
        const companies = response.data;
        const distinctCompanies = [...new Set(companies.map((c) => c.truck_company))];
        setTruckCompanies(companies);
        setUniqueTruckCompanies(distinctCompanies);
    } catch (error) {
        console.error("Error fetching truck companies:", error);
    }

};

  // Function to validate VIN
  const validateVIN = (vin) => /^[A-Za-z0-9]{6}$/.test(vin);

  const handleVINChange = (e) => {
    const value = e.target.value;
    setVinNumber(value);

    if (!validateVIN(value)) {
      setError("VIN number must be a 6-character alphanumeric value.");
    } else {
      setError(""); // Clear error if validation passes
    }
  };

  const handleChange = (e) => {
    if(e.target.name === 'truck_company'){
      const types = truckCompanies
        .filter((truck) => truck.truck_company === e.target.value)
        .map((truck) => truck.truck_type);
      console.log(types);
      setAvailableTruckTypes([...new Set(types)]); // Ensure unique truck types
      setSelectedTruckType(types[0]); // Default to the first truck type
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const truckData = {
      ...formData,
      truck_company:
        formData.truck_company === "Custom"
          ? `Custom (${formData.customTruckCompany})`
          : formData.truck_company,
    };
    if (!validateVIN(vinNumber)) {
      setError("VIN number must be a 6-character alphanumeric value.");
      return;
    }
    setError(""); // Clear error
    onSubmit({...truckData, vin_no: vinNumber});
  };

  // Initialize customTruckCompany if truck_company has 'Custom' in it
  useEffect(() => {
    if(truck?.company !== ""){
      setSelectedCompany(truck?.company);
      fetchTruckCompanies(truck?.company);
    }
    if (truck?.truck_company?.startsWith("Custom")) {
      const customValue = truck.truck_company.match(/\(([^)]+)\)/)?.[1] || "";
      setFormData((prev) => ({
        ...prev,
        truck_company: "Custom",
        customTruckCompany: customValue,
      }));
    }
  }, [truck?.truck_company, truck?.company]);

  return (
    <form className="truck-form" onSubmit={handleSubmit}>
        <h2>{formData?.truck_id ? "Edit Truck" : "Add Truck"}</h2>
      <label>VIN Number</label>
      <input
        type="text"
        name="vin_no"
        value={vinNumber}
        onChange={handleVINChange}
        maxLength={6}
        required
      />
      {error && <p className="error-message">{error}</p>}
      <label>Color</label>
      <input
        type="text"
        name="color"
        value={formData.color}
        onChange={handleChange}
        required
      />
      <label>Truck Company</label>
      <select
        name="truck_company"
        value={formData.truck_company}
        onChange={handleChange}
      >
          <option value="">Select Truck Company</option>
        {uniqueTruckCompanies.map((truckcompany) => (
          <option key={truckcompany} value={truckcompany}>{truckcompany}</option>
        ))}
      </select>
      {formData.truck_company === "Custom" && (
        <input
          type="text"
          name="customTruckCompany"
          value={formData.customTruckCompany}
          placeholder="Enter custom truck company"
          onChange={handleChange}
        />
      )}
      <label>Truck Type</label>
      <select
        name="truck_type"
        value={selectedTruckType}
        onChange={handleChange}
      >
        {availableTruckTypes.map((type, index) => (
          <option key={index} value={type}>{type}</option>
        ))}
      </select>
      <label>Price</label>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <label>Company</label>
      <select
        name="company"
        value={selectedCompany}
        onChange={(e) => fetchTruckCompanies(e.target.value)}
      >
        <option value="">Select Company</option>
        {companies.map((company, index) => (
            <option key={index} value={company}>{company}</option>
        ))}
      </select>
      {formData.company === "Custom" && (
        <input
          type="text"
          name="custom_company"
          value={formData.custom_company}
          placeholder="Enter custom company"
          onChange={handleChange}
        />
      )}
      <button type="submit">{formData?.truck_id ? "Save Changes" : "Add Truck"}</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default TruckForm;