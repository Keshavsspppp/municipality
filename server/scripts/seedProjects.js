const mongoose = require('mongoose');
const Department = require('../models/Department');

// Sample coordinates in Raipur
const raipurLocations = [
  { name: 'City Center', lat: 21.2514, lng: 81.6296 },
  { name: 'Telibandha', lat: 21.2584, lng: 81.6396 },
  { name: 'Shankar Nagar', lat: 21.2454, lng: 81.6196 },
  { name: 'Civil Lines', lat: 21.2614, lng: 81.6496 },
  { name: 'Raipur Railway Station', lat: 21.2514, lng: 81.6396 },
  { name: 'Raipur Airport', lat: 21.1814, lng: 81.7396 },
  { name: 'Naya Raipur', lat: 21.1614, lng: 81.7896 },
  { name: 'Pandri', lat: 21.2414, lng: 81.6296 }
];

const projects = [
  {
    name: 'Road Widening Project',
    description: 'Widening of main arterial road in City Center',
    status: 'in_progress',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
    progress: 45,
    location: 'City Center'
  },
  {
    name: 'Smart City Infrastructure',
    description: 'Installation of smart traffic signals and street lights',
    status: 'pending',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-08-31'),
    progress: 0,
    location: 'Telibandha'
  },
  {
    name: 'Water Supply Upgrade',
    description: 'Upgrading water supply infrastructure in Shankar Nagar',
    status: 'in_progress',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-07-31'),
    progress: 30,
    location: 'Shankar Nagar'
  },
  {
    name: 'Public Park Development',
    description: 'Development of new public park with modern amenities',
    status: 'completed',
    startDate: new Date('2023-10-01'),
    endDate: new Date('2024-02-28'),
    progress: 100,
    location: 'Civil Lines'
  },
  {
    name: 'Station Area Redevelopment',
    description: 'Modernization of railway station area',
    status: 'in_progress',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-12-31'),
    progress: 25,
    location: 'Raipur Railway Station'
  },
  {
    name: 'Airport Terminal Expansion',
    description: 'Expansion of airport terminal building',
    status: 'delayed',
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-09-30'),
    progress: 40,
    location: 'Raipur Airport'
  },
  {
    name: 'Smart City Hub',
    description: 'Development of smart city command center',
    status: 'in_progress',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-11-30'),
    progress: 35,
    location: 'Naya Raipur'
  },
  {
    name: 'Market Area Renovation',
    description: 'Renovation of traditional market area',
    status: 'pending',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-10-31'),
    progress: 0,
    location: 'Pandri'
  }
];

const seedProjects = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/mun', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Get all departments
    const departments = await Department.find();
    
    if (departments.length === 0) {
      console.log('No departments found. Please seed departments first.');
      process.exit(1);
    }

    // Add projects to departments
    for (let i = 0; i < departments.length; i++) {
      const department = departments[i];
      const project = projects[i];
      const location = raipurLocations[i];

      // Add coordinates to project
      project.latitude = location.lat;
      project.longitude = location.lng;

      // Add project to department
      department.activeProjects.push(project);
      await department.save();
    }

    console.log('Projects seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding projects:', error);
    process.exit(1);
  }
};

seedProjects(); 