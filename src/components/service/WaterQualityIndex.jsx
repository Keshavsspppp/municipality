import React, { useState } from 'react';
import { motion } from 'framer-motion';

const WaterQualityIndex = () => {
  const [formData, setFormData] = useState({
    location: '',
    date: new Date().toISOString().split('T')[0],
    parameter: '',
    value: '',
    unit: '',
    notes: ''
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
            <h1 className="text-3xl font-bold text-gray-900">Water Quality Index Submission</h1>
            <p className="mt-2 text-gray-600">Submit data for water quality monitoring</p>
          </div>

          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Monitoring Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      required
                      value={formData.location}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter location"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date of Reading
                      </label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="parameter" className="block text-sm font-medium text-gray-700">
                        Parameter
                      </label>
                      <input
                        type="text"
                        name="parameter"
                        id="parameter"
                        required
                        value={formData.parameter}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., pH, Turbidity"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                        Value
                      </label>
                      <input
                        type="number"
                        name="value"
                        id="value"
                        required
                        value={formData.value}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Enter measured value"
                        step="any"
                      />
                    </div>
                    <div>
                      <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                        Unit
                      </label>
                      <input
                        type="text"
                        name="unit"
                        id="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., pH units, NTU"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      id="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Add any relevant notes (optional)"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        loading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? 'Submitting...' : 'Submit Data'}
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
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Data Submitted!</h2>
                <p className="text-gray-600 mb-6">Water quality data has been submitted successfully.</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Submission Details</h3>
                  <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Location</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.location}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.date}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Parameter</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.parameter}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Value</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.value} {formData.unit}</dd>
                    </div>
                  </dl>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  You can submit more water quality data or close this page.
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit More Data
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WaterQualityIndex; 