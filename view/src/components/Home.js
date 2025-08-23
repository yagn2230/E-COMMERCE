import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BsTruck, BsShieldCheck, BsStars, BsArrowRight, BsArrowUpRight } from 'react-icons/bs';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaLeaf, FaHandsHelping } from 'react-icons/fa';
import FeaturedProducts from './FeaturedProducts';
import bed from '../assets/images/BedroomCollection.jpg'
import any from '../assets/images/Luxury Living Room.png'
import FAQWithSplitLayout from './FAQWithSplitLayout';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API}/banners`);
        const data = await res.json();
        setBanners(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching banners:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-rotate hero banners every 5 seconds
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const nextHero = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % banners.length);
    setTimeout(() => {
      document.querySelector('.hero-content').classList.remove('animate-fadeOut');
      document.querySelector('.hero-content').classList.add('animate-fadeIn');
    }, 100);
  };

  const prevHero = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + banners.length) % banners.length);
    setTimeout(() => {
      document.querySelector('.hero-content').classList.remove('animate-fadeOut');
      document.querySelector('.hero-content').classList.add('animate-fadeIn');
    }, 100);
  };

  const hero = banners[currentHeroIndex] || {};
  const featured = banners.filter((_, index) => index !== currentHeroIndex);

  return (
    <div className="bg-white text-gray-800 w-full overflow-hidden">
      {/* Hero Carousel Section */}
      <section className="relative w-full h-[60vh] min-h-[400px] max-h-[900px] overflow-hidden sm:h-[70vh] md:h-[80vh] lg:h-screen">
  {/* Background Image with Gradient Overlay */}
  <div
    className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform scale-100 hover:scale-105"
    style={{
      backgroundImage: `linear-gradient(to right, rgba(15, 44, 89, 0.85), rgba(15, 44, 89, 0.3)), url(${hero?.imageUrl || "/placeholder-hero.jpg"})`,
    }}
  ></div>

  {/* Floating decorative elements */}
  <div className="absolute top-20 left-20 w-16 h-16 rounded-full bg-[#dac0a3]/20 animate-float1 hidden lg:block"></div>
  <div className="absolute bottom-1/4 right-32 w-24 h-24 rounded-full bg-[#0F2C59]/10 animate-float2 hidden lg:block"></div>
  <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-[#dac0a3]/30 animate-float3 hidden lg:block"></div>

  {/* Hero Content */}
  <div className="relative z-20 h-full flex items-center">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="max-w-2xl hero-content transition-all duration-500">
        {/* Tagline */}
        <div className="mb-6">
          <span className="inline-flex items-center bg-[#dac0a3] text-[#0F2C59] px-4 py-2 rounded-full text-sm font-semibold animate-fadeIn shadow-md">
            <FaLeaf className="mr-2" />
            New Sustainable Collection 2024
          </span>
        </div>

        {/* Main Heading */}
        <div className="relative mb-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight animate-fadeIn">
            {hero?.title || "Elevate Your Living Space"}
            <span className="absolute -bottom-4 left-0 w-24 h-1.5 bg-[#dac0a3] animate-grow origin-left"></span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-xl relative group animate-fadeIn delay-100">
          {hero?.subtitle || "Premium furniture crafted for comfort and style"}
          <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#dac0a3] group-hover:w-full transition-all duration-700 ease-in-out"></span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn delay-200">
          <Link
            to={hero?.link || "/shop"}
            className="inline-flex items-center justify-center bg-[#dac0a3] hover:bg-[#c3a883] text-[#0F2C59] font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group"
          >
            Shop Now
            <BsArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/collections"
            className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white hover:bg-white/20 font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 group"
          >
            Explore Collections
            <BsArrowUpRight className="ml-2 group-hover:translate-x-1 group-hover:translate-y-[-2px] transition-transform" />
          </Link>
        </div>

        {/* Stats (Optional) */}
        <div className="mt-16 flex flex-wrap gap-8 text-white animate-fadeIn delay-300">
          {[
            { value: "10+", label: "Years Experience" },
            { value: "5K+", label: "Happy Customers" },
            { value: "100%", label: "Quality Guarantee" },
            { value: "Eco", label: "Sustainable Materials" },
          ].map((stat, index) => (
            <div key={index} className="flex items-center group">
              <div className="text-3xl font-bold mr-3 transition-all group-hover:text-[#dac0a3]">{stat.value}</div>
              <div className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Sustainable Living Section */}
      <section className="w-full py-24 px-2 sm:px-4 md:px-6 bg-[#f8f0e5] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-repeat" style={{ backgroundImage: `url(${bed})` }}></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96 w-full">
                <img
                  src={any}
                  alt="Sustainable Living"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C59]/70 via-transparent to-transparent flex items-end p-8">
                  <span className="inline-flex items-center bg-white text-[#0F2C59] px-4 py-2 rounded-full text-sm font-semibold">
                    <FaLeaf className="mr-2 text-green-600" />
                    Eco-Friendly Materials
                  </span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#0F2C59]">
                Sustainable Living <span className="text-[#dac0a3]">Starts at Home</span>
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Our commitment to sustainability means every piece is crafted with eco-friendly materials and ethical practices.
                We partner with local artisans to reduce our carbon footprint while delivering exceptional quality.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {[
                  { icon: <FaLeaf className="text-2xl text-green-600" />, text: "100% Recyclable Packaging" },
                  { icon: <FaHandsHelping className="text-2xl text-[#0F2C59]" />, text: "Fair Trade Certified" },
                  { icon: <BsStars className="text-2xl text-[#dac0a3]" />, text: "Handcrafted Quality" },
                  { icon: <BsShieldCheck className="text-2xl text-blue-600" />, text: "10-Year Craftsmanship Warranty" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1">{item.icon}</div>
                    <p className="text-gray-700">{item.text}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/sustainability"
                className="inline-flex items-center text-[#0F2C59] font-semibold hover:underline group"
              >
                Learn more about our sustainability efforts
                <BsArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="w-full py-24 px-2 sm:px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0F2C59]">
              Curated Collections
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover handpicked selections for every room in your home
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[#f8f0e5] rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-80 bg-gray-200 w-full"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.slice(0, 6).map((item, index) => (
                <Link
                  to={item.link || '/shop'}
                  key={item._id || index}
                  className="group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-500 bg-white relative"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={item.imageUrl || '/placeholder-furniture.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = '/placeholder-furniture.jpg';
                        e.target.onerror = null;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                      <p className="text-white text-lg font-medium">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="p-6 border-t-4 border-transparent group-hover:border-[#DAC0A3] transition-colors duration-500">
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#0F2C59] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                    <span className="inline-block mt-4 text-[#0F2C59] font-medium group-hover:underline transition-all">
                      View Collection
                      <BsArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#f8f0e5] rounded-xl shadow-sm">
              <p className="text-gray-500">No featured collections available</p>
              <Link
                to="/shop"
                className="inline-block mt-4 text-[#0F2C59] hover:underline font-medium"
              >
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Value Propositions */}
      <section className="w-full py-24 px-2 sm:px-4 md:px-6 bg-[#f8f0e5]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BsTruck className="text-3xl" />,
                title: "Free Shipping",
                description: "On all orders over ₹5,000",
                details: "Fast 2-3 business day delivery",
                color: "bg-blue-100 text-blue-800"
              },
              {
                icon: <BsShieldCheck className="text-3xl" />,
                title: "Hassle-Free Returns",
                description: "30-day return policy",
                details: "No questions asked",
                color: "bg-green-100 text-green-800"
              },
              {
                icon: <BsStars className="text-3xl" />,
                title: "Premium Quality",
                description: "Handcrafted with care",
                details: "5-year warranty included",
                color: "bg-amber-100 text-amber-800"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl text-center transition-all hover:shadow-lg hover:-translate-y-2 border border-[#eadbc8] group"
              >
                <div className={`${item.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all group-hover:scale-110`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#0F2C59] mb-3">{item.title}</h3>
                <p className="text-lg text-gray-700 mb-2">{item.description}</p>
                <p className="text-sm text-gray-500">{item.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="w-full py-28 px-2 sm:px-4 md:px-6 text-center my-9 p-9 text-white relative overflow-hidden bg-cover bg-center image"
      >
        {/* Optional dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-md">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-sm">
            Our design experts can help you create the perfect home aesthetic.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/shop"
              className="px-10 py-4 bg-[#dac0a3] hover:bg-[#c3a883] rounded-lg text-[#0F2C59] font-medium transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-md group"
            >
              Shop All Furniture
              <BsArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="px-10 py-4 rounded-lg font-medium border-2 border-white text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
            >
              Book Design Consultation
            </Link>
          </div>
        </div>
      </section>

      <>
        <FAQWithSplitLayout />
      </>
    </div>
  );
};

export default Home;