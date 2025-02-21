import React from 'react'
import ContactForm from '../../components/contact-form';
import Header from '../../components/header';
import Footer from '../../components/footer';
import '../../static/css/StaticPages.css'

const ContactUs = ({user, setUser}) => {
  return (
    <div className='main-static'>
        <Header user={user} setUser={setUser}/>
        <ContactForm/>
        <Footer/>
    </div>
  )
}

export default ContactUs;