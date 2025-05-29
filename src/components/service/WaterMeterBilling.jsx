import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WaterMeterBilling = () => {
  const [formData, setFormData] = useState({
    meterNumber: '',
    consumerName: '',
    address: '',
    previousReading: '',
    currentReading: '',
    readingDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'online'
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [consumption, setConsumption] = useState(0);
  const [billAmount, setBillAmount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate consumption and bill amount when readings change
    if (name === 'currentReading' || name === 'previousReading') {
      const current = name === 'currentReading' ? value : formData.currentReading;
      const previous = name === 'previousReading' ? value : formData.previousReading;
      
      if (current && previous) {
        const consumptionValue = Math.max(0, current - previous);
        setConsumption(consumptionValue);
        // Calculate bill amount (example rate: ₹10 per unit)
        setBillAmount(consumptionValue * 10);
      }
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Water Meter Billing</h1>
            <p className="mt-2 text-gray-600">Pay your water bill online</p>
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
                      <label htmlFor="meterNumber" className="block text-sm font-medium text-gray-700">
                        Meter Number
                      </label>
                      <input
                        type="text"
                        name="meterNumber"
                        id="meterNumber"
                        required
                        value={formData.meterNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter meter number"
                      />
                    </div>

                    <div>
                      <label htmlFor="consumerName" className="block text-sm font-medium text-gray-700">
                        Consumer Name
                      </label>
                      <input
                        type="text"
                        name="consumerName"
                        id="consumerName"
                        required
                        value={formData.consumerName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter consumer name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Service Address
                    </label>
                    <textarea
                      name="address"
                      id="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter service address"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="previousReading" className="block text-sm font-medium text-gray-700">
                        Previous Reading
                      </label>
                      <input
                        type="number"
                        name="previousReading"
                        id="previousReading"
                        required
                        value={formData.previousReading}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter previous reading"
                      />
                    </div>

                    <div>
                      <label htmlFor="currentReading" className="block text-sm font-medium text-gray-700">
                        Current Reading
                      </label>
                      <input
                        type="number"
                        name="currentReading"
                        id="currentReading"
                        required
                        value={formData.currentReading}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter current reading"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="readingDate" className="block text-sm font-medium text-gray-700">
                      Reading Date
                    </label>
                    <input
                      type="date"
                      name="readingDate"
                      id="readingDate"
                      required
                      value={formData.readingDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Bill Summary</h3>
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Water Consumption</dt>
                        <dd className="mt-1 text-sm text-gray-900">{consumption} units</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Bill Amount</dt>
                        <dd className="mt-1 text-sm text-gray-900">₹{billAmount}</dd>
                      </div>
                    </dl>
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
                <p className="text-gray-600 mb-6">Your water bill payment has been processed successfully.</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Details</h3>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Meter Number</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.meterNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Amount Paid</dt>
                      <dd className="mt-1 text-sm text-gray-900">₹{billAmount}</dd>
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

export default WaterMeterBilling; 