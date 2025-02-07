import React, { useState, useEffect } from "react";
import apiClient from "../../utils/ApiClient";
import Header from "../../components/header";
import Footer from "../../components/footer";
import "../../static/css/OrderHistory.css";
import OrderStatus from "../../components/order-status";

const OrderHistoryPage = ({ user, setUser }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Active"); // Tabs: Active, Hold, Completed

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const response = await apiClient.get("/orders/user");
      setOrders(response.data.orders);
    } catch (err) {
      setError("Failed to fetch order history.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderItemStatus = async (orderItemId, newStatus) => {
    try {
      await apiClient.put(`/orders/update-item-status/${orderItemId}`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          items: order.items.map((item) =>
            item.orderitem_id === orderItemId ? { ...item, item_status: newStatus } : item
          ),
        }))
      );
    } catch (err) {
      console.error("Error updating order item status:", err);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.items.some((item) => item.vin_no.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const groupedOrders = filteredOrders.filter((order) => {
    if (activeTab === "Active") {
      return ["Pending", "In Progress"].includes(order.status);
    } else if (activeTab === "Hold") {
      return ["Hold", "Need Parts", "Truck Not Ready"].includes(order.status);
    } else if (activeTab === "Completed") {
      return order.status === "Completed";
    }
    return false;
  });

  if (loading) return <p>Loading order history...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="order-history-page">
      <Header user={user} setUser={setUser} />
      <div className="order-history-container">
        <h2>Order History</h2>

        {/* Search by VIN */}
        <input
          type="text"
          placeholder="Search by VIN number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Tabs for order grouping */}
        <div className="tabs">
          <button className={activeTab === "Active" ? "active" : ""} onClick={() => setActiveTab("Active")}>
            Active
          </button>
          <button className={activeTab === "Hold" ? "active" : ""} onClick={() => setActiveTab("Hold")}>
            Hold
          </button>
          <button className={activeTab === "Completed" ? "active" : ""} onClick={() => setActiveTab("Completed")}>
            Completed
          </button>
        </div>

        {groupedOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          groupedOrders.map((order) => (
            <div key={order.order_id} className="order-card">
              <h3>Order ID: {order.order_id}</h3>
              <p><strong>Category:</strong> {order.category}</p>
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
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.orderitem_id}>
                      <td>{item.vin_no}</td>
                      <td>{item.truck_company}</td>
                      <td>{item.truck_type}</td>
                      <td>${item.price}</td>
                      <td><OrderStatus status={item.item_status} /></td>
                      <td>
                        <select
                          value={item.item_status}
                          onChange={(e) => updateOrderItemStatus(item.orderitem_id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Hold">Hold</option>
                          <option value="Need Parts">Need Parts</option>
                          <option value="Truck Not Ready">Truck Not Ready</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderHistoryPage;