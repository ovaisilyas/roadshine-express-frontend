import React, { useState, useEffect } from "react";

const TruckForm = ({ truck = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    truck_id: truck?.truck_id || "",
    vin_no: truck?.vin_no || "",
    color: truck?.color || "",
    truck_company: truck?.truck_company || "adams",
    customTruckCompany: truck?.custom_truck_company || "",
    truck_type: truck?.truck_type || "day cab",
    price: truck?.price || "",
    company: truck?.company || "Velocity",
    custom_company: truck?.custom_company || "",
  });
  const [vinNumber, setVinNumber] = useState(formData?.vin_no || "");
  const [error, setError] = useState("");

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
    if (truck?.truck_company?.startsWith("Custom")) {
      const customValue = truck.truck_company.match(/\(([^)]+)\)/)?.[1] || "";
      setFormData((prev) => ({
        ...prev,
        truck_company: "Custom",
        customTruckCompany: customValue,
      }));
    }
  }, [truck?.truck_company]);

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
        <option value="adams">Adam's</option>
        <option value="Averitt">Averitt</option>
        <option value="Western">Western</option>
        <option value="Titans">Titans</option>
        <option value="Western Star">Western Star</option>
        <option value="Custom">Custom</option>
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
        value={formData.truck_type}
        onChange={handleChange}
      >
        <option value="Day Cab">Day Cab</option>
        <option value="Sleeper">Sleeper</option>
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
        value={formData.company}
        onChange={handleChange}
      >
        <option value="Velocity">Velocity</option>
        <option value="Kenworth">Kenworth</option>
        <option value="Volvo">Volvo</option>
        <option value="International">International</option>
        <option value="Peterbilt">Peterbilt</option>
        <option value="Custom">Custom</option>
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