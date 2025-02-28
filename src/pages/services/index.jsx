import React from 'react'
import Header from '../../components/header'
import Footer from '../../components/footer'
import '../../static/css/StaticPages.css'

const Services = ({user, setUser}) => {
  return (
    <div className='main-static'>
        <Header user={user} setUser={setUser}/>
        <div className='services-body'>
          <h1>Services You Can Count On</h1>
          <p>Premium Truck Washing & Detailing Tailored to Your Needs</p>
          <p>At Roadshine Express LLC, we don't just wash trucks—we elevate your fleet's appearance while protecting your investment. Whether you're managing a single truck or an entire fleet, our cutting-edge services ensure every vehicle shines on the road and reflects the professionalism of your business.
          </p>
          <br/>
          <h3>Our Signature Services: Precision, Excellence, and Care</h3>
          <h2>1. 🚿 Full-Service Truck Wash:</h2>
          <p>Experience a comprehensive exterior and undercarriage cleaning that removes dirt, grime, and road salt while protecting your paint and finish. Every wash leaves your truck looking brand new.</p>
          <h2>2. 📜 Fleet Contracts:</h2>
          <p>Simplify fleet maintenance with our flexible, cost-effective cleaning plans. Keep your trucks clean, professional, and road-ready without the hassle of managing individual appointments.</p>
          <h2>3. 🧼 Trailer Interior Cleaning:</h2>
          <p>We go beyond the exterior! Our interior cleaning service disinfects and sanitizes cargo areas, ensuring hygiene compliance while maintaining a spotless environment for your goods.</p>
          <h2>4. ✨ Polishing & Detailing:</h2>
          <p>4. Polishing & Detailing: Aluminum polishing, bug removal, and tire shining.</p>
          <p>Turn heads with our premium polishing services—including aluminum polishing, bug removal, tire shining, and complete exterior detailing. Because your trucks deserve to look as sharp as they perform.</p>
          <br/>
          <h2>💪 Why Choose Roadshine Express?</h2>
          <p>✔ Unmatched Quality: Our experienced team treats every truck like it's their own.</p>
          <p>✔ Advanced Technology: Industry-leading tools and eco-friendly products for superior results.</p>
          <p>✔ Efficient & Reliable: Quick turnaround times so you can get back on the road faster.</p>
          <p>✔ Customer-Centric Approach: Tailored solutions to meet your unique business needs.</p>
          <br />
          <h2>🚨 Call to Action: Keep Your Fleet Shining!</h2>
          <p>Don't settle for average—elevate your fleet's image today! Whether you need a single wash or a full-service fleet contract, Roadshine Express LLC has you covered.</p>
          <br/>
          <p>👉 [Contact Us Now] and let's get your trucks road-ready, spotless, and shining like new!</p>
        </div>
        <Footer/>
    </div>
  )
}

export default Services
