import React from 'react'
import Header from '../../components/header'
import Footer from '../../components/footer'
import '../../static/css/StaticPages.css'

const AboutUs = ({user, setUser}) => {
  return (
    <div className='main-static'>
        <Header user={user} setUser={setUser}/>
        <h2>About Us</h2>
        <p>RodShine Express LLC: Trusted Expertise & Innovative Solutions</p>
        <h3>Our Story:</h3>
        <p>RodShine Express LLC is more than just a truck washing company-we are pioneers in providing an
            exclusive web-based platform for truck washing businesses. Recognizing the lack of software
            tailored to the industry, we built a database that simplifies operations, improves efficiency, and helps
            RodShine Express LLC Website Content
            businesses grow
        </p>
        <h3>What Sets Us Apart:</h3>
        <p>- Expert Truck Washing: Years of experience delivering top-notch services.</p>
        <p>- Innovative Technology: The only subscription-based platform designed for truck wash companies.</p>
        <h3>Team Section:</h3>
        <p> Meet the team at RodShine Express LLC, dedicated to delivering exceptional service and industry innovation.</p>
        <Footer/>
    </div>
  )
}

export default AboutUs
