import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../static/css/UserLandingPage.css";

const UserLandingPage = ({ user, setUser }) => {
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState("new");
  const [orderDetails, setOrderDetails] = useState({
    vin: "",
    date: new Date().toLocaleDateString(),
    color: "",
    truckType: "day cab",
    washType: "quick wash",
    customOrder: "",
    picture: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    setOrderDetails({ ...orderDetails, picture: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order submitted:", orderDetails);
    alert("Order placed successfully!");
  };

  return (
    <div className="landing-page">
      <Header user={user} setUser={setUser}/>
      <main>
        <h2>Place Your Order</h2>
        <form onSubmit={handleSubmit}>
          <label>Category:</label>
          <select
            name="category"
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
          >
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>

          <label>VIN Number:</label>
          <input
            type="text"
            name="vin"
            value={orderDetails.vin}
            onChange={handleInputChange}
            required
          />

          <label>Date:</label>
          <input type="text" value={orderDetails.date} disabled />

          {orderType === "new" && (
            <>
              <label>Color:</label>
              <select
                name="color"
                value={orderDetails.color}
                onChange={handleInputChange}
              >
                <option value="averitt">Averitt (Red)</option>
                <option value="western">Western (White)</option>
                <option value="titans">Titans (White)</option>
                <option value="westernStar">Western Star (White)</option>
                <option value="custom">Custom</option>
              </select>

              <label>Type of Truck:</label>
              <select
                name="truckType"
                value={orderDetails.truckType}
                onChange={handleInputChange}
              >
                <option value="day cab">Day Cab</option>
                <option value="sleeper">Sleeper</option>
              </select>

              <p>Price: $225</p>
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
                required
              />

              <label>Type of Truck:</label>
              <select
                name="truckType"
                value={orderDetails.truckType}
                onChange={handleInputChange}
              >
                <option value="day cab">Day Cab</option>
                <option value="sleeper">Sleeper</option>
              </select>

              <label>Type of Wash:</label>
              <select
                name="washType"
                value={orderDetails.washType}
                onChange={handleInputChange}
              >
                <option value="extreme detail">Extreme Detail - $2200</option>
                <option value="full detail">Full Detail - $1300</option>
                <option value="partial detail">Partial Detail - $1000</option>
                <option value="quick wash">Quick Wash - $300</option>
                <option value="custom order">Custom Order</option>
              </select>

              {orderDetails.washType === "custom order" && (
                <textarea
                  name="customOrder"
                  placeholder="Describe your custom order"
                  value={orderDetails.customOrder}
                  onChange={handleInputChange}
                  required
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