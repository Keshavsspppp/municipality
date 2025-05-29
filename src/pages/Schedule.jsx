import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import MeetingScheduler from '../components/MeetingScheduler';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { CalendarIcon, ListBulletIcon, MagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// Mock data - replace with actual API calls
const mockTasks = [
  {
    id: 1,
    title: 'System Modernization Phase 1',
    description: 'Initial phase of system modernization project',
    department: 'Engineering Department',
    assignedTo: [
      { id: 1, name: 'John Smith', role: 'Lead Developer' },
      { id: 2, name: 'Emily Brown', role: 'Project Manager' }
    ],
    status: 'ongoing',
    priority: 'high',
    milestones: [
      {
        id: 1,
        title: 'Requirements Analysis',
        deadline: '2024-04-01'
      },
      {
        id: 2,
        title: 'System Design',
        deadline: '2024-05-15'
      }
    ],
    logs: [
      { id: 1, message: 'Project kickoff meeting completed', timestamp: '2024-03-15T10:00:00Z', user: 'Emily Brown' },
      { id: 2, message: 'Initial requirements gathered', timestamp: '2024-03-16T14:30:00Z', user: 'John Smith' }
    ]
  },
  {
    id: 2,
    title: 'Cloud Migration Planning',
    description: 'Planning phase for cloud infrastructure migration',
    department: 'IT Department',
    assignedTo: [
      { id: 3, name: 'David Wilson', role: 'Cloud Architect' }
    ],
    status: 'pending',
    priority: 'medium',
    milestones: [
      {
        id: 3,
        title: 'Infrastructure Assessment',
        deadline: '2024-04-15'
      }
    ],
    logs: [
      { id: 3, message: 'Task created', timestamp: '2024-03-17T09:00:00Z', user: 'System' }
    ]
  }
];

const mockDepartments = [
  { id: 1, name: 'Engineering Department' },
  { id: 2, name: 'IT Department' },
  { id: 3, name: 'Research & Development' }
];

const mockProjects = [ /* ... add mock project data if needed by MeetingScheduler ... */ ];

export default function Schedule() {
  const { can } = useAuth();

  // Load tasks from Local Storage on initial render, or use mockTasks
  const [tasks, setTasks] = useState(() => {
    try {
      const storedTasks = localStorage.getItem('tasksData');
      return storedTasks ? JSON.parse(storedTasks) : mockTasks;
    } catch (error) {
      console.error('Error loading tasks from Local Storage:', error);
      return mockTasks;
    }
  });

  // Save tasks to Local Storage whenever the tasks state changes
  useEffect(() => {
    try {
      localStorage.setItem('tasksData', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to Local Storage:', error);
    }
  }, [tasks]);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({
    start: format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'), // Start of current year
    end: format(new Date(new Date().getFullYear(), 11, 31), 'yyyy-MM-dd') // End of current year
  });
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'development', name: 'Development' },
    { id: 'design', name: 'Design' },
    { id: 'planning', name: 'Planning' },
    { id: 'review', name: 'Review' }
  ];

  const handleTaskUpdate = (taskId, updates) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const handleTaskSubmit = (taskData) => {
    if (selectedTask) {
      // Update existing task
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === selectedTask.id ? { ...task, ...taskData } : task
        )
      );
    } else {
      // Create new task
      const newTask = {
        id: Date.now(),
        ...taskData,
        logs: [
          {
            id: Date.now(),
            message: 'Task created',
            timestamp: new Date().toISOString(),
            user: 'System'
          }
        ]
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
    }
    setShowTaskForm(false);
    setSelectedTask(null);
  };

  const handleExportTasks = () => {
    const exportData = tasks.map(task => ({
      title: task.title,
      description: task.description,
      department: task.department,
      status: task.status,
      priority: task.priority,
      milestones: task.milestones.map(m => ({
        title: m.title,
        deadline: m.deadline
      }))
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesDateRange = task.milestones.some(milestone => {
      const milestoneDate = new Date(milestone.deadline);
      return milestoneDate >= new Date(dateRange.start) && milestoneDate <= new Date(dateRange.end);
    });
    return matchesSearch && matchesCategory && matchesDateRange;
  });

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage meetings and video calls
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="mt-6">
            <MeetingScheduler departments={mockDepartments} projects={mockProjects} />
          </div>
        </div>
      </div>
    </div>
  );
}
