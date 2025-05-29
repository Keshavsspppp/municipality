const mongoose = require('mongoose');
const Department = require('../models/Department');

const departments = [
  {
    name: 'Information Technology',
    code: 'IT',
    description: 'Handles all IT infrastructure, software development, and technical support',
    head: 'John Smith',
    contactEmail: 'it@company.com',
    contactPhone: '555-0101'
  },
  {
    name: 'Human Resources',
    code: 'HR',
    description: 'Manages employee relations, recruitment, and benefits',
    head: 'Sarah Johnson',
    contactEmail: 'hr@company.com',
    contactPhone: '555-0102'
  },
  {
    name: 'Finance',
    code: 'FIN',
    description: 'Handles financial planning, accounting, and budgeting',
    head: 'Michael Brown',
    contactEmail: 'finance@company.com',
    contactPhone: '555-0103'
  },
  {
    name: 'Marketing',
    code: 'MKT',
    description: 'Manages brand strategy, advertising, and market research',
    head: 'Emily Davis',
    contactEmail: 'marketing@company.com',
    contactPhone: '555-0104'
  },
  {
    name: 'Operations',
    code: 'OPS',
    description: 'Oversees day-to-day operations and process improvement',
    head: 'David Wilson',
    contactEmail: 'operations@company.com',
    contactPhone: '555-0105'
  },
  {
    name: 'Research and Development',
    code: 'RND',
    description: 'Focuses on innovation and product development',
    head: 'Lisa Anderson',
    contactEmail: 'rnd@company.com',
    contactPhone: '555-0106'
  },
  {
    name: 'Customer Service',
    code: 'CS',
    description: 'Provides customer support and satisfaction',
    head: 'Robert Taylor',
    contactEmail: 'support@company.com',
    contactPhone: '555-0107'
  },
  {
    name: 'Legal',
    code: 'LEG',
    description: 'Handles legal matters and compliance',
    head: 'Jennifer Martinez',
    contactEmail: 'legal@company.com',
    contactPhone: '555-0108'
  }
];

const seedDepartments = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://keshav23100:Keshav23100@mun.lyp1p1l.mongodb.net/?retryWrites=true&w=majority&appName=MUN', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear existing departments
    await Department.deleteMany({});
    console.log('Cleared existing departments');

    // Insert new departments
    await Department.insertMany(departments);
    console.log('Successfully seeded departments');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding departments:', error);
    process.exit(1);
  }
};

seedDepartments(); 