import React, { useState, useEffect } from "react";
import apiClient from "../../utils/ApiClient";
import "../../static/css/Modal.css"; // Ensure styles are properly applied

const EditOrderItemModal = ({ isOpen, onClose, orderItem, order, company, refreshOrders }) => {
    const [uniqueTruckCompanies, setUniqueTruckCompanies] = useState([]);
    const [truckCompanies, setTruckCompanies] = useState([]);
    const [availableTruckTypes, setAvailableTruckTypes] = useState([]);
    const [formData, setFormData] = useState({
        vin_no: "",
        truck_company: "",
        truck_type: "",
        custom_price: "",
        comment: "",
        color: "",
        services: "",
        price: "0",
    });

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const servicePrices = {
        "Extreme Detail": 2200,
        "Full Detail": 1300,
        "Partial Detail": 1000,
        "Quick Wash": 300,
        "Custom Order": 0, // Price to be entered manually by the user for Custom Order
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
          if (event.target.classList.contains("modal-overlay")) {
            onClose();
          }
        };

        if (isOpen) {
            setError("");
            setIsButtonDisabled(false);
            document.addEventListener("click", handleOutsideClick);
        } else {
          document.removeEventListener("click", handleOutsideClick);
        }

        return () => document.removeEventListener("click", handleOutsideClick);
      }, [isOpen, onClose]);

    useEffect(() => {
        const fetchTruckCompanies = async () => {
            if(company === "") {
                return;
            }
            try {
                const response = await apiClient.get(`/trucks/truckcompanies?company=${company}`);
                const companies = response.data;
                setTruckCompanies(companies);
                const distinctCompanies = [...new Set(companies.map((c) => c.truck_company))];
                setUniqueTruckCompanies(distinctCompanies);
            } catch (error) {
                console.error("Error fetching truck companies:", error);
            }
        }

        if(company){
            fetchTruckCompanies();
        }
      }, [company]);

    const handleTruckCompanyChange = (value) => {
        const types = truckCompanies
            .filter((truck) => truck.truck_company === value)
            .map((truck) => truck.truck_type);
        setAvailableTruckTypes([...new Set(types)]); // Ensure unique truck types
        setFormData((prev) => ({ ...prev, "truck_company": value }));
    }

    useEffect(() => {
        if (orderItem) {
        setFormData({
            vin_no: orderItem.vin_no,
            truck_company: orderItem.truck_company,
            truck_type: orderItem.truck_type,
            custom_price: orderItem.custom_price,
            comment: orderItem.comment,
            color: order?.category === "Used" ? order.color : "", // Only for "Used" category
            services: order?.category === "Used" ? order.services : "", // Only for "Used" category
            price: order?.category === "Used" ? order.price : "0",
        });
        }
    }, [orderItem, order]);

    const validateVIN = (vin) => /^[A-Za-z0-9]{6}$/.test(vin);

    const handleInputChange = (e) => {
        let updatedPrice = formData.price;
        if (e.target.name === "services") {
            updatedPrice = servicePrices[e.target.value] || 0;
        }
        if (e.target.name === "vin_no") {
            const vinInput = e.target.value.toUpperCase();
            if (vinInput.length === 6 && validateVIN(vinInput)) {
                handleVINValidation(vinInput);
                setIsButtonDisabled(false);
            } else if (vinInput.length < 6) {
                setError("VIN must be 6 alphanumeric characters.");
                setIsButtonDisabled(true);
            }
        }
        setFormData({ ...formData, [e.target.name]: e.target.value, price: updatedPrice });
    };

    const handleVINValidation = async (vin) => {
        try {
          const response = await apiClient.post(`/orders/validate-vin`, { vin_no: vin });
          if (response.data.success) {
              setError("");
              setSuccess("VIN number is valid.");
              setIsButtonDisabled(false);
              return true;
          } else {
            setError(response.data.error);
            setSuccess("");
            setIsButtonDisabled(true);
            return false;
          }
        } catch (error) {
          console.error('Error validating VIN:', error.response?.data?.message || error.message);
          setError(error.response?.data?.message || error.message);
          setSuccess("");
          setIsButtonDisabled(true);
          return false;
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.put(`/orders/update-item/${orderItem.orderitem_id}`, {
                order_id: order.order_id, // Pass order ID
                ...formData,
            });
            alert("Order item updated successfully!");
            onClose(); // Close modal on success
            refreshOrders();
        } catch (error) {
            console.error("Error updating order item:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? "open" : ""}`}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Edit Order Item</h2>
                <form onSubmit={handleSubmit}>
                    <label>VIN:</label>
                    <input
                        type="text"
                        name="vin_no"
                        value={formData.vin_no}
                        maxLength={6}
                        onChange={handleInputChange}
                    />
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    {order?.category === "Used" && (
                        <>
                        <label>Color:</label>
                        <input
                            type="text"
                            name="color"
                            value={formData.color}
                            onChange={handleInputChange}
                        />

                        <label>Services:</label>
                        <select
                            name="services"
                            value={formData.services}
                            onChange={handleInputChange}
                        >
                            <option value="">Select a Service</option>
                            <option value="Extreme Detail">Extreme Detail - $2200</option>
                            <option value="Full Detail">Full Detail - $1300</option>
                            <option value="Partial Detail">Partial Detail - $1000</option>
                            <option value="Quick Wash">Quick Wash - $300</option>
                            <option value="Custom Order">Custom Order</option>
                        </select>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            disabled
                        />
                        </>
                    )}

                    <label>Truck Company:</label>
                    <select
                        name="truck_company"
                        value={formData.truck_company}
                        onChange={(e) => handleTruckCompanyChange(e.target.value)}
                    >
                        <option value="">Select Truck Company</option>
                        {uniqueTruckCompanies.map((truckcompany) => (
                        <option key={truckcompany} value={truckcompany}>{truckcompany}</option>
                        ))}
                    </select>

                    <label>Truck Type:</label>
                    <select
                        name="truck_type"
                        value={formData.truck_type}
                        onChange={handleInputChange}
                    >
                        {availableTruckTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                        ))}
                    </select>

                    <label>Custom Price:</label>
                    <input
                        type="number"
                        name="custom_price"
                        value={formData.custom_price}
                        onChange={handleInputChange}
                    />

                    <label>Comment:</label>
                    <textarea
                        placeholder="Add a comment..."
                        name="comment"
                        value={formData.comment}
                        onChange={handleInputChange}
                    />

                    <button type="submit" disabled={isButtonDisabled}>Update</button>
                    <button type="button" onClick={onClose} className="close-btn">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default EditOrderItemModal;
