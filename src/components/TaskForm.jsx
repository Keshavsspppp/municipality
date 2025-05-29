import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import { 
  TextField, 
  Button, 
  DialogActions, 
  Box, 
  Typography, 
  IconButton, 
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material'; // Assuming Material UI is used based on Projects.jsx
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

// Mock user data - replace with actual user data source
const mockUsers = [
  { id: 1, name: 'John Smith', role: 'Lead Developer' },
  { id: 2, name: 'Emily Brown', role: 'Project Manager' },
  { id: 3, name: 'David Wilson', role: 'Cloud Architect' },
  { id: 4, name: 'Sarah Lee', role: 'UI/UX Designer' },
];

export default function TaskForm({ task, departments, categories, onSubmit, onCancel }) {
  const { can } = useAuth();
  const [formData, setFormData] = useState(task || {
    title: '',
    description: '',
    department: '',
    category: '',
    assignedTo: [], // Initialize assignedTo as an empty array
    status: 'pending',
    priority: 'medium',
    milestones: [],
    dependencies: []
  });

  const [newMilestone, setNewMilestone] = useState({
    title: '',
    deadline: '',
    description: ''
  });

  const [newDependency, setNewDependency] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAssignedUsersChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      assignedTo: typeof value === 'string' ? [] : value // value is an array of user IDs/objects
    }));
  };

  const handleAddMilestone = () => {
    if (newMilestone.title && newMilestone.deadline) {
      setFormData(prev => ({
        ...prev,
        milestones: [
          ...prev.milestones,
          {
            id: Date.now(),
            title: newMilestone.title,
            description: newMilestone.description,
            deadline: newMilestone.deadline,
            completed: false
          }
        ]
      }));
      setNewMilestone({ title: '', deadline: '', description: '' });
    }
  };

  const handleRemoveMilestone = (milestoneId) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== milestoneId)
    }));
  };

  const handleAddDependency = () => {
    if (newDependency && !formData.dependencies.includes(newDependency)) {
      setFormData(prev => ({
        ...prev,
        dependencies: [...prev.dependencies, newDependency]
      }));
      setNewDependency('');
    }
  };

  const handleRemoveDependency = (dependencyId) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies.filter(d => d !== dependencyId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure assignedTo contains full user objects if needed downstream
    const assignedUserObjects = formData.assignedTo.map(userId => mockUsers.find(user => user.id === userId) || userId);
    onSubmit({...formData, assignedTo: assignedUserObjects});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Task Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            name="department"
            id="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            name="priority"
            id="priority"
            value={formData.priority}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div>
        <FormControl fullWidth>
          <InputLabel id="assigned-to-label">Assigned To</InputLabel>
          <Select
            labelId="assigned-to-label"
            id="assignedTo"
            multiple
            value={formData.assignedTo.map(user => user.id || user)} // Handle both objects and IDs
            onChange={handleAssignedUsersChange}
            renderValue={(selected) => selected.map(id => mockUsers.find(user => user.id === id)?.name || id).join(', ')}
          >
            {mockUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name} ({user.role})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Dependencies</label>
        <div className="mt-2 space-y-4">
          {formData.dependencies.map((dependency) => (
            <div key={dependency} className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={dependency}
                  readOnly
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDependency(dependency)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Task ID or name"
                value={newDependency}
                onChange={(e) => setNewDependency(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="button"
              onClick={handleAddDependency}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Milestones</label>
        <div className="mt-2 space-y-4">
          {formData.milestones.map((milestone) => (
            <div key={milestone.id} className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={milestone.title}
                  readOnly
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  value={milestone.deadline}
                  readOnly
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMilestone(milestone.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Milestone title"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex-1">
              <input
                type="date"
                value={newMilestone.deadline}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, deadline: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="button"
              onClick={handleAddMilestone}
              className="text-indigo-600 hover:text-indigo-800"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
} 