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
import OrderHistoryPage from "./pages/order-history";
import ManageTruckCompanies from "./pages/manage-truck-companies";
import Services from "./pages/services";
import AboutUs from "./pages/aboutus";
import ContactUs from "./pages/contactus";
import ExpensePage from "./pages/expenses";
import CompanyPage from "./pages/manage-companies";

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
        <Route path="/services" element={<Services user={user} setUser={setUser} />} />
        <Route path="/about" element={<AboutUs user={user} setUser={setUser} />} />
        <Route path="/contact" element={<ContactUs user={user} setUser={setUser} />} />
        <Route path="/signin" element={<SignInPage setUser={setUser}/>} />
        <Route path="/user" element={<UserLandingPage user={user} setUser={setUser}/>} />
        <Route path="/user/orders" element={<OrderHistoryPage user={user} setUser={setUser}/>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard user={user} setUser={setUser}/></ProtectedRoute>} />
        <Route path="/admin/manage-truck-companies" element={<ProtectedRoute><ManageTruckCompanies user={user} setUser={setUser}/></ProtectedRoute>} />
        <Route path="/admin/manage-trucks" element={<ProtectedRoute><ManageTrucks user={user} setUser={setUser}/></ProtectedRoute>} />
        <Route path="/admin/manage-users" element={<ProtectedRoute><ManageUsers user={user} setUser={setUser}/></ProtectedRoute>} />
        <Route path="/admin/manage-orders" element={<ProtectedRoute><ManageOrders user={user} setUser={setUser}/></ProtectedRoute>} />
        <Route path="/admin/invoice-list" element={<ProtectedRoute><InvoiceList user={user} setUser={setUser}/></ProtectedRoute>} />
        <Route path="/admin/invoicing" element={<ProtectedRoute><Invoicing user={user} setUser={setUser}/></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute><Reports user={user} setUser={setUser}/></ProtectedRoute>} />
        <Route path="/admin/reports/expenses" element={<ProtectedRoute><ExpensePage user={user} setUser={setUser}/></ProtectedRoute>} />
        <Route path="/admin/manage-companies" element={<ProtectedRoute><CompanyPage user={user} setUser={setUser}/></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
