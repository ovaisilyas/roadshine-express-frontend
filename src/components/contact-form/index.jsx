import React, { useState } from "react";
import apiClient from "../../utils/ApiClient"; // Adjust the import based on your project structure
import "../../static/css/ContactForm.css"; // Add styling

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    inquiryType: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inquiryTypes = [
    "Truck Washing Service",
    "Platform Subscription",
    "General Inquiry",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.inquiryType || !formData.message) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await apiClient.post("/contact", formData);
      if (response.status === 200) {
        setSuccess("Your message has been sent successfully!");
        setFormData({ name: "", email: "", phone: "", address: "", inquiryType: "", message: "" });
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setError("Failed to send your message. Please try again later.");
    }
  };

  return (
    <div className="contact-page">
      <h2>Contact Us</h2>
      <p>Have a question? Get in touch with us!</p>

      <form className="contact-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Phone:</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} />

        <label>Inquiry Type:</label>
        <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} required>
          <option value="">Select an Option</option>
          {inquiryTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label>Message:</label>
        <textarea name="message" value={formData.message} onChange={handleChange} required />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ContactForm;