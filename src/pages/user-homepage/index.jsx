import React, {useState} from "react";
//import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import "../../static/css/UserLandingPage.css";
import western from "../../static/images/western.jpg";
import averittdaycab from "../../static/images/averitt-daycab.jpg";
import averittsleeper from "../../static/images/averitt-sleeper.jpg";
import adams from "../../static/images/adams.jpg";
import apiClient from "../../utils/ApiClient";
import { useUser } from "../../UserContext";

const UserLandingPage = () => {
  const { user, setUser } = useUser();
  const isAdmin = user?.role === "Administrator";
  //const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedTruckType, setSelectedTruckType] = useState("");

  const companyImages = {
    Averitt: averittdaycab,
    Western: averittsleeper,
    Titans: western,
    Adams: adams,
    Custom: adams,
  };

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
  };

  const handleTruckTypeChange = (e) => {
    setSelectedTruckType(e.target.value);
  };

  const [orderType, setOrderType] = useState("new");
  const [orderDetails, setOrderDetails] = useState({
    userId: isAdmin ? "" : user?.users_id,
    vin_no: "",
    category: "New",
    date: new Date().toLocaleDateString(),
    color: "",
    truck_type: "day cab",
    services: "quick wash",
    customOrder: "",
    price: 225,
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

  const handleVINChange = (e) => {
    const value = e.target.value.toUpperCase();
    setVinNumber(value);

    if (!validateVIN(value)) {
      setError("VIN number must be a 6-character alphanumeric value.");
    } else {
      setError(""); // Clear error if validation passes
    }
  };

  const handleVINValidation = async () => {
    try {
      const response = await apiClient.post(`/orders/validate-vin`, { vin_no: vinNumber });
      if (response.data.success) {
        setError("");
        setSuccess("VIN number is valid.");
        return true;
      } else {
        setError(response.data.error);
        setSuccess("");
        return false;
      }
    } catch (error) {
      console.error('Error validating VIN:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || error.message);
      setSuccess("");
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedPrice = orderDetails.price;
    if(name === "services"){
      console.log("orderDetails.category: "+orderDetails.category)
      console.log("value: "+value)
    }
    if (name === "category") {
      if(value === "New"){
        setOrderType("new")
      } else {
        setOrderType("used")
      }
      updatedPrice = value === "New" ? 225 : 0; // Default price for "New" is 225, for "Used" it's dynamic
    } else if (name === "services" && orderDetails.category === "used") {
      updatedPrice = servicePrices[value] || 0;
    }
    setOrderDetails({ ...orderDetails, [name]: value, price: updatedPrice, });
  };

  const handleFileChange = (e) => {
    setOrderDetails({ ...orderDetails, picture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await handleVINValidation();
    if (isValid) {
      // Proceed with placing the order
      try {
        const formData = new FormData();
        formData.append("user_id", isAdmin ? orderDetails.userId : user?.users_id);
        formData.append("vin_no", vinNumber);
        formData.append("category", orderDetails.category);
        formData.append("color", orderDetails.color);
        formData.append("truck_type", orderDetails.truck_type);
        formData.append("services", orderDetails.services);
        if (orderDetails.customOrder) {
          formData.append("custom_order", orderDetails.customOrder);
        }
        formData.append("price", orderDetails.price);
        if (orderDetails.comment) {
          formData.append("comment", orderDetails.comment);
        }
        if (orderDetails.picture) {
          formData.append("picture", orderDetails.picture);
        }

        const response = await apiClient.post(`/orders`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.success) {
          alert("Order placed successfully!");
          setOrderDetails({
            vin_no: "",
            category: "New",
            color: "",
            truck_type: "",
            services: "",
            custom_order: "",
            price: 225,
            comment: "",
            picture: null,
          });
        }
      } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place the order. Please try again.");
      }
      console.log("Order placed with VIN:", vinNumber);
      // Additional order submission logic here
    }
  };

  return (
    <div className="landing-page">
      <Header user={user} setUser={setUser}/>
      <main>
        <h2>Place Your Order</h2>
        <form onSubmit={handleSubmit}>
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
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>

          <label>VIN Number:</label>
          <input
            type="text"
            name="vin"
            value={vinNumber}
            onChange={handleVINChange}
            maxLength={6}
            required
          />
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <label>Date:</label>
          <input type="text" value={orderDetails.date} disabled />

          {orderType === "new" && (
            <>
              <label>Truck Company:</label>
              <select
                name="truck_company"
                value={selectedCompany}
                onChange={handleCompanyChange}
              >
                <option value="">Select Truck Color</option>
                <option value="Adams">Adam's</option>
                <option value="Averitt">Averitt (Red)</option>
                <option value="Western">Western (White)</option>
                <option value="Titans">Titans (White)</option>
                <option value="WesternStar">Western Star (White)</option>
                <option value="Custom">Custom</option>
              </select>

              <label>Type of Truck:</label>
              <select
                name="truckType"
                value={selectedTruckType}
                onChange={handleTruckTypeChange}
              >
                <option value="">Select Truck Type</option>
                <option value="day cab">Day Cab</option>
                <option value="sleeper">Sleeper</option>
              </select>

              <label>Selected Truck Preview:</label>
              <div className="truck-preview">
                {selectedCompany && (
                  <img
                    src={companyImages[selectedCompany]}
                    alt={selectedCompany}
                    className="truck-image"
                  />
                )}
              </div>

              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={orderDetails.price}
                onChange={handleInputChange}
                readOnly
              />
            </>
          )}

          {orderType === "used" && (
            <>
              <label>Color:</label>
              <input
                type="text"
                name="color"
                value={orderDetails.color}
                onChange={handleInputChange}
              />

              <label>Type of Truck:</label>
              <select
                name="truckType"
                value={orderDetails.truck_type}
                onChange={handleInputChange}
              >
                <option value="">Select Truck Type</option>
                <option value="day cab">Day Cab</option>
                <option value="sleeper">Sleeper</option>
              </select>

              <label>Type of Wash:</label>
              <select
                name="services"
                value={orderDetails.services}
                onChange={handleInputChange}
              >
                <option value="">Select a Service</option>
                <option value="Extreme Detail">Extreme Detail - $2200</option>
                <option value="Full Detail">Full Detail - $1300</option>
                <option value="partial detail">Partial Detail - $1000</option>
                <option value="quick wash">Quick Wash - $300</option>
                <option value="custom order">Custom Order</option>
              </select>

              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={orderDetails.price}
                onChange={handleInputChange}
                readOnly
              />

              {orderDetails.washType === "custom order" && (
                <textarea
                  name="customOrder"
                  placeholder="Describe your custom order"
                  value={orderDetails.customOrder}
                  onChange={handleInputChange}
                />
              )}
            </>
          )}

          <label>Picture Attachment (Optional):</label>
          <input type="file" onChange={handleFileChange} />

          <button type="submit">Place Order</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default UserLandingPage;