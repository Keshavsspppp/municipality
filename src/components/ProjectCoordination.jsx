import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../contexts/NotificationContext';
import { format } from 'date-fns';

export default function ProjectCoordination({ projects = [], departments = [] }) {
  const { can } = useAuth();
  const { addNotification } = useNotifications();
  const [conflicts, setConflicts] = useState([]);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [showAgreementForm, setShowAgreementForm] = useState(false);
  const [agreements, setAgreements] = useState([]);
  const [previousConflicts, setPreviousConflicts] = useState(new Set());
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Detect conflicts between projects
  useEffect(() => {
    const detectedConflicts = [];
    projects.forEach((project1, index) => {
      projects.slice(index + 1).forEach(project2 => {
        if (project1.location === project2.location) {
          const dateOverlap = checkDateOverlap(
            project1.startDate,
            project1.endDate,
            project2.startDate,
            project2.endDate
          );
          
          if (dateOverlap) {
            const conflictId = `${project1.id}-${project2.id}`;
            detectedConflicts.push({
              id: conflictId,
              project1,
              project2,
              location: project1.location,
              overlapPeriod: dateOverlap
            });

            // Notify about new conflicts
            if (!previousConflicts.has(conflictId)) {
              addNotification({
                type: 'warning',
                title: 'Project Conflict Detected',
                message: `Location conflict between "${project1.title}" and "${project2.title}" at ${project1.location}`,
                timestamp: new Date().toISOString(),
                persistent: true,
                action: {
                  label: 'View Details',
                  onClick: () => handleCreateAgreement({
                    id: conflictId,
                    project1,
                    project2,
                    location: project1.location,
                    overlapPeriod: dateOverlap
                  }),
                  closeOnClick: false
                }
              });
            }
          }
        }
      });
    });

    // Update previous conflicts
    setPreviousConflicts(new Set(detectedConflicts.map(c => c.id)));
    setConflicts(detectedConflicts);
  }, [projects, addNotification, previousConflicts]);

  const checkDateOverlap = (start1, end1, start2, end2) => {
    const startDate1 = new Date(start1);
    const endDate1 = new Date(end1);
    const startDate2 = new Date(start2);
    const endDate2 = new Date(end2);

    if (startDate1 <= endDate2 && startDate2 <= endDate1) {
      return {
        start: new Date(Math.max(startDate1, startDate2)),
        end: new Date(Math.min(endDate1, endDate2))
      };
    }
    return null;
  };

  const handleCreateAgreement = (conflict) => {
    setSelectedConflict(conflict);
    setShowAgreementForm(true);
  };

  const handleAgreementSubmit = (agreementData) => {
    const newAgreement = {
      id: Date.now(),
      ...agreementData,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    setAgreements([...agreements, newAgreement]);
    setShowAgreementForm(false);
    setSelectedConflict(null);

    // Notify about new agreement
    addNotification({
      type: 'success',
      title: 'Agreement Created',
      message: `New agreement "${agreementData.title}" has been created to resolve the conflict`,
      timestamp: new Date().toISOString(),
      persistent: false
    });
  };

  const handleAddSuccess = (newProject) => {
    // You would typically update the projects list here
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Project Coordination</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track projects across departments
          </p>
        </div>
        {can('projects', 'create') && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedProject(project)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {project.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {project.description}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  project.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : project.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="mt-4">
              <div className="text-sm">
                <span className="font-medium">Department:</span>{' '}
                {departments.find(d => d._id === project.department)?.name || 'N/A'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Start Date:</span>{' '}
                {new Date(project.startDate).toLocaleDateString()}
              </div>
              <div className="text-sm">
                <span className="font-medium">End Date:</span>{' '}
                {new Date(project.endDate).toLocaleDateString()}
              </div>
              <div className="text-sm">
                <span className="font-medium">Progress:</span>{' '}
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedProject.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedProject.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Project Details</h4>
                <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedProject.status}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Department</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {departments.find(d => d._id === selectedProject.department)?.name || 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(selectedProject.startDate).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">End Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(selectedProject.endDate).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Progress</h4>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${selectedProject.progress || 0}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedProject.progress || 0}% complete
                  </p>
                </div>
              </div>

              {selectedProject.tasks && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tasks</h4>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {selectedProject.tasks.map((task) => (
                      <li key={task._id} className="py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {task.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {task.description}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              task.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : task.status === 'in-progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              {can('projects', 'update') && (
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit Project
                </button>
              )}
              {can('projects', 'delete') && (
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Project
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conflict Detection Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Interdepartmental Project Coordination
        </h2>

        {conflicts.length > 0 ? (
          <div className="space-y-4">
            {conflicts.map((conflict) => (
              <div
                key={conflict.id}
                className="border border-yellow-200 bg-yellow-50 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-yellow-800">
                      Location Conflict: {conflict.location}
                    </h4>
                    <div className="mt-2 space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Project 1:</span>{' '}
                        {conflict.project1.title} ({conflict.project1.department})
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Project 2:</span>{' '}
                        {conflict.project2.title} ({conflict.project2.department})
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Overlap Period:</span>{' '}
                        {format(new Date(conflict.overlapPeriod.start), 'MMM d, yyyy')} -{' '}
                        {format(new Date(conflict.overlapPeriod.end), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                  {can('projects', 'coordinate') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateAgreement(conflict);
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      Create Agreement
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No conflicts detected</p>
        )}
      </div>

      {/* Agreements Section */}
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-3">
          Project Agreements
        </h3>
        {agreements.length > 0 ? (
          <div className="space-y-4">
            {agreements.map((agreement) => (
              <div
                key={agreement.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {agreement.title}
                    </h4>
                    <div className="mt-2 space-y-2">
                      <div className="text-sm text-gray-500">
                        {agreement.description}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Status:</span>{' '}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          agreement.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : agreement.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {agreement.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Created: {format(new Date(agreement.timestamp), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                  {can('projects', 'coordinate') && (
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-800">
                        View Details
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-800">
                        Download MoU
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No agreements created yet</p>
        )}
      </div>

      {/* Agreement Form Modal */}
      {showAgreementForm && selectedConflict && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create Project Agreement
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleAgreementSubmit({
                title: formData.get('title'),
                description: formData.get('description'),
                type: formData.get('type'),
                projects: [selectedConflict.project1.id, selectedConflict.project2.id]
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Agreement Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Agreement Type
                  </label>
                  <select
                    name="type"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="unified_phasing">Unified Phasing</option>
                    <option value="joint_execution">Joint Execution</option>
                    <option value="cost_sharing">Cost Sharing</option>
                    <option value="resource_sharing">Resource Sharing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Upload MoU (Optional)
                  </label>
                  <input
                    type="file"
                    name="mou"
                    accept=".pdf,.doc,.docx"
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAgreementForm(false);
                    setSelectedConflict(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create Agreement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 