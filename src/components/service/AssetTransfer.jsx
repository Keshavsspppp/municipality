import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AssetTransfer = () => {
  const [formData, setFormData] = useState({
    currentOwnerName: '',
    newOwnerName: '',
    assetType: '',
    assetIdentifier: '',
    transferReason: '',
    transferDate: new Date().toISOString().split('T')[0],
    documents: []
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [transferFee, setTransferFee] = useState(500);

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
            <h1 className="text-3xl font-bold text-gray-900">Asset Transfer Application</h1>
            <p className="mt-2 text-gray-600">Apply to transfer ownership of an asset</p>
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
                      <label htmlFor="currentOwnerName" className="block text-sm font-medium text-gray-700">
                        Current Owner Name
                      </label>
                      <input
                        type="text"
                        name="currentOwnerName"
                        id="currentOwnerName"
                        required
                        value={formData.currentOwnerName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter current owner's name"
                      />
                    </div>

                    <div>
                      <label htmlFor="newOwnerName" className="block text-sm font-medium text-gray-700">
                        New Owner Name
                      </label>
                      <input
                        type="text"
                        name="newOwnerName"
                        id="newOwnerName"
                        required
                        value={formData.newOwnerName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter new owner's name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="assetType" className="block text-sm font-medium text-gray-700">
                        Asset Type
                      </label>
                      <input
                        type="text"
                        name="assetType"
                        id="assetType"
                        required
                        value={formData.assetType}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., Property, Vehicle"
                      />
                    </div>

                    <div>
                      <label htmlFor="assetIdentifier" className="block text-sm font-medium text-gray-700">
                        Asset Identifier
                      </label>
                      <input
                        type="text"
                        name="assetIdentifier"
                        id="assetIdentifier"
                        required
                        value={formData.assetIdentifier}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., Property ID, Vehicle Registration No."
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="transferReason" className="block text-sm font-medium text-gray-700">
                      Reason for Transfer
                    </label>
                    <textarea
                      name="transferReason"
                      id="transferReason"
                      required
                      value={formData.transferReason}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Provide reason for asset transfer"
                    />
                  </div>

                  <div>
                    <label htmlFor="transferDate" className="block text-sm font-medium text-gray-700">
                      Transfer Date
                    </label>
                    <input
                      type="date"
                      name="transferDate"
                      id="transferDate"
                      required
                      value={formData.transferDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                   <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Transfer Fee Summary</h3>
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Asset Type</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formData.assetType}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Transfer Fee</dt>
                        <dd className="mt-1 text-sm text-gray-900">₹{transferFee}</dd>
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
                          Proof of ownership, ID documents, and other required documents
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
                      {loading ? 'Submitting...' : 'Submit Application'}
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
                <p className="text-gray-600 mb-6">Your asset transfer application has been submitted successfully.</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Submission Details</h3>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Application ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">AT{Math.floor(Math.random() * 1000000)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Asset Type</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.assetType}</dd>
                    </div>
                     <div>
                      <dt className="text-sm font-medium text-gray-500">New Owner</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.newOwnerName}</dd>
                    </div>
                     <div>
                      <dt className="text-sm font-medium text-gray-500">Submission Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{new Date().toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  We will review your application and process the asset transfer.
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

export default AssetTransfer; 