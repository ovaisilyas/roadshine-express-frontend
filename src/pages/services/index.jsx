import React from 'react'
import Header from '../../components/header'
import Footer from '../../components/footer'

const Services = ({user, setUser}) => {
  return (
    <div>
        <Header user={user} setUser={setUser}/>
        <h2>Services</h2>
        <p>Truck Wash Services You Can Count On</p>
        <h2>Detailed Services:</h2>
        <p>1. Full-Service Truck Wash: Comprehensive exterior and undercarriage cleaning.</p>
        <p>2. Fleet Contracts: Flexible plans tailored to keep fleets clean and professional.</p>
        <p>3. Trailer Interior Cleaning: Disinfect and sanitize cargo areas to ensure hygiene compliance.</p>
        <p>4. Polishing & Detailing: Aluminum polishing, bug removal, and tire shining.</p>
        <p>Call-to-Action: Keep Your Fleet Shining - Contact us for individual services or fleet cleaning plans.</p>
        <Footer/>
    </div>
  )
}

export default Services
