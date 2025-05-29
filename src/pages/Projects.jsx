import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../contexts/NotificationContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMapEvents } from 'react-leaflet';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  LinearProgress, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

// Fix for default marker icon issue with Leaflet and Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom marker icons for different departments
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Department colors mapping
const departmentColors = {
  'Engineering Department': '#FF5733', // Orange
  'IT Department': '#33A1FF', // Blue
  'Research & Development': '#33FF57', // Green
  'default': '#808080' // Gray for unknown departments
};

// Initial projects data
const initialProjects = [
  {
    name: 'Road Widening Project',
    description: 'Widening of main arterial road in City Center',
    status: 'in_progress',
    position: [21.2514, 81.6296],
    progress: 45,
    department: 'Engineering Department'
  },
  {
    name: 'Smart City Infrastructure',
    description: 'Installation of smart traffic signals and street lights',
    status: 'pending',
    position: [21.2584, 81.6396],
    progress: 0,
    department: 'IT Department'
  },
  {
    name: 'Water Supply Upgrade',
    description: 'Upgrading water supply infrastructure in Shankar Nagar',
    status: 'in_progress',
    position: [21.2454, 81.6196],
    progress: 30,
    department: 'Engineering Department'
  },
  {
    name: 'Public Park Development',
    description: 'Development of new public park with modern amenities',
    status: 'completed',
    position: [21.2614, 81.6496],
    progress: 100,
    department: 'Research & Development'
  },
  {
    name: 'Station Area Redevelopment',
    description: 'Modernization of railway station area',
    status: 'in_progress',
    position: [21.2514, 81.6396],
    progress: 25,
    department: 'Engineering Department'
  },
  {
    name: 'Airport Terminal Expansion',
    description: 'Expansion of airport terminal building',
    status: 'delayed',
    position: [21.1814, 81.7396],
    progress: 40,
    department: 'Engineering Department'
  },
  {
    name: 'Smart City Hub',
    description: 'Development of smart city command center',
    status: 'in_progress',
    position: [21.1614, 81.7896],
    progress: 35,
    department: 'IT Department'
  },
  {
    name: 'Market Area Renovation',
    description: 'Renovation of traditional market area',
    status: 'pending',
    position: [21.2414, 81.6296],
    progress: 0,
    department: 'Research & Development'
  }
];

export default function Projects() {
  const { user, can } = useAuth();
  const { addNotification } = useNotifications();

  // Load projects from Local Storage on initial render, or use initialProjects
  const [projects, setProjects] = useState(() => {
    try {
      const storedProjects = localStorage.getItem('projectsData');
      return storedProjects ? JSON.parse(storedProjects) : initialProjects;
    } catch (error) {
      console.error('Error loading projects from Local Storage:', error);
      return initialProjects;
    }
  });

  // Save projects to Local Storage whenever the projects state changes
  useEffect(() => {
    try {
      localStorage.setItem('projectsData', JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects to Local Storage:', error);
    }
  }, [projects]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'pending',
    position: [21.2514, 81.6296], // Default to Raipur center
    progress: 0,
    department: ''
  });

  // Default map center (Raipur)
  const defaultCenter = [21.2514, 81.6296];
  const zoomLevel = 12;

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'primary';
      case 'delayed':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setEditedProject({ ...project });
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setNewProject({
      name: '',
      description: '',
      status: 'pending',
      position: [21.2514, 81.6296],
      progress: 0,
      department: ''
    }); // Reset for button click
    setIsCreateModalOpen(true);
  };

  const handleMapClick = (latlng) => {
    setNewProject(prev => ({
      ...prev,
      position: [latlng.lat, latlng.lng]
    }));
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedProject(null);
    setEditedProject(null);
    setNewProject({
      name: '',
      description: '',
      status: 'pending',
      position: [21.2514, 81.6296],
      progress: 0,
      department: ''
    }); // Reset new project state on close
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isCreateModalOpen) {
      setNewProject(prev => ({
        ...prev,
        [name]: name === 'progress' ? Number(value) : value
      }));
    } else {
      setEditedProject(prev => ({
        ...prev,
        [name]: name === 'progress' ? Number(value) : value
      }));
    }
  };

  const handleSaveChanges = () => {
    if (isCreateModalOpen) {
      const projectToAdd = {
        ...newProject,
        id: Date.now(), // Add a unique ID
        // Ensure department is included and position is correct
        department: newProject.department || 'default',
        position: newProject.position || [21.2514, 81.6296] // Use selected position or default
      };
      setProjects(prevProjects => [...prevProjects, projectToAdd]);
      addNotification('Project created successfully', 'success');
    } else {
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project === selectedProject ? { ...editedProject, department: editedProject.department || 'default' } : project
        )
      );
      addNotification('Project updated successfully', 'success');
    }
    handleCloseModal();
  };

  // Component to handle map clicks
  function MapClickHandler() {
    useMapEvents({
      click: (e) => {
        handleMapClick(e.latlng);
      },
    });
    return null;
  }

  // Add department legend
  const renderDepartmentLegend = () => (
    <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
      <Typography variant="subtitle2" className="font-medium mb-2">
        Departments
      </Typography>
      <div className="space-y-2">
        {Object.entries(departmentColors).map(([dept, color]) => (
          <div key={dept} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: color }}
            />
            <Typography variant="body2" className="text-sm">
              {dept}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Create Project
          </Button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Map Section */}
        <div className="mt-8">
          <Typography variant="h6" gutterBottom>
            Project Locations
          </Typography>
          <Box sx={{ height: '500px', width: '100%', mt: 2, position: 'relative' }}>
            <MapContainer center={defaultCenter} zoom={zoomLevel} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {projects.map((project, index) => (
                <Marker 
                  key={index} 
                  position={project.position}
                  icon={createCustomIcon(departmentColors[project.department] || departmentColors.default)}
                >
                  <Popup>
                    <div className="p-2 min-w-[250px]">
                      <Typography variant="h6" className="font-semibold text-gray-900 mb-2">
                        {project.name}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 mb-3">
                        {project.description}
                      </Typography>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Typography variant="body2" className="text-gray-500">
                            Department:
                          </Typography>
                          <Typography 
                            variant="body2" 
                            className="font-medium"
                            style={{ color: departmentColors[project.department] || departmentColors.default }}
                          >
                            {project.department}
                          </Typography>
                        </div>
                        <div className="flex items-center justify-between">
                          <Typography variant="body2" className="text-gray-500">
                            Status:
                          </Typography>
                          <Typography 
                            variant="body2" 
                            className={`font-medium ${
                              project.status === 'completed' ? 'text-green-600' :
                              project.status === 'in_progress' ? 'text-blue-600' :
                              project.status === 'delayed' ? 'text-red-600' :
                              'text-yellow-600'
                            }`}
                          >
                            {project.status.replace('_', ' ').toUpperCase()}
                          </Typography>
                        </div>
                        <div className="flex items-center justify-between">
                          <Typography variant="body2" className="text-gray-500">
                            Progress:
                          </Typography>
                          <Typography variant="body2" className="font-medium text-gray-700">
                            {project.progress}%
                          </Typography>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                project.status === 'completed' ? 'bg-green-500' :
                                project.status === 'in_progress' ? 'bg-blue-500' :
                                project.status === 'delayed' ? 'bg-red-500' :
                                'bg-yellow-500'
                              }`}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <Typography variant="body2" className="text-gray-500">
                            Location: {project.position[0].toFixed(4)}, {project.position[1].toFixed(4)}
                          </Typography>
                        </div>
                        <div className="mt-2">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleEditClick(project)}
                            className="w-full"
                          >
                            Edit Project
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <MapClickHandler />
            </MapContainer>
            {renderDepartmentLegend()}
          </Box>
        </div>

        {/* Projects Information Section */}
        <div className="mt-12">
          <Typography variant="h6" gutterBottom>
            Projects Overview
          </Typography>
          <Grid container spacing={3}>
            {projects.map((project, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper elevation={2} className="p-4">
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" gutterBottom>
                      {project.name}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditClick(project)}
                      sx={{ ml: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {project.description}
                  </Typography>
                  <div className="mb-2">
                    <Typography variant="body2" className="text-gray-500">
                      Department: 
                      <span 
                        className="font-medium"
                        style={{ color: departmentColors[project.department] || departmentColors.default }}
                      >
                        {project.department}
                      </span>
                    </Typography>
                  </div>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Status: <span className={`font-medium text-${getStatusColor(project.status)}-600`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={project.progress}
                          color={getStatusColor(project.status)}
                        />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">
                          {`${project.progress}%`}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Location: {project.position[0].toFixed(4)}, {project.position[1].toFixed(4)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated: {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>

      {/* Edit Project Modal */}
      <Dialog open={isEditModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Project Name"
              value={editedProject?.name || ''}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="description"
              label="Description"
              value={editedProject?.description || ''}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              name="department"
              label="Department"
              select
              value={editedProject?.department || ''}
              onChange={handleInputChange}
              fullWidth
              required
            >
              <MenuItem value="">Select Department</MenuItem>
              {Object.keys(departmentColors).filter(key => key !== 'default').map(dept => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="status"
              label="Status"
              select
              value={editedProject?.status || ''}
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="delayed">Delayed</MenuItem>
            </TextField>
            <TextField
              name="progress"
              label="Progress (%)"
              type="number"
              value={editedProject?.progress || 0}
              onChange={handleInputChange}
              fullWidth
              inputProps={{ min: 0, max: 100 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSaveChanges} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Project Modal */}
      <Dialog open={isCreateModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Project Name"
              value={newProject.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="description"
              label="Description"
              value={newProject.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              required
            />
            <TextField
              name="department"
              label="Department"
              select
              value={newProject.department}
              onChange={handleInputChange}
              fullWidth
              required
            >
              <MenuItem value="">Select Department</MenuItem>
              {Object.keys(departmentColors).filter(key => key !== 'default').map(dept => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="status"
              label="Status"
              select
              value={newProject.status}
              onChange={handleInputChange}
              fullWidth
              required
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="delayed">Delayed</MenuItem>
            </TextField>
            <TextField
              name="progress"
              label="Progress (%)"
              type="number"
              value={newProject.progress}
              onChange={handleInputChange}
              fullWidth
              inputProps={{ min: 0, max: 100 }}
              required
            />
            <TextField
              name="position-lat"
              label="Latitude"
              value={newProject.position[0].toFixed(4)}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              name="position-lng"
              label="Longitude"
              value={newProject.position[1].toFixed(4)}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button 
            onClick={handleSaveChanges} 
            variant="contained" 
            color="primary"
            disabled={!newProject.name || !newProject.description || !newProject.department}
          >
            Create Project
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 