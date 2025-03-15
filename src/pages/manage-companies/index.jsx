import React, { useState, useEffect } from "react";
import apiClient from "../../utils/ApiClient";
import "../../static/css/CompanyPage.css";
import Header from "../../components/header";
import Footer from "../../components/footer";

const CompanyPage = ({ user, setUser }) => {
    const [companies, setCompanies] = useState([]);
    const [editingCompany, setEditingCompany] = useState(null);
    const [formData, setFormData] = useState({
        company: "",
        address1: "",
        address2: "",
        zipcode: "",
        phone: "",
        email: "",
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await apiClient.get("/companies");
            setCompanies(response.data);
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCompany) {
                await apiClient.put(`/companies/${editingCompany.company_id}`, formData);
            } else {
                await apiClient.post("/companies", formData);
            }
            setEditingCompany(null);
            fetchCompanies();
            resetForm();
        } catch (error) {
            console.error("Error saving company:", error);
        }
    };

    const resetForm = () => {
        setFormData({ company: "", address1: "", address2: "", zipcode: "", phone: "", email: "" });
        setEditingCompany(null);
    };

    const handleEdit = (company) => {
        setEditingCompany(company);
        setFormData(company);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this company?")) {
            try {
                await apiClient.delete(`/companies/${id}`);
                fetchCompanies();
            } catch (error) {
                console.error("Error deleting company:", error);
            }
        }
    };

    return (
        <div className="company-page">
            <Header user={user} setUser={setUser} />
            <main>
                <h2>Company Management</h2>
                <div className="company-form-container">
                <form onSubmit={handleSubmit} className="company-form">
                    <input type="text" name="company" placeholder="Company Name" value={formData.company} onChange={handleChange} required />
                    <input type="text" name="address1" placeholder="Address 1" value={formData.address1} onChange={handleChange} required />
                    <input type="text" name="address2" placeholder="Address 2" value={formData.address2} onChange={handleChange} />
                    <input type="text" name="zipcode" placeholder="Zipcode" value={formData.zipcode} onChange={handleChange} />
                    <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <button type="submit">{editingCompany ? "Update Company" : "Add Company"}</button>
                    {editingCompany && <button type="button" onClick={resetForm}>Cancel</button>}
                </form>
                </div>
                <h3>All Companies</h3>
                <table className="company-table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Address 1</th>
                            <th>Address 2</th>
                            <th>Zipcode</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company) => (
                            <tr key={company.company_id}>
                                <td>{company.company}</td>
                                <td>{company.address1}</td>
                                <td>{company.address2 || "N/A"}</td>
                                <td>{company.zipcode}</td>
                                <td>{company.phone}</td>
                                <td>{company.email}</td>
                                <td>
                                    <button onClick={() => handleEdit(company)}>Edit</button>
                                    <button onClick={() => handleDelete(company.company_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            <Footer />
        </div>
    );
};

export default CompanyPage;
