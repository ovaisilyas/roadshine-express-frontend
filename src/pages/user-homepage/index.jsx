import React, {useState, useEffect} from "react";
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
  const isEmployee = user?.role === "Employee";
  //const navigate = useNavigate();
  const [isDropdownDisabled, setIsDropdownDisabled] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(user?.company);
  const [truckCompanies, setTruckCompanies] = useState([]);
  const [selectedTruckCompany, setSelectedTruckCompany] = useState("");
  const [uniqueTruckCompanies, setUniqueTruckCompanies] = useState([]);
  const [selectedTruckType, setSelectedTruckType] = useState("Day Cab");
  const [availableTruckTypes, setAvailableTruckTypes] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [orderRows, setOrderRows] = useState([
    {
      vin: "",
      date: new Date().toLocaleDateString(),
      truck_type: "Day Cab",
      price: 225,
      custom_price: 0,
      error: "",
      showRewash: false,
      rewash: false,
    },
  ]);

  useEffect(() => {
    const selCompany = user?.company;
    setSelectedCompany(selCompany);
    fetchTruckCompanies(selCompany);
    setIsButtonDisabled(true);
  }, [user?.company]);

  useEffect(() => {
    if(isAdmin || isEmployee){
      fetchAllActiveUsers();
    }
  }, [isAdmin, isEmployee]);

  const fetchTruckCompanies = async (company) => {
      if(company === "") {
          setSelectedCompany("");
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

  const fetchAllActiveUsers = async () => {
    try {
      const response = await apiClient.get(`/users/active-users`);
      const users = response.data;
      setActiveUsers(users);
    } catch (error) {
        console.error("Error fetching active users:", error);
    }
  };

  const handleVINValidation = async (vin, index) => {
    try {
      const response = await apiClient.post(`/orders/validate-vin`, { vin_no: vin });
      if (response.data.success) {
          setError("");
          setSuccess("VIN number is valid.");
          updateRow(index, { error: "", rewash: false, showRewash: false });
          setIsButtonDisabled(false);
          return true;
      }
    } catch (error) {
      if (error.response?.status === 404) {
          console.log(`VIN already exists for row ${index}`);
          setError(error.response.data.message);
          updateRow(index, { error: error.response.data.message, showRewash: true, rewash: false });
          setSuccess("");
          setIsButtonDisabled(true);
      } else if (error.response?.status === 400) {
          console.log(`VIN already exists for row and re-washed ${index}`);
          setError(error.response.data.message);
          updateRow(index, { error: error.response.data.message, showRewash: false, rewash: false });
          setSuccess("");
          setIsButtonDisabled(true);
      } else {
          // Handle other unexpected errors
          console.error('Error validating VIN:', error.response?.data?.message || error.message);
          setError(error.response?.data?.message || error.message);
          setSuccess("");
          setIsButtonDisabled(true);
      }
      return false;
    }
  };

  const updateRow = (index, updatedFields) => {
      setOrderRows((prevRows) =>
          prevRows.map((row, i) => {
              return i === index ? { ...row, ...updatedFields } : row;
          })
      );
  };

  const handleAddRow = () => {
    if(error){
      return;
    }
    setIsButtonDisabled(false);
    setOrderRows([
      ...orderRows,
      {
        vin: "",
        date: new Date().toLocaleDateString(),
        truck_type: "Day Cab",
        price: 225,
        custom_price: 0,
        comment: "",
        error: "",
        showRewash: false,
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = orderRows.filter((_, i) => i !== index);
    setOrderRows(updatedRows);
    if(!error){
      setIsButtonDisabled(false);
    } else {
      setError("");
      setIsButtonDisabled(false);
    }
  };

  const handleRowChange = (index, field, value) => {
    if(error){
      setError("");
      setIsButtonDisabled(false);
    }
    if(field === "vin"){
      handleVINChange(value, index);
    }
    if(field === "truck_company") {
      setSelectedTruckCompany(value);
      const types = truckCompanies
        .filter((truck) => truck.truck_company === value)
        .map((truck) => truck.truck_type);
      setAvailableTruckTypes([...new Set(types)]); // Ensure unique truck types
      setSelectedTruckType(types[0]); // Default to the first truck type
    }
    if(field === "truck_type") {
      setSelectedTruckType(value);
    }
    if(field === "comment" && value === undefined){
      value = "";
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
    showRewash: false,
    poNumber: "",
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
    updateRow(index, { vin: vinInput });
    setVinNumber(vinInput);
    if (vinInput.length === 6 && validateVIN(vinInput)) {
      const isDuplicate = orderRows.some((row, i) => i !== index && row.vin === vinInput);
      console.log(`isDuplicate for row ${index}:`, isDuplicate);
      if (isDuplicate) {
          updateRow(index, { error: "Duplicate VIN in this order!", showRewash: false });
          setIsButtonDisabled(true);
      } else {
          handleVINValidation(vinInput, index);
      }
    } else if (vinInput.length < 6) {
        updateRow(index, { error: "VIN must be 6 alphanumeric characters.", showRewash: false });
        setIsDropdownDisabled(false); // Allow manual selection
        setIsButtonDisabled(true);
    }
  };

  const handleRewashChange = (index, checked) => {
      updateRow(index, { rewash: checked, showRewash: true, error: "" });
      setError("");
      setIsButtonDisabled(!checked);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedPrice = orderDetails.price;
    if(name === "userId"){
      const selectedUser = activeUsers.find(user => user.users_id === Number(value));
      const selCompany = selectedUser ? selectedUser.company : "";

      setSelectedCompany(selCompany);
      fetchTruckCompanies(selCompany);
    }
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
    if(e.target.files[0] === undefined && vinNumber === ""){
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (orderDetails.category === "New") {
        const missingFields = orderRows.some(row => !row.truck_company || !row.truck_type);
        if (missingFields) {
            alert("Truck company and truck type are required for all rows.");
            return;
        }
    }
    try {
      const formData = new FormData();
      formData.append("user_id", isAdmin ? orderDetails.userId : user?.users_id);
      formData.append("category", orderDetails.category);
      formData.append("color", orderDetails.color);
      if(orderDetails.category === "Used") {
        formData.append("services", orderDetails.services);
        formData.append("po_number", orderDetails.poNumber);
      } else {
        formData.append("services", "");
        formData.append("po_number", "");
      }
      if (orderDetails.customOrder) {
        formData.append("custom_order", orderDetails.customOrder);
      }
      if (orderDetails.picture) {
        formData.append("picture", orderDetails.picture);
      }

      // Append each row of order details
      orderRows.forEach((row, index) => {
        formData.append(`orders[${index}][vin]`, orderDetails.category === "Used" ? vinNumber : row.vin);
        formData.append(`orders[${index}][rewash]`, orderDetails.category === "Used" ? orderDetails.rewash : row.rewash ? "true" : "false");
        formData.append(`orders[${index}][date]`, orderDetails.category === "Used" ? orderDetails.date : row.date);
        formData.append(`orders[${index}][truck_company]`, orderDetails.category === "Used" ? "Custom" : row.truck_company);
        formData.append(`orders[${index}][truck_type]`, orderDetails.category === "Used" ? orderDetails.truck_type : row.truck_type);
        formData.append(`orders[${index}][price]`, orderDetails.category === "Used" ? orderDetails.price : row.price);
        formData.append(`orders[${index}][custom_price]`, orderDetails.category === "Used" ? orderDetails.custom_price : row.custom_price);
        formData.append(`orders[${index}][comment]`, orderDetails.category === "Used" ? orderDetails.comment : row.comment?.trim() ? row.comment : "");
        formData.append(`orders[${index}][company]`, selectedCompany);
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
            showRewash: false,
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
          showRewash: false,
          poNumber: "",
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
            {activeUsers.map((user) => (
              <option key={user.users_id} value={user.users_id}>{user.email}</option>
            ))};
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
                <React.Fragment key={index}>
                  <div className="order-row">
                    <input
                      type="text"
                      placeholder="VIN"
                      value={row.vin}
                      maxLength={6}
                      className="input-row"
                      onChange={(e) => handleRowChange(index, "vin", e.target.value)}
                    />
                    {row.showRewash && (
                        <div className="rewash-container">
                            <input
                                type="checkbox"
                                id={`rewash-${index}`}
                                checked={row.rewash}
                                onChange={(e) => handleRewashChange(index, e.target.checked)}
                            />
                            <label htmlFor={`rewash-${index}`}>Rewash (Bypass VIN validation)</label>
                        </div>
                    )}
                    <input
                      className="input-row"
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
                      {uniqueTruckCompanies.map((truckcompany) => (
                        <option key={truckcompany} value={truckcompany}>{truckcompany}</option>
                      ))}
                    </select>
                    <select
                      value={row.truck_type}
                      onChange={(e) => handleRowChange(index, "truck_type", e.target.value)}
                    >
                      {availableTruckTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className="input-row"
                      placeholder="Price"
                      value={row.price}
                      onChange={(e) => handleRowChange(index, "price", e.target.value)}
                      disabled
                    />
                    <input
                      type="number"
                      className="input-row"
                      placeholder="Custom Price"
                      value={row.custom_price}
                      onChange={(e) => handleRowChange(index, "custom_price", e.target.value)}
                    />
                    <textarea
                        placeholder="Add a comment..."
                        className="comment-row"
                        onChange={(e) => handleRowChange(index, "comment", e.target.value)}
                    />
                    <select
                      value={row.company}
                      onChange={(e) => handleRowChange(index, "company", e.target.value)}
                      disabled={true}
                    >
                      <option value={selectedCompany}>{selectedCompany}</option>
                    </select>
                    {orderRows.length > 1 && (
                      <button type="button" onClick={() => handleRemoveRow(index)}>
                        Remove
                      </button>
                    )}
                  </div>
                  <div>
                    {row.error && <p className="error-message">{row.error}</p>}
                  </div>
                </React.Fragment>
              ))}
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
                  {orderDetails.showRewash && (
                      <div className="rewash-container">
                          <input
                              type="checkbox"
                              id="used-rewash"
                              checked={orderDetails.rewash}
                              onChange={(e) => setOrderDetails({ ...orderDetails, rewash: e.target.checked })}
                          />
                          <label htmlFor="used-rewash">Rewash (Bypass VIN validation)</label>
                      </div>
                  )}
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
                  <label>PO Number:</label>
                  <input
                    type="text"
                    name="poNumber"
                    value={orderDetails.poNumber}
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
                  {orderDetails.washType === "Custom Order" && (
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
                  <label>Comment:</label>
                  <textarea
                      name="comment"
                      placeholder="Add a comment..."
                      value={orderDetails.comment}
                      onChange={handleInputChange}
                  />
                </div>
                <div>
                <label>Company:</label>
                  <select value={selectedCompany} disabled={isDropdownDisabled} onChange={(e) => {
                      const newValue = e.target.value;
                      setSelectedCompany(newValue);
                    }}>
                      <option value={selectedCompany}>{selectedCompany}</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="order-picture">
            <label>Picture Attachment (Optional):</label>
            <input type="file" onChange={handleFileChange} />
          </div>

          <button type="button" onClick={handleSubmit} disabled={isButtonDisabled}>Place Order</button>
      </main>
      <Footer />
    </div>
  );
};

export default UserLandingPage;