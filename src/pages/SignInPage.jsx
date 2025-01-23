import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "../static/css/SignInPage.css";

const SignInPage = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:5000/api/users/signin", { email, password });
        const { token, user } = response.data;
        if (response.data.token) {
          // Save the token in localStorage or a secure place
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("authToken", token);
          if(user.role === 'User'){
            navigate("/user");
          } else if(user.role === 'Administrator'){
            navigate("/admin");
          } else {
            // Redirect to the landing page
            navigate("/");
          }
        } else {
          setErrorMessage("Invalid Credentials. Please try again.");
       }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setErrorMessage("User not found. Please register.");
        } else {
          setErrorMessage("An error occurred during sign-in.");
        }
      }
  };

  return (
    <div>
      <Header />
      <main className="signin-container">
        <form onSubmit={handleSignIn}>
          <h2>Sign In</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Error message */}
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign In</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default SignInPage;