import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import DepartmentProfile from '../components/DepartmentProfile';
import ProjectCoordination from '../components/ProjectCoordination';
import MeetingScheduler from '../components/MeetingScheduler';
import AddDepartmentModal from '../components/AddDepartmentModal';
import { getDepartments } from '../services/api';

export default function Departments() {
  const { can } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await getDepartments();
      if (response.success) {
        setDepartments(response.data);
      } else {
        setError('Failed to fetch departments');
      }
    } catch (err) {
      setError(err.message || 'Error fetching departments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = (newDepartment) => {
    setDepartments(prev => [...prev, newDepartment]);
  };

  const tabs = [
    { id: 'departments', name: 'Departments' },
    { id: 'coordination', name: 'Project Coordination' },
    { id: 'meetings', name: 'Meetings' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Departments</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage departments, coordinate projects, and schedule meetings
            </p>
          </div>
          {can('departments', 'create') && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Department
            </button>
          )}
        </div>

        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'departments' && (
              <>
                {selectedDepartment ? (
                  <DepartmentProfile
                    department={selectedDepartment}
                    onBack={() => setSelectedDepartment(null)}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {departments.map((department) => (
                      <div
                        key={department._id}
                        className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedDepartment(department)}
                      >
                        <h3 className="text-lg font-medium text-gray-900">
                          {department.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {department.description}
                        </p>
                        <div className="mt-4">
                          <div className="text-sm">
                            <span className="font-medium">Code:</span>{' '}
                            {department.code}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Head:</span>{' '}
                            {department.head}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Contact:</span>{' '}
                            {department.contactEmail}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'coordination' && (
              <ProjectCoordination
                projects={departments.flatMap(dept => dept.projects || [])}
                departments={departments}
              />
            )}

            {activeTab === 'meetings' && (
              <MeetingScheduler
                departments={departments}
                projects={departments.flatMap(dept => dept.projects || [])}
              />
            )}
          </div>
        </div>
      </div>

      <AddDepartmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
} 