import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className=" mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              <span className="ml-2 text-2xl font-bold text-white tracking-tight">Furni Haven</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
              Crafting comfort and elegance for your home since 2010.
            </p>
            <div className="flex space-x-4">
              { [
                { icon: <FaFacebookF />, color: 'text-blue-500' },
                { icon: <FaInstagram />, color: 'text-pink-500' },
                { icon: <FaTwitter />, color: 'text-blue-400' },
                { icon: <FaPinterestP />, color: 'text-red-600' }
              ].map((social, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className={`rounded-full p-2 bg-gray-800 hover:bg-amber-200 hover:text-gray-900 transition-colors duration-300 shadow ${social.color}`}
                  aria-label={social.icon.type.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 sm:mb-6 pb-2 border-b border-amber-200 w-fit">
              Categories
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {['Living Room', 'Bedroom', 'Dining', 'Outdoor', 'Office', 'Storage'].map((item, index) => (
                <li key={index}>
                  <Link
                    to={`/collections/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-amber-200 transition-colors duration-200 flex items-center group text-sm sm:text-base"
                  >
                    <span className="w-1.5 h-1.5 bg-amber-200 rounded-full mr-3 transition-all duration-200 group-hover:mr-4"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 sm:mb-6 pb-2 border-b border-amber-200 w-fit">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {['About Us', 'Shop', 'Contact', 'FAQs', 'Shipping', 'Returns'].map((item, index) => (
                <li key={index}>
                  <Link
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-amber-200 transition-colors duration-200 flex items-center group text-sm sm:text-base"
                  >
                    <span className="w-1.5 h-1.5 bg-amber-200 rounded-full mr-3 transition-all duration-200 group-hover:mr-4"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 sm:mb-6 pb-2 border-b border-amber-200 w-fit">
              Contact Us
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-gray-400">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-amber-200 mt-1 mr-3 flex-shrink-0" />
                <span className="text-sm sm:text-base">123 Design Street, New York, NY</span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="text-amber-200 mr-3" />
                <span className="text-sm sm:text-base">+1 (234) 567-8901</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-amber-200 mr-3" />
                <span className="text-sm sm:text-base">support@furnihaven.com</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6 sm:mt-8">
              <h4 className="font-medium text-white mb-2 sm:mb-3 text-sm sm:text-base">Subscribe to Newsletter</h4>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-200 border border-gray-700 focus:border-amber-200 transition"
                />
                <button type="submit" className="bg-amber-200 text-gray-900 px-4 sm:px-6 py-2 rounded-lg hover:bg-amber-300 transition-colors font-medium whitespace-nowrap text-sm sm:text-base">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-gray-800 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm text-gray-400">
            <p className="mb-3 md:mb-0">© {new Date().getFullYear()} Furni Haven. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {['Privacy', 'Terms', 'Sitemap'].map((item, index) => (
                <Link
                  key={index}
                  to={`/${item.toLowerCase()}`}
                  className="hover:text-amber-200 transition-colors duration-200"
                >
                  {item} Policy
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;