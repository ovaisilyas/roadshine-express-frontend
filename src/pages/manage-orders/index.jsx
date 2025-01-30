import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import "../../static/css/ManageOrders.css";
import apiClient from "../../utils/ApiClient";

const ManageOrders = ({ user, setUser }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const closeModal = () => setSelectedImage(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = orders.filter((order) =>
    `${order.vin_no}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Function to get the status color and display text
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return { color: "blue", displayText: "Pending" };
      case "Completed":
        return { color: "green", displayText: "Completed" };
      case "In Progress":
        return { color: "orange", displayText: "In Progress" };
      case "Hold":
        return { color: "red", displayText: "Hold" };
      case "Need Parts":
        return { color: "yellow", displayText: "Not Found" }; // Custom display text
      case "Truck not ready":
        return { color: "red", displayText: "Truck not ready" };
      default:
        return { color: "gray", displayText: "Unknown Status" };
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get("/orders");
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleUpdateOrder = async (orderId) => {
    try {
      await apiClient.put(`/orders/${orderId}`, { status, admin_comment: comment });
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="manage-orders">
        <Header user={user} setUser={setUser}/>
        <div className="orders-header">
            <h2>Manage Orders</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by VIN number..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <button onClick={() => navigate("/user")}>
                Place Order on Behalf of User
            </button>
        </div>
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>VIN Number</th>
            <th>Category</th>
            <th>Truck Type</th>
            <th>Price</th>
            <th>Picture</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => {
            const { color, displayText } = getStatusStyle(order.status);
            return (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.vin_no}</td>
              <td>{order.category}</td>
              <td>{order.truck_type}</td>
              <td>{order.price}</td>
              <td>
                {order.picture_url && <img src={order.picture_url} onClick={() => setSelectedImage(order.picture_url)} alt="Order Attachment" style={{ width: "100px", height: "75px" }} />}
              </td>
              <td><span style={{ color, fontWeight: "bold" }}>{displayText}</span></td>
              <td>
                <button onClick={() => setSelectedOrder(order)}>View / Edit</button>
              </td>
            </tr>
            );
        })}
        </tbody>
      </table>
      {selectedOrder && (
        <div className="order-popup">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> {selectedOrder.order_id}</p>
          <p><strong>VIN Number:</strong> {selectedOrder.vin_no}</p>
          <p><strong>Category:</strong> {selectedOrder.category}</p>
          <p><strong>Truck Type:</strong> {selectedOrder.truck_type}</p>
          <p><strong>Status:</strong> {selectedOrder.status}</p>
          {selectedOrder.picture_url && (
            <div className="order-image">
              <h4>Uploaded Picture:</h4>
              <img
                src={selectedOrder.picture_url}
                onClick={() => setSelectedImage(selectedOrder.picture_url)}
                alt="Order Attachment"
                style={{ maxWidth: "20%", borderRadius: "8px", marginBottom: "15px" }}
              />
            </div>
          )}
          <textarea
            placeholder="Admin comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Hold">Hold</option>
            <option value="Need Parts">Need Parts</option>
            <option value="Truck not ready">Truck not ready</option>
          </select>
          <button onClick={() => handleUpdateOrder(selectedOrder.order_id)}>Update</button>
          <button onClick={() => setSelectedOrder(null)}>Close</button>
        </div>
      )}
       {/* Modal for the zoomed image */}
       {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <img src={selectedImage} alt="Zoomed Truck Attachment" />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ManageOrders;