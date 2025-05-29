import React from 'react';
import { motion } from 'framer-motion';
import { 
  BuildingOfficeIcon, 
  AcademicCapIcon, 
  HeartIcon, 
  TruckIcon,
  HomeIcon,
  MapIcon
} from '@heroicons/react/24/outline';

const AboutRaipur = () => {
  const features = [
    {
      icon: BuildingOfficeIcon,
      title: 'Municipal Governance',
      description: 'Providing essential civic services and infrastructure development for the city.'
    },
    {
      icon: AcademicCapIcon,
      title: 'Educational Institutes',
      description: 'Establishing and maintaining schools and educational facilities.'
    },
    {
      icon: HeartIcon,
      title: 'Healthcare Centers',
      description: 'Building and managing health centers for citizen welfare.'
    },
    {
      icon: TruckIcon,
      title: 'Industrial Hub',
      description: 'Supporting mining industries and agricultural development.'
    },
    {
      icon: HomeIcon,
      title: 'Housing Maintenance',
      description: 'Regular maintenance and development of residential areas.'
    },
    {
      icon: MapIcon,
      title: 'Infrastructure',
      description: 'Developing roads, flyovers, and civic amenities.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            About Raipur Municipal Corporation
          </h1>
          <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12"
        >
          <div className="relative h-64 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-3xl font-bold text-white">Welcome to Raipur</h2>
            </div>
          </div>
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6 leading-relaxed">
                The Chhattisgarh state government established Raipur Nagar Nigam, serving as the backbone of urban development in the region. Mining industries and agriculture form the economic foundation of our vibrant city. Raipur is renowned for its extensive availability of different types of coal and minerals, making it a prime location for industrial growth.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Our city's strategic advantage lies in its cost-effective labor market, making it an ideal destination for establishing and expanding industries. The Raipur Municipal Corporation is committed to providing comprehensive community services to support this large-scale advancement.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Beyond basic infrastructure, we are actively developing recreational centers, including museums, community halls, and parks, to enhance the quality of life for our citizens. Our commitment extends to constructing and maintaining health centers, educational institutes, schools, and residential areas, ensuring a sustainable and prosperous future for Raipur.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-indigo-100">
                    <feature.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="ml-4 text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="px-8 py-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Us in Building a Better Raipur
            </h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Together, we can create a sustainable and prosperous future for our city. The Raipur Municipal Corporation is committed to serving you better every day.
            </p>
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors duration-300">
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutRaipur; 