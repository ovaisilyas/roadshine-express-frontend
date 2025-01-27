import React, { useState, useEffect } from "react";
import UserForm from "../../components/user-form";
import Footer from "../../components/footer";
import Header from "../../components/header";
import "../../static/css/ManageUsers.css";
import apiClient from "../../utils/ApiClient";

const ManageUsers = ({ user, setUser }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get(`/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      await apiClient.delete(`/users/${id}`);
      setUsers(users.filter((user) => user.users_id !== id));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  const handleFormSubmit = async (currentUser) => {
    if (editingUser) {
      // Update user
      try {
        await apiClient.put(`/users/${currentUser.users_id}`, currentUser);
        setUsers(users.map((user) => (user.users_id === currentUser.users_id ? currentUser : user)));
        alert("User updated successfully!");
      } catch (error) {
        console.error("Error updating user:", error);
        alert("Failed to update user.");
      }
    } else {
      // Add user
      try {
        await apiClient.post(`/users/`, currentUser);
        setUsers([...users, currentUser]);
        alert("User created successfully!");
      } catch (error) {
        console.error("Error creating user:", error);
        alert("Failed to create user.");
      }
    }
    setShowForm(false);
  };

  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-users">
        <Header user={user} setUser={setUser}/>
      <header>
        <h1>Manage Users</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <button onClick={handleAddUser}>Add User</button>
      </header>

      {showForm ? (
        <UserForm
          user={editingUser}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{`${user.first_name} ${user.last_name}`}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.company}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEditUser(user)}>Edit</button>
                  <button onClick={() => handleDeleteUser(user.users_id)}>
                    Delete
                  </button>
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

export default ManageUsers;