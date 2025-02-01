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

    const updateOrderStatus = async (order_id, newStatus) => {
        try {
            await apiClient.put(`/orders/update-status/${order_id}`, { status: newStatus });
            setOrders(orders.map(order => order.order_id === order_id ? { ...order, status: newStatus } : order));
        } catch (err) {
            console.error("Error updating order status:", err);
        }
    };

    if (loading) return <p>Loading order history...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="order-history-page">
            <Header user={user} setUser={setUser} />
            <div className="order-history-container">
                <h2>Order History</h2>
                {orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    orders.map(order => (
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

                            {/* Status Update Dropdown */}
                            <label>Update Status:</label>
                            <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Hold">Hold</option>
                                <option value="Need Parts">Need Parts</option>
                                <option value="Truck not ready">Truck not ready</option>
                            </select>
                        </div>
                    ))
                )}
            </div>
            <Footer />
        </div>
    );
};

export default OrderHistoryPage;
