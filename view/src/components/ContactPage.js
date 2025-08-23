import React, { useState } from "react";
import { 
  FiPhone, FiMapPin, FiSend, FiMessageSquare, 
  FiTwitter, FiCheck, FiX, FiAlertCircle,
  FiInstagram, FiLinkedin, FiFacebook, FiYoutube, FiGithub, FiMail
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const ContactPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    services: [],
    preferredContact: "email"
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [currentLocation, setCurrentLocation] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckbox = (service) => {
    setForm((prev) => {
      const services = prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services };
    });
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // You could automatically fill an address field here
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!form.message.trim()) newErrors.message = "Message is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Submitted:", form);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Reset form after successful submission
      setTimeout(() => {
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
          services: [],
          preferredContact: "email"
        });
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };

  const serviceOptions = [
    "Furniture design",
    "Custom furniture",
    "Home delivery",
    "Assembly service",
    "Interior consultation",
    "Other"
  ];

  const socialLinks = [
    { icon: <FiFacebook className="w-5 h-5" />, name: "Facebook", url: "https://facebook.com/furnihaven" },
    { icon: <FiInstagram className="w-5 h-5" />, name: "Instagram", url: "https://instagram.com/furnihaven" },
    { icon: <FiLinkedin className="w-5 h-5" />, name: "LinkedIn", url: "https://linkedin.com/company/furnihaven" },
    { icon: <FaWhatsapp className="w-5 h-5" />, name: "WhatsApp", url: "https://wa.me/919999999999" },
    { icon: <FiYoutube className="w-5 h-5" />, name: "YouTube", url: "https://youtube.com/@furnihaven" },
    { icon: <FiGithub className="w-5 h-5" />, name: "GitHub", url: "https://github.com/furnihaven" },
    { icon: <FiMail className="w-5 h-5" />, name: "Gmail", url: "mailto:furnihaven@gmail.com" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f0e5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with enhanced visual appeal */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#0f2c59] sm:text-5xl mb-3">
            Let's Connect With Us
          </h1>
          <p className="text-xl text-[#0f2c59] max-w-3xl mx-auto">
            We're here to help and answer any questions you might have. We look forward to hearing from you!
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <div className="w-16 h-1 bg-[#0f2c59] rounded-full"></div>
            <div className="w-8 h-1 bg-[#dac0a3] rounded-full"></div>
            <div className="w-4 h-1 bg-[#eadbc8] rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Left Form */}
          <div className="p-8 sm:p-10">
            {/* Tab Navigation with improved styling */}
            <div className="flex border-b border-gray-200 mb-8">
              <button
                onClick={() => setActiveTab("form")}
                className={`px-4 py-2 font-medium text-sm uppercase tracking-wider ${activeTab === "form" ? "text-[#0f2c59] border-b-2 border-[#0f2c59]" : "text-gray-500 hover:text-gray-700"}`}
              >
                Contact Form
              </button>
              <button
                onClick={() => setActiveTab("faq")}
                className={`px-4 py-2 font-medium text-sm uppercase tracking-wider ${activeTab === "faq" ? "text-[#0f2c59] border-b-2 border-[#0f2c59]" : "text-gray-500 hover:text-gray-700"}`}
              >
                FAQs
              </button>
              <button
                onClick={() => setActiveTab("support")}
                className={`px-4 py-2 font-medium text-sm uppercase tracking-wider ${activeTab === "support" ? "text-[#0f2c59] border-b-2 border-[#0f2c59]" : "text-gray-500 hover:text-gray-700"}`}
              >
                Support
              </button>
            </div>

            {activeTab === "form" ? (
              <>
                <h2 className="text-3xl font-bold text-[#0f2c59] mb-6">Send us a message</h2>
                
                {submitSuccess && (
                  <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-start gap-3">
                    <FiCheck className="mt-1 flex-shrink-0 text-green-500" />
                    <div>
                      <h3 className="font-semibold">Message sent successfully!</h3>
                      <p className="text-sm">We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-[#0f2c59] mb-1">First Name</label>
                      <input 
                        id="firstName"
                        name="firstName" 
                        placeholder="John" 
                        value={form.firstName} 
                        onChange={handleChange}
                        className={`border ${errors.firstName ? "border-red-300" : "border-gray-300"} p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0f2c59] focus:border-transparent`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FiAlertCircle className="flex-shrink-0" /> {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-[#0f2c59] mb-1">Last Name</label>
                      <input 
                        id="lastName"
                        name="lastName" 
                        placeholder="Doe" 
                        value={form.lastName} 
                        onChange={handleChange}
                        className={`border ${errors.lastName ? "border-red-300" : "border-gray-300"} p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0f2c59] focus:border-transparent`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <FiAlertCircle className="flex-shrink-0" /> {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#0f2c59] mb-1">Email</label>
                    <input 
                      id="email"
                      name="email" 
                      type="email" 
                      placeholder="you@company.com" 
                      value={form.email} 
                      onChange={handleChange}
                      className={`border ${errors.email ? "border-red-300" : "border-gray-300"} p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0f2c59] focus:border-transparent`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FiAlertCircle className="flex-shrink-0" /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[#0f2c59] mb-1">Phone (Optional)</label>
                    <input 
                      id="phone"
                      name="phone" 
                      type="tel" 
                      placeholder="+1 (555) 000-0000" 
                      value={form.phone} 
                      onChange={handleChange}
                      className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0f2c59] focus:border-transparent"
                    />
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-sm font-medium text-[#0f2c59] mb-2">Preferred Contact Method</label>
                    <div className="flex gap-4">
                      {['email', 'phone', 'whatsapp'].map((method) => (
                        <label key={method} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContact"
                            checked={form.preferredContact === method}
                            onChange={() => setForm(prev => ({...prev, preferredContact: method}))}
                            className="h-4 w-4 text-[#0f2c59] focus:ring-[#0f2c59] border-gray-300"
                          />
                          <span className="text-sm text-[#0f2c59] capitalize">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#0f2c59] mb-1">Your Message</label>
                    <textarea 
                      id="message"
                      name="message" 
                      rows="4" 
                      placeholder="How can we help you?" 
                      value={form.message}
                      onChange={handleChange}
                      className={`border ${errors.message ? "border-red-300" : "border-gray-300"} p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0f2c59] focus:border-transparent`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FiAlertCircle className="flex-shrink-0" /> {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Services */}
                  <div>
                    <label className="block font-semibold mb-2 text-[#0f2c59]">Services you're interested in</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {serviceOptions.map((service) => (
                        <label key={service} className="flex items-center gap-2 cursor-pointer group">
                          <div className={`w-5 h-5 rounded border ${form.services.includes(service) ? 'bg-[#0f2c59] border-[#0f2c59]' : 'border-gray-300 group-hover:border-[#0f2c59]'} flex items-center justify-center transition-colors`}>
                            {form.services.includes(service) && <FiCheck className="text-white text-xs" />}
                          </div>
                          <span className="text-sm text-[#0f2c59] group-hover:text-[#0f2c59] transition-colors">{service}</span>
                          <input 
                            type="checkbox" 
                            checked={form.services.includes(service)} 
                            onChange={() => handleCheckbox(service)}
                            className="sr-only"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location Button */}
                  <div>
                    <button
                      type="button"
                      onClick={handleLocationClick}
                      className="text-sm text-[#0f2c59] hover:text-[#0a1f3d] flex items-center gap-2"
                    >
                      <FiMapPin className="text-[#0f2c59]" />
                      {currentLocation ? 
                        `Location detected: ${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}` : 
                        "Share your location (optional)"}
                    </button>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full bg-[#0f2c59] text-white py-3 rounded-lg hover:bg-[#0a1f3d] transition flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend className="text-white" />
                        Send message
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : activeTab === "faq" ? (
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-[#0f2c59] mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-3">
                  {[
                    {
                      question: "How quickly can I expect a response?",
                      answer: "We typically respond to inquiries within 24 hours during business days (Monday to Friday, 9am-5pm EST). For urgent matters, please call our support line."
                    },
                    {
                      question: "What are your business hours?",
                      answer: "Our customer service team is available Monday through Friday from 9am to 5pm EST. Technical support is available 24/7 for critical issues."
                    },
                    {
                      question: "Do you offer emergency support?",
                      answer: "Yes, we have 24/7 emergency support for our premium clients. Standard support requests are handled during business hours."
                    },
                    {
                      question: "What payment methods do you accept?",
                      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and cryptocurrency for certain services."
                    },
                    {
                      question: "Can I schedule a call with your team?",
                      answer: "Absolutely! After submitting your inquiry, our team will contact you to schedule a consultation at your convenience."
                    }
                  ].map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md">
                      <button className="w-full px-4 py-3 text-left font-medium text-[#0f2c59] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0f2c59]/20 flex justify-between items-center">
                        <span>{faq.question}</span>
                        <svg className="w-5 h-5 text-[#0f2c59] transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className="px-4 py-3 bg-gray-50 text-[#0f2c59]">
                        {faq.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-[#0f2c59] mb-6">Support Center</h2>
                
                <div className="bg-[#f8f0e5] p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-[#0f2c59] mb-3">Technical Support</h3>
                  <p className="text-[#0f2c59] mb-4">
                    For technical issues, please contact our support team directly:
                  </p>
                  <div className="flex items-center gap-3 text-[#0f2c59] hover:text-[#0a1f3d] cursor-pointer transition-colors">
                    <FiPhone className="text-[#0f2c59]" />
                    <span>+1 (555) 987-6543 (24/7 Support)</span>
                  </div>
                </div>

                <div className="bg-[#f8f0e5] p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-[#0f2c59] mb-3">Community Forum</h3>
                  <p className="text-[#0f2c59] mb-4">
                    Join our community forum to get help from other users and our team:
                  </p>
                  <button className="bg-[#0f2c59] text-white px-4 py-2 rounded hover:bg-[#0a1f3d] transition">
                    Visit Community
                  </button>
                </div>

                <div className="bg-[#f8f0e5] p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-[#0f2c59] mb-3">Knowledge Base</h3>
                  <p className="text-[#0f2c59] mb-4">
                    Browse our extensive documentation and tutorials:
                  </p>
                  <button className="bg-[#0f2c59] text-white px-4 py-2 rounded hover:bg-[#0a1f3d] transition">
                    Explore Knowledge Base
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Info Panel */}
          <div className="bg-[#eadbc8] p-8 sm:p-10 flex flex-col">
            <div className="flex-grow space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-[#0f2c59] mb-4">Contact information</h3>
                <p className="text-[#0f2c59] mb-6">
                  Fill out the form and our team will get back to you within 24 hours. For urgent matters, please call us directly.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-[#0f2c59] mb-3 flex items-center gap-2">
                    <span className="bg-[#f8f0e5] p-2 rounded-full">
                      <FiMessageSquare className="text-[#0f2c59]" />
                    </span>
                    Chat with us
                  </h3>
                  <ul className="space-y-3 text-[#0f2c59]">
                    <li className="flex items-center gap-3 hover:text-[#0a1f3d] cursor-pointer transition-colors">
                      <span className="bg-[#f8f0e5] p-1 rounded-full">
                        <FiMessageSquare className="text-[#0f2c59] text-sm" />
                      </span>
                      Start a live chat
                    </li>
                    <li className="flex items-center gap-3 hover:text-[#0a1f3d] cursor-pointer transition-colors">
                      <span className="bg-[#f8f0e5] p-1 rounded-full">
                        <FiSend className="text-[#0f2c59] text-sm" />
                      </span>
                      furnihaven@gmail.com
                    </li>
                    <li className="flex items-center gap-3 hover:text-[#0a1f3d] cursor-pointer transition-colors">
                      <span className="bg-[#f8f0e5] p-1 rounded-full">
                        <FiInstagram className="text-[#0f2c59] text-sm" />
                      </span>
                      @furnihaven
                    </li>
                    <li className="flex items-center gap-3 hover:text-[#0a1f3d] cursor-pointer transition-colors">
                      <span className="bg-[#f8f0e5] p-1 rounded-full">
                        <FaWhatsapp className="text-[#0f2c59] text-sm" />
                      </span>
                      +91 99999 99999
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-[#0f2c59] mb-3 flex items-center gap-2">
                    <span className="bg-[#f8f0e5] p-2 rounded-full">
                      <FiPhone className="text-[#0f2c59]" />
                    </span>
                    Call us
                  </h3>
                  <div className="space-y-2 text-[#0f2c59]">
                    <p className="flex items-center gap-3 hover:text-[#0a1f3d] cursor-pointer transition-colors">
                      <span className="bg-[#f8f0e5] p-1 rounded-full">
                        <FiPhone className="text-[#0f2c59] text-sm" />
                      </span>
                      +1 (555) 123-4567 (General Inquiries)
                    </p>
                    <p className="flex items-center gap-3 hover:text-[#0a1f3d] cursor-pointer transition-colors">
                      <span className="bg-[#f8f0e5] p-1 rounded-full">
                        <FiPhone className="text-[#0f2c59] text-sm" />
                      </span>
                      +1 (555) 987-6543 (Support)
                    </p>
                    <p className="text-sm text-[#0f2c59]/70 ml-9">Mon-Fri from 9am to 5pm EST</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-[#0f2c59] mb-3 flex items-center gap-2">
                    <span className="bg-[#f8f0e5] p-2 rounded-full">
                      <FiMapPin className="text-[#0f2c59]" />
                    </span>
                    Visit us
                  </h3>
                  <p className="flex items-start gap-3 text-[#0f2c59] hover:text-[#0a1f3d] cursor-pointer transition-colors">
                    <span className="bg-[#f8f0e5] p-1 rounded-full mt-0.5">
                      <FiMapPin className="text-[#0f2c59] text-sm" />
                    </span>
                    100 Smith Street,<br />
                    Collingwood VIC 3066,<br />
                    Australia
                  </p>
                  <button 
                    onClick={handleLocationClick}
                    className="mt-3 text-sm text-[#0f2c59] hover:text-[#0a1f3d] flex items-center gap-2"
                  >
                    <FiMapPin className="text-[#0f2c59]" />
                    {currentLocation ? 
                      `You're ${Math.round(calculateDistance(currentLocation.lat, currentLocation.lng, -37.8136, 144.9631))} km away` : 
                      "Check distance from your location"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#0f2c59]/20">
              <h4 className="font-medium text-[#0f2c59] mb-4">Follow us on social media</h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a 
                    key={social.name}
                    href={social.url}
                    className="bg-white p-3 rounded-lg shadow-sm text-[#0f2c59] hover:bg-[#f8f0e5] transition-colors flex items-center gap-2"
                    aria-label={social.name}
                    title={social.name}
                  >
                    {social.icon}
                    <span className="text-sm hidden sm:inline">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate distance between coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default ContactPage;