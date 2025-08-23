import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import fq from "../assets/images/fq3.png";
import fqq from "../assets/images/fq2.png";

const questions = [
  {
    question: "What materials do you use in your products?",
    answer:
      "We use high-quality, eco-friendly materials like seasoned hardwood, stainless steel, and recycled fabrics.",
  },
  {
    question: "Can I return a product if I don’t like it?",
    answer: "Yes, we offer a 30-day return policy. No questions asked!",
  },
  {
    question: "Is assembly required for furniture?",
    answer:
      "Some products require minimal assembly. Free assistance is provided where applicable.",
  },
  {
    question: "Do you ship across India?",
    answer:
      "Absolutely! We ship pan-India with estimated delivery between 2–5 working days.",
  },
];

const FAQWithSplitLayout = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-[#f8f0e5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
        
        {/* Left Section */}
        <div className="w-full lg:w-1/2 space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F2C59]">
            Have Questions? <br />
            <span className="text-[#DAC0A3]">We’ve Got Answers</span>
          </h2>
          <p className="text-gray-700 text-base md:text-lg">
            Explore our most commonly asked questions. Can’t find what you’re looking for? Contact us anytime.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <img
              src={fq}
              alt="FAQ 1"
              className="w-full h-28 sm:h-32 md:h-36 object-cover rounded-xl shadow-md"
            />
            <img
              src={fqq}
              alt="FAQ 2"
              className="w-full h-28 sm:h-32 md:h-36 object-cover rounded-xl shadow-md"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 space-y-4">
          {questions.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow transition-all overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4 text-left text-[#0F2C59] font-semibold text-base sm:text-lg hover:bg-[#dac0a3]/20 transition"
              >
                {item.question}
                {openIndex === index ? <ChevronUp /> : <ChevronDown />}
              </button>

              {openIndex === index && (
                <div className="px-4 sm:px-6 pb-4 text-gray-700 text-sm sm:text-base border-t border-gray-100">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQWithSplitLayout;
