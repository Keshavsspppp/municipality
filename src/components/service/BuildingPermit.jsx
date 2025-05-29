import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BuildingPermit = () => {
  const [formData, setFormData] = useState({
    applicantName: '',
    contactNumber: '',
    email: '',
    address: '',
    buildingType: 'residential',
    constructionType: 'new',
    totalArea: '',
    numberOfFloors: '',
    estimatedCost: '',
    purpose: '',
    documents: []
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
            <h1 className="text-3xl font-bold text-gray-900">Building Permit Application</h1>
            <p className="mt-2 text-gray-600">Apply for a building construction permit</p>
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
                      <label htmlFor="applicantName" className="block text-sm font-medium text-gray-700">
                        Applicant Name
                      </label>
                      <input
                        type="text"
                        name="applicantName"
                        id="applicantName"
                        required
                        value={formData.applicantName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter applicant name"
                      />
                    </div>

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

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Construction Site Address
                    </label>
                    <textarea
                      name="address"
                      id="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter construction site address"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="buildingType" className="block text-sm font-medium text-gray-700">
                        Building Type
                      </label>
                      <select
                        name="buildingType"
                        id="buildingType"
                        required
                        value={formData.buildingType}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="industrial">Industrial</option>
                        <option value="mixed">Mixed Use</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="constructionType" className="block text-sm font-medium text-gray-700">
                        Construction Type
                      </label>
                      <select
                        name="constructionType"
                        id="constructionType"
                        required
                        value={formData.constructionType}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="new">New Construction</option>
                        <option value="renovation">Renovation</option>
                        <option value="extension">Extension</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="totalArea" className="block text-sm font-medium text-gray-700">
                        Total Area (sq. ft.)
                      </label>
                      <input
                        type="number"
                        name="totalArea"
                        id="totalArea"
                        required
                        value={formData.totalArea}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter total area"
                      />
                    </div>

                    <div>
                      <label htmlFor="numberOfFloors" className="block text-sm font-medium text-gray-700">
                        Number of Floors
                      </label>
                      <input
                        type="number"
                        name="numberOfFloors"
                        id="numberOfFloors"
                        required
                        value={formData.numberOfFloors}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter number of floors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="estimatedCost" className="block text-sm font-medium text-gray-700">
                        Estimated Cost (₹)
                      </label>
                      <input
                        type="number"
                        name="estimatedCost"
                        id="estimatedCost"
                        required
                        value={formData.estimatedCost}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter estimated cost"
                      />
                    </div>

                    <div>
                      <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                        Purpose of Construction
                      </label>
                      <input
                        type="text"
                        name="purpose"
                        id="purpose"
                        required
                        value={formData.purpose}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter purpose"
                      />
                    </div>
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
                          Site plan, building plans, ownership documents, and other required documents
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
                <p className="text-gray-600 mb-6">Your building permit application has been submitted successfully.</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Application Details</h3>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Application ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">BP{Math.floor(Math.random() * 1000000)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Applicant Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.applicantName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Building Type</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.buildingType}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Submission Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{new Date().toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  We will review your application and contact you within 7-10 business days.
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

export default BuildingPermit; 