import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { format, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Typography } from '@mui/material';

export default function TaskManagement({ tasks = [], departments = [], onTaskUpdate, viewMode = 'list', dateRange }) {
  const { can } = useAuth();
  const [filter, setFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    ongoing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    blocked: 'bg-red-100 text-red-800'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-red-100 text-red-800'
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const handleStatusChange = (taskId, newStatus) => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { status: newStatus });
    }
  };

  const handleAddLog = (taskId, log) => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { 
        logs: [...(tasks.find(t => t.id === taskId)?.logs || []), {
          id: Date.now(),
          message: log,
          timestamp: new Date().toISOString(),
          user: 'Current User' // Replace with actual user
        }]
      });
    }
  };

  const calculateProgress = (task) => {
    const totalMilestones = task.milestones.length;
    if (totalMilestones === 0) return 0;
    const completedMilestones = task.milestones.filter(m => m.completed).length;
    return Math.round((completedMilestones / totalMilestones) * 100);
  };

  const renderCalendarView = () => {
    const days = eachDayOfInterval({
      start: parseISO(dateRange.start),
      end: parseISO(dateRange.end)
    });

    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map(day => {
            const dayTasks = filteredTasks.filter(task =>
              task.milestones.some(milestone =>
                milestone.deadline && isSameDay(parseISO(milestone.deadline), day)
              )
            );

            return (
              <div
                key={day.toString()}
                className="min-h-[100px] bg-white p-2"
              >
                <div className="text-sm font-medium text-gray-900">
                  {format(day, 'd')}
                </div>
                <div className="mt-1 space-y-1">
                  {dayTasks.map(task => (
                    <div
                      key={task.id}
                      className={`text-xs p-1 rounded truncate cursor-pointer ${
                        statusColors[task.status]
                      }`}
                      onClick={() => setSelectedTask(task)}
                    >
                      {task.title}
                      {task.assignedTo && task.assignedTo.length > 0 && (
                        <div className="text-gray-600 mt-1">
                          {task.assignedTo.map(user => user.name).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderListView = () => (
    <div className="grid grid-cols-1 gap-6">
      {filteredTasks.map((task) => (
        <div
          key={task.id}
          className="bg-white shadow rounded-lg p-6 border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{task.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                className={`rounded-md text-sm font-medium px-2.5 py-1 ${
                  statusColors[task.status]
                }`}
              >
                <option value="pending">Pending</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Progress</h4>
              <span className="text-sm text-gray-500">{calculateProgress(task)}%</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${calculateProgress(task)}%` }}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Assigned To</h4>
              <div className="mt-2 space-y-2">
                {task.assignedTo && task.assignedTo.length > 0 ? (
                  task.assignedTo.map((assignee) => (
                    <div key={assignee.id} className="flex items-center text-sm text-gray-500">
                      <span className="font-medium">{assignee.name}</span>
                      {assignee.role && (
                        <span className="mx-2">•</span>
                      )}
                      {assignee.role && (
                        <span>{assignee.role}</span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No users assigned</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700">Department</h4>
              <p className="mt-2 text-sm text-gray-500">{task.department}</p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">Milestones</h4>
            <div className="mt-2 space-y-2">
              {task.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={milestone.completed}
                      onChange={() => {
                        const updatedMilestones = task.milestones.map(m =>
                          m.id === milestone.id ? { ...m, completed: !m.completed } : m
                        );
                        onTaskUpdate(task.id, { milestones: updatedMilestones });
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className={`ml-2 ${milestone.completed ? 'line-through text-gray-400' : 'text-gray-500'}`}>
                      {milestone.title}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    new Date(milestone.deadline) < new Date() && !milestone.completed
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {format(new Date(milestone.deadline), 'MMM d, yyyy')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">Update Log</h4>
            <div className="mt-2 space-y-2">
              {task.logs?.map((log) => (
                <div key={log.id} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">{log.message}</span>
                    <span className="text-gray-400">
                      {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">by {log.user}</span>
                </div>
              ))}
            </div>
            {can('tasks', 'update') && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Add an update..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      handleAddLog(task.id, e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          {['all', 'pending', 'ongoing', 'completed', 'blocked'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === status
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        {can('tasks', 'create') && (
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Task
          </button>
        )}
      </div>

      {viewMode === 'calendar' ? renderCalendarView() : renderListView()}

      {selectedTask && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-lg font-medium text-gray-900">{selectedTask.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{selectedTask.description}</p>
            {selectedTask.assignedTo && selectedTask.assignedTo.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Assigned To</h4>
                <div className="mt-2 space-y-1">
                  {selectedTask.assignedTo.map(user => (
                    <Typography key={user.id} variant="body2" className="text-gray-600">
                      {user.name} ({user.role})
                    </Typography>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 