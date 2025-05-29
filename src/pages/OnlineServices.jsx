import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  HomeIcon, 
  WrenchScrewdriverIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  BuildingOfficeIcon,
  TruckIcon,
  CloudIcon,
  HeartIcon,
  BeakerIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const onlineServices = [
  { name: 'Pay Property Tax', icon: HomeIcon, color: 'bg-blue-500' },
  { name: 'New Water Connection', icon: BoltIcon, color: 'bg-cyan-500' },
  { name: 'File Tracking System', icon: DocumentTextIcon, color: 'bg-purple-500' },
  { name: 'Asset Transfer', icon: ArrowPathIcon, color: 'bg-green-500' },
  { name: 'E-Tendering / Procurement', icon: DocumentDuplicateIcon, color: 'bg-orange-500' },
  { name: 'Attendance', icon: ClockIcon, color: 'bg-red-500' },
  { name: 'RTI', icon: DocumentMagnifyingGlassIcon, color: 'bg-yellow-500' },
  { name: 'Citizen Facilities', icon: BuildingOfficeIcon, color: 'bg-pink-500' },
  { name: 'D2D Vehicle Tracking', icon: TruckIcon, color: 'bg-indigo-500' },
  { name: 'Air Quality Index', icon: CloudIcon, color: 'bg-sky-500' },
  { name: 'Health Department', icon: HeartIcon, color: 'bg-rose-500' },
  { name: 'Water Meter Billing', icon: WrenchScrewdriverIcon, color: 'bg-teal-500' },
  { name: 'Water Quality Index', icon: BeakerIcon, color: 'bg-emerald-500' },
];

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-');
};

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

const OnlineServices = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Online Services
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Access all municipal services from the comfort of your home
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {onlineServices.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-full"
            >
              <Link
                to={`/online-services/${slugify(service.name)}`}
                className="block h-full"
              >
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 h-full flex flex-col">
                  <div className="p-6 flex-grow">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${service.color} bg-opacity-10 flex-shrink-0`}>
                        <service.icon className={`h-6 w-6 ${service.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {service.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 truncate">
                          Click to access service
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-indigo-600">
                        Access Service
                      </span>
                      <svg
                        className="h-5 w-5 text-indigo-600 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default OnlineServices; 