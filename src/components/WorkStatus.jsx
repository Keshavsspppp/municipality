import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDepartments } from '../services/api';
import io from 'socket.io-client';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper
} from '@mui/material';
import {
  Work as WorkIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const SOCKET_SERVER_URL = 'http://localhost:5000';

const WorkStatus = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = React.useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getDepartments();
        if (response.success) {
          setDepartments(response.data);
          console.log('Fetched departments:', response.data.length);
          setError(null);
        } else {
          setError(response.message || 'Failed to fetch departments');
        }
      } catch (err) {
        setError('Failed to fetch departments. Please ensure the backend is running and accessible.');
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Real-time updates with Socket.IO
  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 45000,
      withCredentials: true
    });

    socketRef.current.on('departmentCreated', (department) => {
      setDepartments((prev) => {
        const newState = [...prev, department];
        console.log('Departments after creation event:', newState.length);
        return newState;
      });
    });
    socketRef.current.on('departmentUpdated', (updatedDepartment) => {
      setDepartments((prev) => {
        const newState = prev.map(dep => dep._id === updatedDepartment._id ? updatedDepartment : dep);
        console.log('Departments after update event:', newState.length);
        return newState;
      });
    });
    socketRef.current.on('departmentDeleted', (deletedId) => {
      setDepartments((prev) => {
        const newState = prev.filter(dep => dep._id !== deletedId);
        console.log('Departments after deletion event:', newState.length);
        return newState;
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'pending':
        return 'info';
      case 'delayed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CompletedIcon color="success" />;
      case 'in_progress':
        return <PendingIcon color="warning" />;
      case 'pending':
        return <PendingIcon color="info" />;
      case 'delayed':
        return <ErrorIcon color="error" />;
      default:
        return <PendingIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Current Work Status
      </Typography>
      
      <Grid container spacing={3}>
        {departments.map((department) => (
          <Grid item xs={12} md={6} lg={4} key={department._id}>
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <WorkIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">{department.name}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Department Head"
                      secondary={department.head || 'Not assigned'}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Current Location"
                      secondary={department.currentLocation || 'Not specified'}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <TimeIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Last Updated"
                      secondary={new Date(department.updatedAt).toLocaleString()}
                    />
                  </ListItem>
                </List>

                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Active Projects
                  </Typography>
                  {department.activeProjects?.map((project, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 2,
                        mb: 1,
                        backgroundColor: 'background.default'
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">{project.name}</Typography>
                        <Chip
                          icon={getStatusIcon(project.status)}
                          label={project.status.replace('_', ' ')}
                          color={getStatusColor(project.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {project.description}
                      </Typography>
                    </Paper>
                  ))}
                </Box>

                {user?.role === 'admin' && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Department Statistics
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 1, textAlign: 'center' }}>
                          <Typography variant="h6">{department.totalProjects || 0}</Typography>
                          <Typography variant="caption">Total Projects</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 1, textAlign: 'center' }}>
                          <Typography variant="h6">{department.completedProjects || 0}</Typography>
                          <Typography variant="caption">Completed</Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WorkStatus; 