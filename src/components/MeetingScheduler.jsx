import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';

export default function MeetingScheduler({ departments = [], projects = [] }) {
  const { can } = useAuth();
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  const handleAddSuccess = (newMeeting) => {
    setMeetings(prev => [...prev, newMeeting]);
    setShowMeetingForm(false);
  };

  const handleCreateMeeting = (meetingData) => {
    const newMeeting = {
      id: Date.now(),
      ...meetingData,
      status: 'scheduled',
      attendees: [],
      createdAt: new Date().toISOString()
    };
    setMeetings([...meetings, newMeeting]);
    setShowMeetingForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Meeting Scheduler</h2>
          <p className="mt-1 text-sm text-gray-500">
            Schedule and manage meetings between departments
          </p>
        </div>
        {can('schedule', 'create') && (
          <button
            type="button"
            onClick={() => setShowMeetingForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Schedule Meeting
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {meetings.map((meeting) => (
          <div
            key={meeting._id}
            className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedMeeting(meeting)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {meeting.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {meeting.description}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  meeting.status === 'scheduled'
                    ? 'bg-green-100 text-green-800'
                    : meeting.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {meeting.status}
              </span>
            </div>

            <div className="mt-4">
              <div className="text-sm">
                <span className="font-medium">Date:</span>{' '}
                {new Date(meeting.date).toLocaleDateString()}
              </div>
              <div className="text-sm">
                <span className="font-medium">Time:</span>{' '}
                {new Date(meeting.date).toLocaleTimeString()}
              </div>
              <div className="text-sm">
                <span className="font-medium">Location:</span>{' '}
                {meeting.location}
              </div>
              <div className="text-sm">
                <span className="font-medium">Departments:</span>{' '}
                {meeting.departments.map(deptId => 
                  departments.find(d => d._id === deptId)?.name
                ).join(', ')}
              </div>
              {meeting.project && (
                <div className="text-sm">
                  <span className="font-medium">Related Project:</span>{' '}
                  {projects.find(p => p._id === meeting.project)?.name}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedMeeting && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedMeeting.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedMeeting.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMeeting(null)}
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
                <h4 className="text-sm font-medium text-gray-500">Meeting Details</h4>
                <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedMeeting.status}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(selectedMeeting.date).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Time</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(selectedMeeting.date).toLocaleTimeString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {selectedMeeting.location}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Participants</h4>
                <ul className="mt-2 divide-y divide-gray-200">
                  {selectedMeeting.departments.map((deptId) => {
                    const department = departments.find(d => d._id === deptId);
                    return (
                      <li key={deptId} className="py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {department?.name || 'Unknown Department'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {department?.head || 'No department head'}
                            </p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Confirmed
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {selectedMeeting.agenda && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Agenda</h4>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {selectedMeeting.agenda.map((item, index) => (
                      <li key={index} className="py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.description}
                            </p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {item.duration} min
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              {can('meetings', 'update') && (
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit Meeting
                </button>
              )}
              {can('meetings', 'delete') && (
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel Meeting
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Meeting Form Modal */}
      {showMeetingForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Schedule Interdepartmental Meeting
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleCreateMeeting({
                title: formData.get('title'),
                description: formData.get('description'),
                date: formData.get('date'),
                time: formData.get('time'),
                departments: selectedDepartments,
                projects: selectedProjects,
                type: formData.get('type')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Meeting Title
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Meeting Type
                  </label>
                  <select
                    name="type"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="project_coordination">Project Coordination</option>
                    <option value="resource_planning">Resource Planning</option>
                    <option value="status_update">Status Update</option>
                    <option value="planning">Planning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Select Departments
                  </label>
                  <div className="mt-2 space-y-2">
                    {departments.map((dept) => (
                      <label key={dept.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(dept.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDepartments([...selectedDepartments, dept.id]);
                            } else {
                              setSelectedDepartments(
                                selectedDepartments.filter((id) => id !== dept.id)
                              );
                            }
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {dept.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Related Projects
                  </label>
                  <div className="mt-2 space-y-2">
                    {projects.map((project) => (
                      <label key={project.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedProjects.includes(project.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProjects([...selectedProjects, project.id]);
                            } else {
                              setSelectedProjects(
                                selectedProjects.filter((id) => id !== project.id)
                              );
                            }
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {project.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowMeetingForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Schedule Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 