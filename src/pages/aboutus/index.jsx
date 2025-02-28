import React from 'react'
import Header from '../../components/header'
import Footer from '../../components/footer'
import '../../static/css/StaticPages.css'

const AboutUs = ({user, setUser}) => {
  return (
    <div className='main-static'>
        <Header user={user} setUser={setUser}/>
        <div className='aboutus-body'>
          <h1>About Us</h1>
          <p>RoadShine Express LLC: Where Innovation Meets Excellence</p>
          <br/>
          <p>At RoadShine Express LLC, we don't just wash trucks—we redefine what exceptional service looks like. As pioneers in the industry, we combine top-tier truck washing with cutting-edge technology, delivering results that speak for themselves. Our mission? To make every truck shine while transforming how truck wash businesses operate, grow, and thrive.</p>
          <br/>
          <h2>Our Story: Beyond the Wash—Empowering Success</h2>
          <p>We saw a problem: outdated, inefficient systems holding truck wash businesses back. So, we built the solution—a powerful web-based platform designed specifically for the truck washing industry. It's more than software; it's a business accelerator that simplifies operations, boosts efficiency, and puts you in control.</p>
          <br/>
          <p>Imagine no more paperwork, no more scheduling headaches, and no more missed opportunities—just seamless, streamlined operations that fuel growth.</p>
          <br/>
          <h2>Why Choose RoadShine Express?</h2>
          <p>🚀 Expert Truck Washing: With years of hands-on experience, we deliver unparalleled attention to detail, ensuring every inch of your truck shines like new.</p>
          <p>💡 Revolutionary Technology: Our one-of-a-kind subscription platform transforms how truck wash businesses run—offering real-time tracking, order management, invoicing, and more, all in one easy-to-use system.</p>
          <p>⚙ Unmatched Efficiency: Save time, cut costs, and scale faster. Our system eliminates bottlenecks, reduces errors, and keeps your operations running like a well-oiled machine.</p>
          <p>🏆 Proven Results: We don't just promise excellence—we deliver it. Every truck. Every wash. Every time.</p>
          <br/>
          <h2>Meet the Team: Your Partners in Growth</h2>
          <p>Behind RoadShine Express LLC is a team of passionate experts dedicated to one goal: your success. We don’t just offer services—we build partnerships, working alongside you to ensure your business shines as brightly as the trucks you clean.</p>
          <br/>
          <h3>✨ Ready to Supercharge Your Truck Wash Business?</h3>
          <p>Join the RoadShine revolution and experience the future of truck washing today.</p>
          <br/>
          <p>👉 [Contact Us Now] and see how we can make your business unstoppable.</p>
        </div>
        <Footer/>
    </div>
  )
}

export default AboutUs
