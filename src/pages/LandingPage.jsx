import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../static/css/LandingPage.css";

const LandingPage = ({ user, setUser }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Header user={user} setUser={setUser}/>
      <HeroBanner />
      <main>
        <section className="about">
          <h2>About Us</h2>
          <p>
            Welcome to Truck Wash Services, where we ensure your fleet stays clean 
            and professional. Our reliable services are trusted by companies nationwide.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;