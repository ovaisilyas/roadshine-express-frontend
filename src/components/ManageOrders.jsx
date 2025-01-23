import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";
import Header from "./Header";
import "../static/css/ManageOrders.css";

const ManageOrders = ({ user, setUser }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");

  const baseURL = "http://localhost:5000";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/orders`);
      console.log(response.data.orders)
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleUpdateOrder = async (orderId) => {
    try {
      await axios.put(`${baseURL}/api/orders/${orderId}`, { status, admin_comment: comment });
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
            <button onClick={() => window.location.href = "/admin/place-order"}>
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
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.vin_no}</td>
              <td>{order.category}</td>
              <td>{order.truck_type}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => setSelectedOrder(order)}>View / Edit</button>
              </td>
            </tr>
          ))}
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
          </select>
          <button onClick={() => handleUpdateOrder(selectedOrder.order_id)}>Update</button>
          <button onClick={() => setSelectedOrder(null)}>Close</button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ManageOrders;