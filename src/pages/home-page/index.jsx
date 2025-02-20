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
      <div id="services" class="section">
          <h2>Our Services</h2>
          <ul>
              <li>✔ Full Exterior Truck Washing</li>
              <li>✔ Interior Detailing</li>
              <li>✔ Frame and Underbody Cleaning</li>
              <li>✔ Custom Detailing Packages</li>
          </ul>
      </div><div id="contact" class="section">
          <h2>Contact Us</h2>
          <p>Reach out to us for bookings and inquiries:</p>
          <p>Email: roadshineexpress@gmail.com</p>
          <p>Phone: (123) 456-7890</p>
      </div>
      <div className="section">
        <h2>What We Do:</h2>
        <p>- Professional Truck Washing Services: From individual trucks to fleets, we ensure your vehicles are spotless and road-ready.</p>
        <p>- Innovative Web-Based Database: The only platform exclusively built for truck washing businesses, offering invoicing, payment processing, reports, truck profiles, and unlimited storage. </p>
        <h2>Call-to-Action:</h2>
        <p>- Keep Your Trucks Clean: Schedule a Wash Today!</p>
        <p>- Revolutionize Your Truck Wash Business: Subscribe to Our Platform Now!</p>
      </div>
      <div className="section">
        <h2>About Us</h2>
        <p>We wash, clean inside and outside of the truck, paint the frame, and shine the rims</p>
        <p>We are located in Nashville, TN. We contract major truck dealerships and shine their trucks and make their custmers happy. Wether its a New Truck that needs freshing up or a used truck that needs a complete flip.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;