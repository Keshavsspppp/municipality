import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import PublicNoticeBoard from '../components/PublicNoticeBoard';
import Footer from '../components/Footer';

export default function Home() {
  const heroRef = useRef(null);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex min-h-[80vh] items-center bg-[url('/hero.jpg')] bg-cover bg-center"
        style={{
          // Adjusted background style for clarity and consistency
          background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/hero.jpg') no-repeat center/cover`,
        }}
      >
        {/* Hero Content Container - centered and padded */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between z-10">
          {/* Left Side: Text and Input */}
          <motion.div
            className="lg:w-1/2 space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold font-poppins text-white leading-tight">
              MUN Smart City Mission
            </h1>
            <p className="text-lg text-gray-200 max-w-md lg:max-w-none mx-auto lg:mx-0">
              Empowering citizens with digital services, transparent governance, and a smarter, greener Raipur.
            </p>
            {/* Removed bullet points from hero for cleaner look */}
            
            <div className="flex justify-center lg:justify-start space-x-4">
              <motion.a
                href="/online-services"
                className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 font-medium text-lg transition transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Online Services
              </motion.a>
            </div>
            {/* ChatGPT-like Input Box - added full width to container */}
            <div className="relative max-w-lg w-full mx-auto lg:mx-0 mt-6">
              <input
                type="text"
                placeholder="Ask about Raipur Smart City services..."
                className="w-full p-4 pr-12 rounded-full bg-white/90 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2">
                <svg
                  className="w-6 h-6 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
          {/* Right Side: Image/Illustration - can add an illustration here if needed */}
          <div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center items-center">
             {/* Placeholder for an image or illustration */}
             {/* <img src="/illustration.png" alt="Illustration" className="max-w-full h-auto" /> */}
          </div>

        </div>
      </section>

      {/* Latest News Ticker */}
      <div className="w-full bg-blue-700 text-white py-2 overflow-hidden">
        {/* The scrolling animation CSS needs to be defined separately (e.g., in your CSS file or tailwind.config.js) */}
        <div className="whitespace-nowrap animate-marquee">
          <span className="mx-4">🎉 Raipur Smart City achieves top ranking in Swachh Survekshan! |</span>
          <span className="mx-4">🚧 Major road development project underway in Sector 27 |</span>
          <span className="mx-4">💧 New water connection drive launched, apply online now! |</span>
          <span className="mx-4">💡 Public feedback portal updated with new features |</span>
          {/* Repeat content as needed for seamless loop */}
          <span className="mx-4">🎉 Raipur Smart City achieves top ranking in Swachh Survekshan! |</span>
          <span className="mx-4">🚧 Major road development project underway in Sector 27 |</span>
          <span className="mx-4">💧 New water connection drive launched, apply online now! |</span>
          <span className="mx-4">💡 Public feedback portal updated with new features |</span>
        </div>
      </div>

      {/* Main Content Section (Full Width, no internal padding) */}
      <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between py-8">
        {/* Public Notice Board - Removed internal padding */}
        <div className="w-full md:w-1/2 lg:w-2/5 mb-8 md:mb-0">
           <PublicNoticeBoard />
        </div>

        {/* Removed Key Features Section */}
        {/* <section className="w-full md:w-1/2 lg:w-3/5 md:ml-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">Online Service Access</h3>
              <p className="text-gray-700">Easily apply for various municipal services online, saving time and effort.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">Real-time Updates</h3>
              <p className="text-gray-700">Stay informed about public notices, announcements, and project progress.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">Complaint Submission</h3>
              <p className="text-gray-700">Submit and track complaints related to civic issues with ease.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">Department Interaction</h3>
              <p className="text-gray-700">Communicate directly with relevant departments for queries and feedback.</p>
            </div>
          </div>
        </section> */}

        {/* Add the Useful Links section here */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Useful Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example Link Items */}
            <a href="#" className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <h3 className="text-lg font-semibold text-blue-600">Official Website</h3>
              <p className="mt-2 text-gray-600">Visit the official Municipal Corporation website.</p>
            </a>

            <a href="#" className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <h3 className="text-lg font-semibold text-blue-600">Citizen Charter</h3>
              <p className="mt-2 text-gray-600">Understand citizen rights and services.</p>
            </a>

            <a href="#" className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <h3 className="text-lg font-semibold text-blue-600">Emergency Services</h3>
              <p className="mt-2 text-gray-600">Find contact information for emergency services.</p>
            </a>

            <a href="#" className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <h3 className="text-lg font-semibold text-blue-600">FAQs</h3>
              <p className="mt-2 text-gray-600">Frequently Asked Questions about municipal services.</p>
            </a>

            <a href="#" className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <h3 className="text-lg font-semibold text-blue-600">Contact Us</h3>
              <p className="mt-2 text-gray-600">Get in touch with the Municipal Corporation.</p>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
