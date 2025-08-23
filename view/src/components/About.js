import React from "react";
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook } from "react-icons/fi";
import { FaPinterest, FaWhatsapp } from "react-icons/fa";

const About = () => {
  // Values data
  const values = [
    {
      title: "Designed with Intention",
      description: "Every line, proportion, and texture is chosen with care — nothing is random, everything has a reason.",
      icon: "✏️"
    },
    {
      title: "Elegance in Simplicity",
      description: "We embrace the quiet power of restraint. Through minimal gestures, we reveal lasting beauty.",
      icon: "✨"
    },
    {
      title: "Rooted in Craft",
      description: "Tradition grounds us. Each piece reflects the precision and soul of Italian artisanal heritage.",
      icon: "🪚"
    }
  ];

  // Team data
  const teamMembers = [
    {
      name: "Elena Rossi",
      role: "Creative Director",
      bio: "20 years shaping spaces with emotional resonance",
      specialty: "Material selection",
      img: require("../assets/images/team1.jpg")
    },
    {
      name: "Nicola Ferretti",
      role: "Lead Designer",
      bio: "Blending modern aesthetics with traditional techniques",
      specialty: "Structural design",
      img: require("../assets/images/team2.jpg")
    },
    {
      name: "Lucia Andreotti",
      role: "Visual & Styling",
      bio: "Creating harmonious living environments",
      specialty: "Color theory",
      img: require("../assets/images/team3.jpg")
    },
    {
      name: "Aruna Santoro",
      role: "Spatial Designer",
      bio: "Transforming spaces through intentional placement",
      specialty: "Ergonomics",
      img: require("../assets/images/team4.jpg")
    }
  ];

  // Material showcase
  const materials = [
    { name: "Solid Walnut", feature: "Rich grain patterns", sustainability: "FSC Certified" },
    { name: "Italian Leather", feature: "Aged beautifully over time", sustainability: "Vegetable-tanned" },
    { name: "Brass Accents", feature: "Develops natural patina", sustainability: "Recycled content" },
    { name: "Linen Upholstery", feature: "Breathable and durable", sustainability: "Organic" }
  ];

  return (
    <div className="font-sans text-[#0f2c59] antialiased bg-[#f8f0e5]">
      {/* Hero Section */}
      <section className="py-24 px-8 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-normal mb-6 tracking-tight">
          Quiet Forms —<br />
          <span className="text-[#dac0a3] font-light">Loud in Meaning</span>
        </h1>
        <p className="text-lg text-[#0f2c59]/80 leading-relaxed max-w-2xl mx-auto mb-8">
          Our furniture doesn't speak loudly. It whispers elegance,
          balance, and precision — crafted to last, designed to feel.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-[#0f2c59] text-white px-6 py-3 rounded-lg hover:bg-[#0a1f3d] transition font-medium">
            View Collections
          </button>
          <button className="border border-[#0f2c59] text-[#0f2c59] px-6 py-3 rounded-lg hover:bg-[#0f2c59]/10 transition font-medium">
            Book Consultation
          </button>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-[#0f2c59]">Our Mission</h2>
            <p className="text-[#0f2c59]/80 leading-relaxed mb-6">
              Our mission is to create furniture that merges Italian craftsmanship with
              contemporary sensibility — pieces defined by clarity, comfort, and care.
            </p>
            <p className="text-[#0f2c59]/80 leading-relaxed">
              Our story begins in stillness — a quiet space where design takes shape slowly,
              and nothing is rushed. We work with care, guided by material, proportion,
              and feeling.
            </p>
          </div>
          <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-lg">
            <img
              src={require("../assets/images/Luxury Living Room.png")}
              alt="Showroom"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-[#0f2c59]/80 text-white p-4">
              <p className="text-sm font-medium">Handcrafted in Tuscany since 1987</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-8 bg-[#f8f0e5]">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-semibold mb-4 text-[#0f2c59]">OUR VALUES</h2>
          <p className="text-[#0f2c59]/80 font-medium">
            More than design, we craft with values that quietly shape timeless, meaningful living.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
              <span className="text-3xl mb-4 block">{value.icon}</span>
              <h3 className="text-xl font-semibold mb-4 text-[#0f2c59]">{value.title}</h3>
              <p className="text-[#0f2c59]/80 font-normal">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Materials Showcase */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-12 text-center text-[#0f2c59]">Material Integrity</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {materials.map((material, index) => (
              <div key={index} className="border border-[#eadbc8] rounded-lg p-6 hover:bg-[#f8f0e5] transition-colors">
                <h3 className="text-lg font-semibold text-[#0f2c59] mb-2">{material.name}</h3>
                <p className="text-sm text-[#0f2c59]/80 font-normal mb-3">{material.feature}</p>
                <div className="text-xs font-medium text-[#0f2c59]/60 bg-[#f8f0e5] px-2 py-1 rounded-full inline-block">
                  {material.sustainability}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Belonging Section */}
      <section className="py-20 px-8 bg-[#eadbc8]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-lg order-2 md:order-1">
            <img
              src={require("../assets/images/collection.webp")}
              alt="Showroom"
              className="absolute w-full h-full object-cover"
            />
            <div className="absolute  flex items-center justify-center"></div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-2xl font-semibold mb-6 text-[#0f2c59]">Made to Belong</h2>
            <p className="text-[#0f2c59]/80 leading-relaxed mb-6 font-normal">
              We create furniture meant to live with you — to evolve and adapt with time.
            </p>
            <p className="text-[#0f2c59]/80 leading-relaxed mb-8 font-normal">
              We believe that furniture is more than a physical object — it's a reflection
              of intention, heritage, and the way we choose to live.
            </p>
            <button className="border border-[#0f2c59] text-[#0f2c59] px-6 py-3 rounded-lg hover:bg-[#0f2c59]/10 transition font-medium">
              Visit Our Showroom
            </button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-8 bg-[#f8f0e5]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-16 text-center text-[#0f2c59]">Studio Thinking — Artisan Execution</h2>

          <div className="grid md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={member.img}
                  alt={member.name}
                  className="bg-[#eadbc8] h-48 w-full object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#0f2c59]">{member.name}</h3>
                  <p className="text-sm text-[#0f2c59]/80 mb-3 font-medium">{member.role}</p>
                  <p className="text-xs text-[#0f2c59]/60 mb-2 font-normal">{member.bio}</p>
                  <div className="text-xs font-medium text-[#0f2c59] bg-[#f8f0e5] px-2 py-1 rounded-full inline-block">
                    {member.specialty}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-12 text-center text-[#0f2c59]">Our Craft Process</h2>

          <div className="space-y-8">
            {[
              { step: "1", title: "Design Concept", description: "Initial sketches and material selection", duration: "2-4 weeks" },
              { step: "2", title: "Prototyping", description: "Creating small-scale models for testing", duration: "3-5 weeks" },
              { step: "3", title: "Artisan Production", description: "Handcrafted by master furniture makers", duration: "6-12 weeks" },
              { step: "4", title: "Quality Assurance", description: "Rigorous testing and finishing touches", duration: "1-2 weeks" }
            ].map((item, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#0f2c59] text-white flex items-center justify-center font-medium">
                    {item.step}
                  </div>
                  {index < 3 && (
                    <div className="w-0.5 h-full bg-[#dac0a3] my-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-semibold text-[#0f2c59] mb-2">{item.title}</h3>
                  <p className="text-[#0f2c59]/80 mb-2 font-normal">{item.description}</p>
                  <p className="text-sm text-[#0f2c59]/60 font-medium">Duration: {item.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-8 bg-[#0f2c59] text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-semibold mb-6">Get In Touch</h2>
            <p className="mb-8 opacity-90 font-normal">
              For press, projects, and partnerships — we welcome inquiries that reflect
              the same respect for form, detail, and material integrity.
            </p>

            <div className="space-y-4 font-medium">
              <div className="flex items-center gap-4">
                <FiMail className="text-xl opacity-80" />
                <span>furnihevan@gmail.com</span>
              </div>
              <div className="flex items-center gap-4">
                <FiPhone className="text-xl opacity-80" />
                <span>+39 0439 89999</span>
              </div>
              <div className="flex items-center gap-4">
                <FiMapPin className="text-xl opacity-80" />
                <span>Via del Design 42, Florence, Italy</span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Follow Our Journey</h3>
              <div className="flex gap-4">
                {[
                  { icon: <FiInstagram />, name: "Instagram" },
                  { icon: <FiFacebook />, name: "Facebook" },
                  { icon: <FiTwitter />, name: "Twitter" },
                  { icon: <FaPinterest />, name: "Pinterest" },
                  { icon: <FaWhatsapp />, name: "WhatsApp" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/10 p-8 rounded-xl">
            <h3 className="text-xl font-semibold mb-6">Book a Design Consultation</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-white font-normal"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-white font-normal"
              />
              <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-white font-normal">
                <option value="">Select Service</option>
                <option value="consultation">Design Consultation</option>
                <option value="custom">Custom Furniture</option>
                <option value="wholesale">Wholesale Inquiry</option>
                <option value="other">Other</option>
              </select>
              <textarea
                rows="4"
                placeholder="Tell us about your project"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-white font-normal"
              ></textarea>
              <button
                type="submit"
                className="bg-white text-[#0f2c59] px-6 py-3 rounded-lg hover:bg-white/90 transition font-medium"
              >
                Request Consultation
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;