import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TradeLicense = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    contactNumber: '',
    email: '',
    address: '',
    businessType: 'retail',
    businessCategory: 'general',
    numberOfEmployees: '',
    annualTurnover: '',
    startDate: new Date().toISOString().split('T')[0],
    documents: []
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [licenseFee, setLicenseFee] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate license fee based on business type and category
    if (name === 'businessType' || name === 'businessCategory') {
      const type = name === 'businessType' ? value : formData.businessType;
      const category = name === 'businessCategory' ? value : formData.businessCategory;
      
      // Example fee calculation logic
      let baseFee = 0;
      if (type === 'retail') baseFee = 5000;
      else if (type === 'wholesale') baseFee = 10000;
      else if (type === 'service') baseFee = 7500;
      else if (type === 'manufacturing') baseFee = 15000;

      if (category === 'food') baseFee *= 1.5;
      else if (category === 'hazardous') baseFee *= 2;

      setLicenseFee(baseFee);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStep(2);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Trade License Application</h1>
            <p className="mt-2 text-gray-600">Apply for a new trade license or renewal</p>
          </div>

          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                        Business Name
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        id="businessName"
                        required
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter business name"
                      />
                    </div>

                    <div>
                      <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                        Owner Name
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        id="ownerName"
                        required
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter owner name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        name="contactNumber"
                        id="contactNumber"
                        required
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter contact number"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Business Address
                    </label>
                    <textarea
                      name="address"
                      id="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter business address"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                        Business Type
                      </label>
                      <select
                        name="businessType"
                        id="businessType"
                        required
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="retail">Retail</option>
                        <option value="wholesale">Wholesale</option>
                        <option value="service">Service</option>
                        <option value="manufacturing">Manufacturing</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="businessCategory" className="block text-sm font-medium text-gray-700">
                        Business Category
                      </label>
                      <select
                        name="businessCategory"
                        id="businessCategory"
                        required
                        value={formData.businessCategory}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="general">General</option>
                        <option value="food">Food & Beverages</option>
                        <option value="hazardous">Hazardous Materials</option>
                        <option value="special">Special Category</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="numberOfEmployees" className="block text-sm font-medium text-gray-700">
                        Number of Employees
                      </label>
                      <input
                        type="number"
                        name="numberOfEmployees"
                        id="numberOfEmployees"
                        required
                        value={formData.numberOfEmployees}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter number of employees"
                      />
                    </div>

                    <div>
                      <label htmlFor="annualTurnover" className="block text-sm font-medium text-gray-700">
                        Annual Turnover (₹)
                      </label>
                      <input
                        type="number"
                        name="annualTurnover"
                        id="annualTurnover"
                        required
                        value={formData.annualTurnover}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter annual turnover"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Business Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      required
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">License Fee Summary</h3>
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">License Type</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formData.businessType}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">License Fee</dt>
                        <dd className="mt-1 text-sm text-gray-900">₹{licenseFee}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Required Documents
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload files</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              multiple
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          Business registration, tax documents, and other required documents
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        loading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? 'Processing...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Application Submitted!</h2>
                <p className="text-gray-600 mb-6">Your trade license application has been submitted successfully.</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Application Details</h3>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Application ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">TL{Math.floor(Math.random() * 1000000)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.businessName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">License Type</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.businessType}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Submission Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{new Date().toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  We will review your application and contact you within 5-7 business days.
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit Another Application
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TradeLicense; 