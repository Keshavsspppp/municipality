import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        {/* You can replace this spinner with a logo or a more custom animation if desired */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
        <p className="text-gray-700 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Loader; 