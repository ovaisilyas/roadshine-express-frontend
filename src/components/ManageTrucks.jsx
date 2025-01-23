import React, { useState, useEffect } from "react";
import axios from "axios";
import TruckForm from "./TruckForm";
import Footer from "./Footer";
import Header from "./Header";
import "../static/css/ManageTrucks.css";

const ManageTrucks = ({ user, setUser }) => {
  const [trucks, setTrucks] = useState([]);
  const [editingTruck, setEditingTruck] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const baseURL = "http://localhost:5000";

  const fetchTrucks = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/trucks`);
      setTrucks(response.data);
    } catch (error) {
      console.error("Error fetching trucks:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFormSubmit = async (formData) => {
    if (editingTruck) {
        try {
            await axios.put(`${baseURL}/api/trucks/${formData.truck_id}`, formData);
            setTrucks(trucks.map((truck) => (truck.truck_id === formData.truck_id ? formData : truck)));
            alert("Truck updated successfully!");
        } catch (error) {
            console.error("Error updating truck:", error);
            alert("Failed to update truck.");
        }
    } else {
        // Add truck
        try {
            await axios.post(`${baseURL}/api/trucks/`, formData);
            setTrucks([...trucks, formData]);
            alert("Truck created successfully!");
        } catch (error) {
            console.error("Error creating truck:", error);
            alert("Failed to create truck.");
        }
    }
    setShowForm(false);
    };

    const handleAddTruck = () => {
        setEditingTruck(null);
        setShowForm(true);
    };

    const handleEditTruck = (truck) => {
        setEditingTruck(truck);
        setShowForm(true);
    };

  useEffect(() => {
    fetchTrucks();
  }, []);

  const filteredTrucks = trucks.filter((truck) =>
    `${truck.vin_no}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/trucks/${id}`);
      fetchTrucks();
    } catch (error) {
      console.error("Error deleting truck:", error);
    }
  };

  return (
    <div className="manage-trucks">
    <Header user={user} setUser={setUser}/>
    <header>
        <h1>Manage Trucks</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by VIN number..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <button onClick={handleAddTruck}>Add Truck</button>
      </header>

      {showForm ? (
        <TruckForm
          truck={editingTruck}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <table className="truck-table">
            <thead>
            <tr>
                <th>VIN Number</th>
                <th>Color</th>
                <th>Truck Company</th>
                <th>Truck Type</th>
                <th>Price</th>
                <th>Company</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {filteredTrucks.map((truck) => (
                <tr key={truck.truck_id}>
                <td>{truck.vin_no}</td>
                <td>{truck.color}</td>
                <td>{truck.truck_company}</td>
                <td>{truck.truck_type}</td>
                <td>${truck.price}</td>
                <td>{truck.company}</td>
                <td>
                    <button onClick={() => handleEditTruck(truck)}>Edit</button>
                    <button onClick={() => handleDelete(truck.truck_id)}>Delete</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
      )}
      <Footer />
    </div>
  );
};

export default ManageTrucks;