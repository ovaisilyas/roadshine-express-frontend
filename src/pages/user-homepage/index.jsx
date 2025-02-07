import React, {useState} from "react";
//import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import "../../static/css/UserLandingPage.css";
import apiClient from "../../utils/ApiClient";
import { useUser } from "../../UserContext";
import TruckImage from "../../components/truck-image";

const UserLandingPage = () => {
  const { user, setUser } = useUser();
  const isAdmin = user?.role === "Administrator";
  //const navigate = useNavigate();
  const [isDropdownDisabled, setIsDropdownDisabled] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedTruckCompany, setSelectedTruckCompany] = useState("");
  const [selectedTruckType, setSelectedTruckType] = useState("Day Cab");
  const [orderRows, setOrderRows] = useState([
    {
      vin: "",
      date: new Date().toLocaleDateString(),
      truck_type: "Day Cab",
      price: 225,
      custom_price: 0,
    },
  ]);

  const truckCompanies = ["Adam's", "Averitt", "Western", "Western Star", "Titans", "Custom"];
  const companies = ["Velocity", "Peterbilt", "International", "Volvo", "Kenworth", "Custom"];

  const handleAddRow = () => {
    setOrderRows([
      ...orderRows,
      {
        vin: "",
        date: new Date().toLocaleDateString(),
        truck_type: "Day Cab",
        price: 225,
        custom_price: 0,
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = orderRows.filter((_, i) => i !== index);
    setOrderRows(updatedRows);
  };

  const handleRowChange = (index, field, value) => {
    if(field === "vin"){
      handleVINChange(value, index);
    }
    if(field === "truck_company") {
      setSelectedTruckCompany(value);
    }
    if(field === "truck_type") {
      setSelectedTruckType(value);
    }
    const updatedRows = [...orderRows];
    updatedRows[index][field] = value;
    setOrderRows(updatedRows);
  };

  const [orderType, setOrderType] = useState("New");
  const [orderDetails, setOrderDetails] = useState({
    userId: isAdmin ? "" : user?.users_id,
    vin_no: "",
    category: "New",
    date: new Date().toLocaleDateString(),
    color: "",
    truck_type: "Day Cab",
    services: "",
    customOrder: "",
    price: 225,
    custom_price: 0,
    picture: null,
    comment: "",
  });
  const [vinNumber, setVinNumber] = useState(orderDetails?.vin_no || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const servicePrices = {
    "Extreme Detail": 2200,
    "Full Detail": 1300,
    "Partial Detail": 1000,
    "Quick Wash": 300,
    "Custom Order": 0, // Price to be entered manually by the user for Custom Order
  };

  // Function to validate VIN
  const validateVIN = (vin) => /^[A-Za-z0-9]{6}$/.test(vin);

  const handleVINChange = (value, index) => {
    const vinInput = value.toUpperCase();
    if (vinInput.length > 6) return;
    setVinNumber(vinInput);
    if (vinInput.length === 6 && validateVIN(vinInput)) {
      console.log("✅ VIN format is valid (6 characters), checking database...");
      handleVINValidation(vinInput, index);
    } else if (vinInput.length < 6) {
        //console.warn("❌ VIN is not complete yet (less than 6 characters)");
        setSelectedTruckCompany(""); // Reset fields if invalid
        setSelectedCompany("");
        setIsDropdownDisabled(false); // Allow manual selection
    }
  };

  const handleVINValidation = async (vin, index) => {
    try {
      const response = await apiClient.post(`/orders/validate-vin`, { vin_no: vin });
      if (response.data.success) {
        setError("");
        setSuccess("VIN number is valid.");
        console.log(response.data.truck.company);
        const updatedTruckCompany = response.data.truck.truck_company;
        const updatedCompany = response.data.truck.company;
        const updatedTruckType = response.data.truck.truck_type;
        handleRowChange(index, "truck_company", updatedTruckCompany);
        handleRowChange(index, "truck_type", updatedTruckType);
        handleRowChange(index, "company", updatedCompany);
        setSelectedTruckCompany(updatedTruckCompany);
        setSelectedCompany(updatedCompany);
        setSelectedTruckType(updatedTruckType);
        setIsDropdownDisabled(true);
        return true;
      } else {
        setError(response.data.error);
        setSuccess("");
        setSelectedTruckCompany("");
        setSelectedCompany("");
        setSelectedTruckType("");
        setIsDropdownDisabled(false);
        return false;
      }
    } catch (error) {
      console.error('Error validating VIN:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || error.message);
      setSuccess("");
      setSelectedTruckCompany("");
      setSelectedCompany("");
      setSelectedTruckType("");
      setIsDropdownDisabled(false);
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedPrice = orderDetails.price;
    if(name === "truck_type"){
      setSelectedTruckType(value);
    }
    if (name === "category") {
      if(value === "New"){
        setOrderType("New")
        setError("")
        setSuccess("")
      } else {
        setOrderType("Used")
        setError("")
        setSuccess("")
      }
      updatedPrice = value === "New" ? 225 : 0; // Default price for "New" is 225, for "Used" it's dynamic
    } else if (name === "services" && orderDetails.category === "Used") {
      updatedPrice = servicePrices[value] || 0;
    }
    setOrderDetails({ ...orderDetails, [name]: value, price: updatedPrice, });
  };

  const handleFileChange = (e) => {
    setOrderDetails({ ...orderDetails, picture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("user_id", isAdmin ? orderDetails.userId : user?.users_id);
      formData.append("category", orderDetails.category);
      formData.append("color", orderDetails.color);
      if(orderDetails.category === "Used") {
        formData.append("services", orderDetails.services);
      } else {
        formData.append("services", "");
      }
      if (orderDetails.customOrder) {
        formData.append("custom_order", orderDetails.customOrder);
      }
      if (orderDetails.comment) {
        formData.append("comment", orderDetails.comment);
      }
      if (orderDetails.picture) {
        formData.append("picture", orderDetails.picture);
      }

      // Append each row of order details
      orderRows.forEach((row, index) => {
        formData.append(`orders[${index}][vin]`, orderDetails.category === "Used" ? vinNumber : row.vin);
        formData.append(`orders[${index}][date]`, orderDetails.category === "Used" ? orderDetails.date : row.date);
        formData.append(`orders[${index}][truck_company]`, orderDetails.category === "Used" ? "Custom" : row.truck_company);
        formData.append(`orders[${index}][truck_type]`, orderDetails.category === "Used" ? orderDetails.truck_type : row.truck_type);
        formData.append(`orders[${index}][price]`, orderDetails.category === "Used" ? orderDetails.price : row.price);
        formData.append(`orders[${index}][custom_price]`, orderDetails.category === "Used" ? orderDetails.custom_price : row.custom_price);
        formData.append(`orders[${index}][company]`, orderDetails.category === "Used" ? selectedCompany : row.company);
      });

      const response = await apiClient.post(`/orders`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        alert("Order placed successfully!");
        setOrderRows([
          {
            vin: "",
            date: new Date().toLocaleDateString(),
            truck_company: "",
            truck_type: "Day Cab",
            price: 225,
            custom_price: 0,
            company: "",
          },
        ]);
        setOrderDetails({
          vin_no: "",
          category: "New",
          color: "",
          truck_company: "",
          truck_type: "",
          services: "",
          custom_order: "",
          price: 0,
          custom_price: 0,
          comment: "",
          company: "",
          picture: null,
        });
        setVinNumber("");
        setError("");
        setSuccess("");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place the order. Please try again.");
    }
  };

  return (
    <div className="landing-page">
      <Header user={user} setUser={setUser}/>
      <main>
        <h2>Place Your Order</h2>
          {isAdmin && <><label>User:</label><select
            name="userId"
            value={orderDetails.userId}
            onChange={handleInputChange}
          >
            <option value="">Select User from the list</option>
            <option value="4">ovais1@mailinator.com</option>
          </select></>
          }
          <label>Category:</label>
          <select
            name="category"
            value={orderDetails.category}
            onChange={handleInputChange}
          >
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>

          {orderType === "New" && (
            <>
              {orderRows.map((row, index) => (
                <div key={index} className="order-row">
                  <input
                    type="text"
                    placeholder="VIN"
                    value={row.vin}
                    maxLength={6}
                    onChange={(e) => handleRowChange(index, "vin", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Date"
                    value={row.date}
                    onChange={(e) => handleRowChange(index, "date", e.target.value)}
                    disabled
                  />
                  <select
                    value={row.truck_company}
                    onChange={(e) => handleRowChange(index, "truck_company", e.target.value)}
                    disabled={isDropdownDisabled}
                  >
                    <option value="">Select Truck Company</option>
                    {truckCompanies.map((truckcompany) => (
                      <option key={truckcompany} value={truckcompany}>{truckcompany}</option>
                    ))}
                  </select>
                  <select
                    value={row.truck_type}
                    onChange={(e) => handleRowChange(index, "truck_type", e.target.value)}
                  >
                    <option value="Day Cab">Day Cab</option>
                    <option value="Sleeper">Sleeper</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Price"
                    value={row.price}
                    onChange={(e) => handleRowChange(index, "price", e.target.value)}
                    disabled
                  />
                  <input
                    type="number"
                    placeholder="Custom Price"
                    value={row.custom_price}
                    onChange={(e) => handleRowChange(index, "custom_price", e.target.value)}
                  />
                  <select
                    value={row.company}
                    onChange={(e) => handleRowChange(index, "company", e.target.value)}
                    disabled={isDropdownDisabled}
                  >
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                  {orderRows.length > 1 && (
                    <button type="button" onClick={() => handleRemoveRow(index)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
              <button type="button" onClick={handleAddRow}>
                Add Row
              </button>
              <div className="truck-preview">
                {selectedTruckCompany && (
                  <TruckImage truckCompany={selectedTruckCompany} truckType={selectedTruckType} />
                )}
              </div>
            </>
          )}

          {orderType === "Used" && (
            <>
              <div className="used-order-wrapper">
                <div>
                  <label>VIN:</label>
                  <input
                    type="text"
                    placeholder="VIN"
                    value={vinNumber}
                    name="vin_no"
                    maxLength={6}
                    onChange={(e) => handleVINChange(e.target.value, 0)}
                  />
                  {error && <p className="error-message">{error}</p>}
                  {success && <p className="success-message">{success}</p>}
                </div>
                <div>
                  <label>Color:</label>
                  <input
                    type="text"
                    name="color"
                    value={orderDetails.color}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label>Type of Truck:</label>
                  <select
                    name="truck_type"
                    value={orderDetails.truck_type}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Truck Type</option>
                    <option value="Day Cab">Day Cab</option>
                    <option value="Sleeper">Sleeper</option>
                  </select>
                </div>

                <div>
                  <label>Type of Wash:</label>
                  <select
                    name="services"
                    value={orderDetails.services}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a Service</option>
                    <option value="Extreme Detail">Extreme Detail - $2200</option>
                    <option value="Full Detail">Full Detail - $1300</option>
                    <option value="Partial Detail">Partial Detail - $1000</option>
                    <option value="Quick Wash">Quick Wash - $300</option>
                    <option value="Custom Order">Custom Order</option>
                  </select>
                  {orderDetails.washType === "custom order" && (
                    <textarea
                      name="customOrder"
                      placeholder="Describe your custom order"
                      value={orderDetails.customOrder}
                      onChange={handleInputChange}
                    />
                  )}
                </div>

                <div>
                  <label>Price:</label>
                  <input
                    type="number"
                    name="price"
                    value={orderDetails.price}
                    onChange={handleInputChange}
                    disabled
                  />

                  <label>Custom Price:</label>
                  <input
                    type="number"
                    name="custom_price"
                    placeholder="Custom Price"
                    value={orderDetails.custom_price}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                <label>Company:</label>
                  <select value={selectedCompany} disabled={isDropdownDisabled} onChange={(e) => {
                      const newValue = e.target.value;
                      setSelectedCompany(newValue);
                    }}>
                      <option value="">Select Company</option>
                    {companies.map((company) => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>
                <div className="truck-preview">
                  {selectedTruckCompany && (
                    <TruckImage truckCompany={selectedTruckCompany} truckType={selectedTruckType} />
                  )}
                </div>
              </div>
            </>
          )}

          <div className="order-picture">
            <label>Picture Attachment (Optional):</label>
            <input type="file" onChange={handleFileChange} />
          </div>

          <button type="button" onClick={handleSubmit}>Place Order</button>
      </main>
      <Footer />
    </div>
  );
};

export default UserLandingPage;