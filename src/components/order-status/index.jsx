

const OrderStatus = ({ status }) => {

    const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return { color: "blue", displayText: "Pending" };
      case "Completed":
        return { color: "green", displayText: "Completed" };
      case "Urgent":
        return { color: "purple", displayText: "Urgent" };
      case "In Progress":
        return { color: "orange", displayText: "In Progress" };
      case "Hold":
        return { color: "red", displayText: "Hold" };
      case "Truck Not Found":
        return { color: "yellow", displayText: "Truck Not Found" };
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