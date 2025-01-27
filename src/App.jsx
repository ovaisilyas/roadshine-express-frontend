import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/home-page";
import SignInPage from "./pages/signin-page";
import UserLandingPage from "./pages/user-homepage";
import AdminDashboard from "./pages/admin-dashboard";
import ManageTrucks from "./pages/manage-trucks";
import ManageUsers from "./pages/manage-users";
import ManageOrders from "./pages/manage-orders";
import Invoicing from "./pages/invoicing";
import InvoiceList from "./pages/invoice-list";
import Reports from "./pages/reports";
import './App.css';
import ProtectedRoute from "./routes/ProtectedRoute";

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
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard user={user} setUser={setUser}/></ProtectedRoute>} />
        <Route path="/admin/manage-trucks" element={<ProtectedRoute><ManageTrucks user={user} setUser={setUser}/></ProtectedRoute>} />
        <Route path="/admin/manage-users" element={<ProtectedRoute><ManageUsers user={user} setUser={setUser}/></ProtectedRoute>} />
        <Route path="/admin/manage-orders" element={<ProtectedRoute><ManageOrders user={user} setUser={setUser}/></ProtectedRoute>} />
        <Route path="/admin/invoice-list" element={<ProtectedRoute><InvoiceList user={user} setUser={setUser}/></ProtectedRoute>} />
        <Route path="/admin/invoicing" element={<ProtectedRoute><Invoicing user={user} setUser={setUser}/></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute><Reports user={user} setUser={setUser}/></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
