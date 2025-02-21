import React, { useState, useEffect } from "react";
import apiClient from "../../utils/ApiClient";
import PasswordInput from "../password-input";

const UserForm = ({ user = {}, onSubmit, onCancel }) => {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    users_id: user?.users_id || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    password: user?.password || "",
    company: user?.company || "",
    organization: user?.organization || "",
    status: user?.status || "active",
    role: user?.role || "User",
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the full payload of the user being edited or added
    onSubmit(formData);
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h2>{formData?.users_id ? "Edit User" : "Add User"}</h2>
      <label>First Name</label>
      <input
        type="text"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        required
      />
      <label>Last Name</label>
      <input
        type="text"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        required
      />
      <label>Phone</label>
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <label>Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <label>Password</label>
      <PasswordInput
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required={!formData?.users_id} // Password is only required when adding a new user
      />
      <label>Company</label>
      <select value={formData.company} name="company" onChange={handleChange}>
          <option value="">Select Company</option>
          {companies.map((company, index) => (
              <option key={index} value={company}>{company}</option>
          ))}
      </select>
      <label>Organization</label>
      <input
        type="text"
        name="organization"
        value={formData.organization}
        onChange={handleChange}
        required
      />
      <label>Status</label>
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <label>Role</label>
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
      >
        <option value="User">User</option>
        <option value="Administrator">Administrator</option>
        <option value="Accountant">Accountant</option>
      </select>
      <button type="submit">{formData?.users_id ? "Save Changes" : "Add User"}</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default UserForm;