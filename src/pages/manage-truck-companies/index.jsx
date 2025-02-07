import React, { useState, useEffect, useMemo } from "react";
import apiClient from "../../utils/ApiClient";
import "../../static/css/ManageTruckCompanies.css";
import Header from "../../components/header";
import Footer from "../../components/footer";

const ManageTruckCompanies = ({user, setUser}) => {
    const [companies, setCompanies] = useState([]);
    const [truckCompanies, setTruckCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [newTruckCompany, setNewTruckCompany] = useState("");
    const [newTruckType, setNewTruckType] = useState("");
    const [newStatus, setNewStatus] = useState(true);
    const [newPicture, setNewPicture] = useState(null);
    const [editingTruck, setEditingTruck] = useState(null);
    const [errorMessage, setErrorMessage] = useState(""); // ✅ For validation errors

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await apiClient.get("/trucks/companies");
            setCompanies(response.data.map((c) => c.company));
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    const fetchTruckCompanies = async (company) => {
        if(company === "") {
            resetForm();
            setSelectedCompany("");
            return;
        }

        setSelectedCompany(company);
        try {
            const response = await apiClient.get(`/trucks/truckcompanies?company=${company}`);
            console.log(response.data);
            setTruckCompanies(response.data);
        } catch (error) {
            console.error("Error fetching truck companies:", error);
        }

    };

    const isFormValid = useMemo(() => {
        return selectedCompany && newTruckCompany && newTruckType;
    }, [selectedCompany, newTruckCompany, newTruckType]);

    const handleAddTruckCompany = async () => {
        console.log(isFormValid);
        if (!isFormValid) {
            setErrorMessage("All fields are required!");
            return;
        }
        setErrorMessage(""); // Clear previous errors

        try {
            const formData = new FormData();
            formData.append("truck_company", newTruckCompany);
            formData.append("truck_type", newTruckType);
            formData.append("company", selectedCompany);
            formData.append("status", newStatus);
            if (newPicture) formData.append("picture", newPicture); // ✅ Append picture file

            await apiClient.post("/trucks/company", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            fetchTruckCompanies(selectedCompany);
            resetForm();
        } catch (error) {
            console.error("Error adding truck company:", error);
        }
    };

    const handleDeleteTruckCompany = async (id) => {
        try {
            await apiClient.delete(`/trucks/company/${id}`);
            fetchTruckCompanies(selectedCompany);
        } catch (error) {
            console.error("Error deleting truck company:", error);
        }
    };

    const handleEditTruckCompany = (truck) => {
        setEditingTruck(truck);
        setNewTruckCompany(truck.truck_company);
        setNewTruckType(truck.truck_type);
        setNewStatus(truck.status);
    };

    const handleUpdateTruckCompany = async () => {
        if (!isFormValid) {
            setErrorMessage("All fields are required!");
            return;
        }
        setErrorMessage(""); // Clear previous errors

        if (!editingTruck) return;
        try {
            const formData = new FormData();
            formData.append("truck_company", newTruckCompany);
            formData.append("truck_type", newTruckType);
            formData.append("company", selectedCompany);
            formData.append("status", newStatus);
            if (newPicture) formData.append("picture", newPicture); // ✅ Append picture file

            await apiClient.put(`/trucks/company/${editingTruck.truck_company_id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setEditingTruck(null);
            fetchTruckCompanies(selectedCompany);
            resetForm();
        } catch (error) {
            console.error("Error updating truck company:", error);
        }
    };

    const resetForm = () => {
        setNewTruckCompany("");
        setNewTruckType("");
        setNewPicture(null);
        setErrorMessage("");
        setEditingTruck(null);
    };

    return (
        <div className="manage-truck-companies">
            <Header user={user} setUser={setUser} />
            <div className="manage-truck-comp-body">
                <h2>Manage Truck Companies</h2>

                <label>Company:</label>
                <select value={selectedCompany} onChange={(e) => fetchTruckCompanies(e.target.value)}>
                    <option value="">Select Company</option>
                    {companies.map((company, index) => (
                        <option key={index} value={company}>{company}</option>
                    ))}
                </select>

                <h3>{editingTruck ? "Edit Truck Company" : "Add New Truck Company"}</h3>

                {errorMessage && <p className="error">{errorMessage}</p>} {/* ✅ Display error message */}

                <input type="text" placeholder="Truck Company" value={newTruckCompany} onChange={(e) => setNewTruckCompany(e.target.value)} />
                <input type="text" placeholder="Truck Type" value={newTruckType} onChange={(e) => setNewTruckType(e.target.value)} />
                <input type="file" onChange={(e) => setNewPicture(e.target.files[0])} />

                <select onChange={(e) => setNewStatus(e.target.value === "true")} value={newStatus}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>

                {editingTruck ? (
                    <button onClick={handleUpdateTruckCompany} disabled={!isFormValid}>Update Truck Company</button>
                ) : (
                    <button onClick={handleAddTruckCompany} disabled={!isFormValid}>Add Truck Company</button>
                )}

                <h3>Existing Truck Companies</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Truck Company</th>
                            <th>Truck Type</th>
                            <th>Status</th>
                            <th>Picture</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {truckCompanies.map((truck) => (
                            <tr key={truck.truck_company_id}>
                                <td>{truck.truck_company}</td>
                                <td>{truck.truck_type}</td>
                                <td>{truck.status ? "Active" : "Inactive"}</td>
                                <td>
                                {truck.picture && (
                                    <img
                                        src={`http://localhost:5000${truck.picture}`}
                                        alt="Truck"
                                        width="100"
                                    />
                                )}
                                </td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEditTruckCompany(truck)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDeleteTruckCompany(truck.truck_company_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    );
};

export default ManageTruckCompanies;
