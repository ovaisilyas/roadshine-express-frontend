import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import UserLandingPage from "./pages/UserLandingPage";
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
      </Routes>
    </Router>
  );
};

export default App;
