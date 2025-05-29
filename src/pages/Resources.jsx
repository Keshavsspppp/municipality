import { useState } from 'react';

// Mock data - replace with actual API call
const mockResources = [
  {
    id: 1,
    name: 'Conference Room A',
    type: 'Physical',
    status: 'Available',
    department: 'All',
    capacity: 20,
    location: 'Floor 1',
    schedule: '9:00 AM - 6:00 PM'
  },
  {
    id: 2,
    name: 'Development Server',
    type: 'Technical',
    status: 'In Use',
    department: 'Engineering',
    specs: '16 CPU, 64GB RAM',
    location: 'Data Center',
    schedule: '24/7'
  },
  {
    id: 3,
    name: 'Video Equipment',
    type: 'Physical',
    status: 'Available',
    department: 'Marketing',
    items: 'Cameras, Microphones, Lighting',
    location: 'Media Room',
    schedule: 'On Request'
  }
];

export default function Resources() {
  const [resources, setResources] = useState(mockResources);
  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResourceData, setNewResourceData] = useState({
    name: '',
    type: '',
    status: 'Available',
    department: '',
    capacity: '',
    specs: '',
    location: '',
    schedule: '',
    items: ''
  });

  const filteredResources = resources.filter(resource => {
    if (filter === 'all') return true;
    return resource.type.toLowerCase() === filter.toLowerCase();
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewResourceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    const resourceToAdd = {
      id: Date.now(),
      ...newResourceData
    };
    setResources(prevResources => [...prevResources, resourceToAdd]);
    setNewResourceData({
      name: '',
      type: '',
      status: 'Available',
      department: '',
      capacity: '',
      specs: '',
      location: '',
      schedule: '',
      items: ''
    });
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Resources</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and track shared technical and physical resources across departments.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Resource
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mt-8 p-6 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Resource</h2>
          <form onSubmit={handleAddResource} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" id="name" value={newResourceData.name} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
              <select name="type" id="type" value={newResourceData.type} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="">Select Type</option>
                <option value="Physical">Physical</option>
                <option value="Technical">Technical</option>
              </select>
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
              <input type="text" name="department" id="department" value={newResourceData.department} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" name="location" id="location" value={newResourceData.location} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">Schedule</label>
              <input type="text" name="schedule" id="schedule" value={newResourceData.schedule} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            {newResourceData.type === 'Physical' && (
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
                <input type="number" name="capacity" id="capacity" value={newResourceData.capacity} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
            )}
            {newResourceData.type === 'Physical' && (
              <div>
                <label htmlFor="items" className="block text-sm font-medium text-gray-700">Items</label>
                <input type="text" name="items" id="items" value={newResourceData.items} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
            )}
            {newResourceData.type === 'Technical' && (
              <div>
                <label htmlFor="specs" className="block text-sm font-medium text-gray-700">Specifications</label>
                <input type="text" name="specs" id="specs" value={newResourceData.specs} onChange={handleFormChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
            )}
            <div className="col-span-full flex justify-end space-x-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Cancel</button>
              <button type="submit" className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Add Resource</button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            filter === 'all'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('physical')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            filter === 'physical'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Physical
        </button>
        <button
          onClick={() => setFilter('technical')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            filter === 'technical'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Technical
        </button>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{resource.type}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{resource.name}</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-500">
                  <p className="mb-2">
                    <span className="font-medium">Department:</span> {resource.department}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Location:</span> {resource.location}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Schedule:</span> {resource.schedule}
                  </p>
                  {resource.type === 'Physical' && resource.capacity && (
                    <p className="mb-2">
                      <span className="font-medium">Capacity:</span> {resource.capacity} people
                    </p>
                  )}
                  {resource.type === 'Technical' && resource.specs && (
                    <p className="mb-2">
                      <span className="font-medium">Specifications:</span> {resource.specs}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    resource.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {resource.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <a href={`/resources/${resource.id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                  View details
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 