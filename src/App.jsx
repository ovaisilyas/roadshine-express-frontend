import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import UserLandingPage from "./pages/UserLandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import ManageTrucks from "./components/ManageTrucks";
import ManageUsers from "./components/ManageUsers";
import ManageOrders from "./components/ManageOrders";
import Invoicing from "./components/Invoicing";
import Reports from "./components/Reports";
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user info from localStorage on app load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage user={user} setUser={setUser} />} />
        <Route path="/signin" element={<SignInPage setUser={setUser}/>} />
        <Route path="/user" element={<UserLandingPage user={user} setUser={setUser}/>} />
        <Route path="/admin" element={<AdminDashboard user={user} setUser={setUser}/>} />
        <Route path="/admin/manage-trucks" element={<ManageTrucks user={user} setUser={setUser}/>} />
        <Route path="/admin/manage-users" element={<ManageUsers user={user} setUser={setUser}/>} />
        <Route path="/admin/manage-orders" element={<ManageOrders user={user} setUser={setUser}/>} />
        <Route path="/admin/invoicing" element={<Invoicing user={user} setUser={setUser}/>} />
        <Route path="/admin/reports" element={<Reports user={user} setUser={setUser}/>} />
      </Routes>
    </Router>
  );
};

export default App;
