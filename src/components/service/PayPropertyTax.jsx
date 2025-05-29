import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PayPropertyTax = () => {
  const [formData, setFormData] = useState({
    propertyId: '',
    ownerName: '',
    address: '',
    assessmentYear: new Date().getFullYear(),
    taxAmount: '',
    paymentMethod: 'online'
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
            <h1 className="text-3xl font-bold text-gray-900">Pay Property Tax</h1>
            <p className="mt-2 text-gray-600">Pay your property tax online securely</p>
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
                      <label htmlFor="propertyId" className="block text-sm font-medium text-gray-700">
                        Property ID
                      </label>
                      <input
                        type="text"
                        name="propertyId"
                        id="propertyId"
                        required
                        value={formData.propertyId}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter your property ID"
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

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Property Address
                    </label>
                    <textarea
                      name="address"
                      id="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter property address"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="assessmentYear" className="block text-sm font-medium text-gray-700">
                        Assessment Year
                      </label>
                      <input
                        type="number"
                        name="assessmentYear"
                        id="assessmentYear"
                        required
                        value={formData.assessmentYear}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="taxAmount" className="block text-sm font-medium text-gray-700">
                        Tax Amount (₹)
                      </label>
                      <input
                        type="number"
                        name="taxAmount"
                        id="taxAmount"
                        required
                        value={formData.taxAmount}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter tax amount"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                      Payment Method
                    </label>
                    <select
                      name="paymentMethod"
                      id="paymentMethod"
                      required
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="online">Online Payment</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="netbanking">Net Banking</option>
                      <option value="upi">UPI</option>
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        loading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? 'Processing...' : 'Proceed to Payment'}
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
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-6">Your property tax payment has been processed successfully.</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Details</h3>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Property ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.propertyId}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Amount Paid</dt>
                      <dd className="mt-1 text-sm text-gray-900">₹{formData.taxAmount}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.paymentMethod}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Transaction Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{new Date().toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Make Another Payment
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PayPropertyTax; 