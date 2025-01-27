import React, {/*useState*/} from "react";
//import { useNavigate } from "react-router-dom";
import HeroBanner from "../../components/hero-banner";
import Footer from "../../components/footer";
import Header from "../../components/header";
import "../../static/css/LandingPage.css";

const LandingPage = ({ user, setUser }) => {
  //const navigate = useNavigate();

  return (
    <div>
      <Header user={user} setUser={setUser}/>
      <HeroBanner />
      <main>
        <section className="about">
          <h2>About Us</h2>
          <p>
          We are a detail truck company.<br />
          We wash, clean inside and outside of the truck, paint the frame, and shine the rims<br />
          We are located in Nashville, TN.<br /> We contract major truck dealerships and shine their trucks and make their custmers happy. Wether its a New Truck that needs freshing up or a used truck that needs a complete flip.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;