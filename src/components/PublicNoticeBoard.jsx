import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const notices = [
  {
    id: 1,
    title: 'Water Supply Interruption',
    date: '2024-06-10',
    content: 'Water supply will be interrupted in Sector 5 from 10am to 2pm for maintenance.'
  },
  {
    id: 2,
    title: 'Power Outage Notice',
    date: '2024-06-12',
    content: 'Scheduled power outage in Raipur city center on June 12th from 1pm to 4pm.'
  },
  {
    id: 3,
    title: 'Public Meeting',
    date: '2024-06-15',
    content: 'Join the Smart City Mission Cell public meeting at Town Hall, 5pm.'
  }
];

const PublicNoticeBoard = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % notices.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const dotVariants = {
    active: {
      scale: 1.2,
      backgroundColor: "#4F46E5" // indigo-600
    },
    inactive: {
      scale: 1,
      backgroundColor: "#D1D5DB" // gray-300
    }
  };

  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full md:w-80 bg-white shadow-lg rounded-lg p-6 mb-6 md:mb-0 md:ml-6 border border-gray-200"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold text-indigo-800 mb-5"
      >
        Public Notice Board
      </motion.h2>
      
      <div className="relative h-32 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute w-full"
          >
            <div className="pb-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-gray-600 mb-1"
              >
                {notices[current].date}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-semibold text-gray-900 mb-2"
              >
                {notices[current].title}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-800 text-sm leading-relaxed"
              >
                {notices[current].content}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {notices.map((_, idx) => (
          <motion.span
            key={idx}
            variants={dotVariants}
            animate={idx === current ? "active" : "inactive"}
            transition={{ duration: 0.2 }}
            className="inline-block w-2 h-2 rounded-full"
          />
        ))}
      </div>
    </motion.aside>
  );
};

export default PublicNoticeBoard; 