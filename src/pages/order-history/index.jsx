import React, { useState, useEffect } from "react";
import apiClient from "../../utils/ApiClient";
import Header from "../../components/header";
import Footer from "../../components/footer";
import "../../static/css/OrderHistory.css";
import OrderStatus from "../../components/order-status";
import EditOrderItemModal from "../../components/edit-order";

const OrderHistoryPage = ({ user, setUser }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Active"); // Tabs: Active, Hold, Completed
  const [selectedItems, setSelectedItems] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const response = await apiClient.get("/orders/user");
      setOrders(response.data.orders);
    } catch (err) {
      setError(err.response.data.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (order, orderItem) => {
    setSelectedOrder(order);
    setSelectedOrderItem(orderItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setSelectedOrderItem(null);
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

  const toggleItemSelection = (orderItemId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(orderItemId)
        ? prevSelected.filter((id) => id !== orderItemId)
        : [...prevSelected, orderItemId]
    );
  };

  const toggleSelectAll = (items) => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]); // Deselect all
    } else {
      setSelectedItems(items.map((item) => item.orderitem_id)); // Select all
    }
  };

  const handlePrint = () => {
    const printableItems = orders.flatMap((order) =>
      order.items
        .filter((item) => selectedItems.includes(item.orderitem_id))
        .map((item) => ({
          category: order.category, // Get category from parent order
          color: order.color,
          vin_no: item.vin_no,
          truck_company: item.truck_company || 'N/A',
          truck_type: item.truck_type,
        }))
    );

    const printContent = `
      <html>
        <head>
          <title>Print Orders</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>Selected Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Color</th>
                <th>VIN</th>
                <th>Truck Company</th>
                <th>Truck Type</th>
              </tr>
            </thead>
            <tbody>
              ${printableItems
                .map(
                  (item) => `
                  <tr>
                    <td>${item.category}</td>
                    <td>${item.color}</td>
                    <td>${item.vin_no}</td>
                    <td>${item.truck_company}</td>
                    <td>${item.truck_type}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };


  const filteredOrders = orders.filter((order) =>
    order.items.some((item) => item.vin_no !== null ? item.vin_no.toLowerCase().includes(searchTerm.toLowerCase()) : item.vin_no)
  );

  const groupedOrders = filteredOrders
  .map((order) => ({
    ...order,
    items: order.items.filter((item) => {
      if (activeTab === "Active") {
        return ["Pending", "In Progress", "Urgent"].includes(item.item_status);
      } else if (activeTab === "Hold") {
        return ["Hold", "Truck Not Found", "Truck Not Ready"].includes(item.item_status);
      } else if (activeTab === "Completed") {
        return item.item_status === "Completed";
      }
      return false;
    }),
  }))
  .filter((order) => order.items.length > 0); // Only include orders that still have items after filtering

  if (loading) return <p>Loading order history...</p>;

  return (
    <div className="order-history-page">
      <Header user={user} setUser={setUser} />
      <div className="order-history-container">
        <h2>Orders</h2>

        {/* Search by VIN */}
        <input
          type="text"
          placeholder="Search by VIN number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button className="print-btn" onClick={handlePrint} disabled={selectedItems.length === 0}>
          Print
        </button>

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
          <p className="error-message">{error}</p>
        ) : (
          <table className="order-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={() => toggleSelectAll(groupedOrders.flatMap((order) => order.items))}
                    checked={selectedItems.length > 0 && selectedItems.length === groupedOrders.flatMap((order) => order.items).length}
                  />
                </th>
                <th>Category</th>
                <th>Order ID</th>
                <th>PO Number</th>
                <th>Order Date</th>
                <th>VIN</th>
                <th>Truck Company</th>
                <th>Truck Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Comment</th>
                <th>Admin Comment</th>
                <th>Update Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupedOrders.map((order) =>
                order.items.map((item) => (
                  <tr key={item.orderitem_id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.orderitem_id)}
                        onChange={() => toggleItemSelection(item.orderitem_id)}
                      />
                    </td>
                    <td>{order.category}</td>
                    <td>{order.order_id}</td>
                    <td>{order.po_number}</td>
                    <td>{new Date(order.order_date).toLocaleDateString()}</td>
                    <td>{item.vin_no}</td>
                    <td>{item.truck_company}</td>
                    <td>{item.truck_type}</td>
                    <td>${item.custom_price > 0 ? item.custom_price : item.price}</td>
                    <td><OrderStatus status={item.item_status} /></td>
                    <td>{item.comment || "N/A"}</td>
                    <td>{order.admin_comment || "N/A"}</td>
                    <td>
                      <select
                        value={item.item_status}
                        onChange={(e) => updateOrderItemStatus(item.orderitem_id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Hold">Hold</option>
                        <option value="Truck Not Found">Truck Not Found</option>
                        <option value="Truck Not Ready">Truck Not Ready</option>
                      </select>
                    </td>
                    <td>
                      <button className="edit-btn" onClick={() => openModal(order, item)}>Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* Edit Order Item Modal */}
      <EditOrderItemModal
        isOpen={isModalOpen}
        onClose={closeModal}
        orderItem={selectedOrderItem}
        order={selectedOrder}
        company={user?.company}
        refreshOrders={fetchOrderHistory}
      />
      <Footer />
    </div>
  );
};

export default OrderHistoryPage;
