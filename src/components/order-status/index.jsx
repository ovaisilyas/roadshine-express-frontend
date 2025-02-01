

const OrderStatus = ({ status }) => {

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

  const { color, displayText } = getStatusStyle(status);

  return (
    <span style={{ color, fontWeight: "bold" }}>{displayText}</span>
  );

};

export default OrderStatus;