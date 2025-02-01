import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import "../../static/css/ManageOrders.css";
import apiClient from "../../utils/ApiClient";
import OrderStatus from "../../components/order-status";

const ManageOrders = ({ user, setUser }) => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = orders.filter((order) =>
    `${order.vin_no}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
        <div className="order-list">
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                filteredOrders.map(order => (
                    <div key={order.order_id} className="order-card">
                        <h3>Order ID: {order.order_id}</h3>
                        <p><strong>Category:</strong> {order.category}</p>
                        {order.category === "Used" && (
                            <>
                                <p><strong>Color:</strong> {order.color}</p>
                                <p><strong>Services:</strong> {order.services}</p>
                            </>
                        )}
                        <p><strong>Status:</strong> <OrderStatus status={order.status} /></p>
                        <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
                        <p><strong>Total Price:</strong> ${parseFloat(order.totalprice).toFixed(2)}</p>
                        {order.picture_url && <img src={order.picture_url} alt="Order" className="order-image" />}
                        <p><strong>Comment:</strong> {order.comment || "N/A"}</p>
                        <p><strong>Admin Comment:</strong> {order.admin_comment || "N/A"}</p>

                        <h4>Order Items:</h4>
                        <table className="order-items-table">
                            <thead>
                                <tr>
                                    <th>VIN</th>
                                    <th>Truck Company</th>
                                    <th>Truck Type</th>
                                    <th>Price</th>
                                    <th>Custom Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.vin_no}</td>
                                        <td>{item.truck_company}</td>
                                        <td>{item.truck_type}</td>
                                        <td>${item.price}</td>
                                        <td>${item.custom_price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="order-update-area">
                          <label>Admin Comment:</label>
                          <textarea
                              placeholder="Add an admin comment..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                          />
                          <label>Update Status:</label>
                          <select value={order.status} onChange={(e) => setStatus(e.target.value)}>
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Hold">Hold</option>
                              <option value="Need Parts">Need Parts</option>
                              <option value="Truck not ready">Truck not ready</option>
                          </select>

                          <div className="modal-actions">
                              <button className="update-btn" onClick={() => handleUpdateOrder(order.order_id)}>Update</button>
                          </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      <Footer />
    </div>
  );
};

export default ManageOrders;