const mongoose = require('mongoose');
const Forum = require('../models/Forum');
const Department = require('../models/Department');
require('dotenv').config();

// Keep the structure, but department/departments will be populated with actual IDs later
const forumDataStructure = [
  {
    name: "Public Discussion",
    description: "Open forum for all citizens to discuss municipal matters",
    type: "Public",
    topics: [
      {
        title: "Welcome to Public Forum",
        content: "This is a space for all citizens to discuss municipal matters openly.",
        createdAt: new Date('2024-03-15T10:00:00Z'),
        posts: [
          {
            content: "Great initiative! Looking forward to active discussions.",
            createdAt: new Date('2024-03-15T10:05:00Z'),
          },
          {
            content: "How can we report street light issues?",
            createdAt: new Date('2024-03-15T10:30:00Z'),
          }
        ]
      }
    ]
  },
  {
    name: "Water Department Internal",
    description: "Internal discussions for water department staff",
    type: "Intra",
    departmentName: "Information Technology",
    topics: [
      {
        title: "Water Supply Schedule",
        content: "Discussion about water supply schedules and maintenance",
        createdAt: new Date('2024-03-15T08:00:00Z'),
        posts: [
          {
            content: "Please review the new schedule for Sector 27",
            createdAt: new Date('2024-03-15T08:30:00Z'),
          }
        ]
      }
    ]
  },
  {
    name: "Road & Water Department Collaboration",
    description: "Joint forum for road and water department coordination",
    type: "Inter",
    departmentNames: ["Operations", "Information Technology"],
    topics: [
      {
        title: "Road Digging Coordination",
        content: "Coordination for upcoming road digging projects",
        createdAt: new Date('2024-03-14T11:00:00Z'),
        posts: [
          {
            content: "Please coordinate with water department before starting work",
            createdAt: new Date('2024-03-14T11:30:00Z'),
          },
          {
            content: "Pipeline maintenance scheduled for next week",
            createdAt: new Date('2024-03-14T12:00:00Z'),
          }
        ]
      }
    ]
  },
  {
    name: "Sanitation Department Internal",
    description: "Internal discussions for sanitation department staff",
    type: "Intra",
    departmentName: "Marketing",
    topics: [
      {
        title: "Waste Collection Routes",
        content: "Discussion about waste collection routes and schedules",
        createdAt: new Date('2024-03-15T07:00:00Z'),
        posts: [
          {
            content: "New routes have been assigned for Zone 5",
            createdAt: new Date('2024-03-15T07:30:00Z'),
          }
        ]
      }
    ]
  },
  {
    name: "Public Grievances",
    description: "Forum for citizens to raise and discuss grievances",
    type: "Public",
    topics: [
      {
        title: "Street Light Issues",
        content: "Discussion about street light maintenance and repairs",
        createdAt: new Date('2024-03-13T15:00:00Z'),
        posts: [
          {
            content: "Several street lights are not working in Sector 15",
            createdAt: new Date('2024-03-13T15:30:00Z'),
          },
          {
            content: "Work order has been issued for repairs",
            createdAt: new Date('2024-03-13T16:00:00Z'),
          }
        ]
      }
    ]
  },
  {
    name: "Urban Development Updates",
    description: "Updates and discussions about urban development projects",
    type: "Public",
    topics: [
      {
        title: "New Park Development",
        content: "Information about the new park development in Sector 8",
        createdAt: new Date('2024-03-12T10:00:00Z'),
        posts: [
          {
            content: "Construction will begin next month",
            createdAt: new Date('2024-03-12T10:30:00Z'),
          },
          {
            content: "Will there be a children's play area?",
            createdAt: new Date('2024-03-12T11:00:00Z'),
          }
        ]
      }
    ]
  },
  {
    name: "Public Works & Sanitation Coordination",
    description: "Coordination between public works and sanitation departments",
    type: "Inter",
    departmentNames: ["Finance", "Marketing"],
    topics: [
      {
        title: "Infrastructure Maintenance",
        content: "Coordination for infrastructure maintenance projects",
        createdAt: new Date('2024-03-11T09:00:00Z'),
        posts: [
          {
            content: "Drain cleaning scheduled for next week",
            createdAt: new Date('2024-03-11T09:30:00Z'),
          }
        ]
      }
    ]
  },
  {
    name: "Emergency Services Coordination",
    description: "Coordination forum for emergency services (Police, Fire, Medical)",
    type: "Inter",
    departmentNames: ["Customer Service", "Research and Development", "Human Resources"],
    topics: [
      {
        title: "Monthly Drill Schedule",
        content: "Discussion on the upcoming month's emergency drill schedule.",
        createdAt: new Date('2024-05-20T09:00:00Z'),
        posts: []
      }
    ]
  }
];

const seedForums = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://keshav23100:Keshav23100@mun.lyp1p1l.mongodb.net/?retryWrites=true&w=majority&appName=MUN', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Clear existing forums
    await Forum.deleteMany({});
    console.log('Cleared existing forums');

    // Fetch department IDs
    const departments = await Department.find({}, '_id name');
    const departmentMap = departments.reduce((map, dep) => {
      map[dep.name] = dep._id;
      return map;
    }, {});

    // Prepare forum data with actual department ObjectIds
    const forumsToInsert = forumDataStructure.map(forum => {
      const forumWithIds = {
        name: forum.name,
        description: forum.description,
        type: forum.type,
        topics: forum.topics
      };

      if (forum.type === 'Intra' && forum.departmentName) {
        const deptId = departmentMap[forum.departmentName];
        if (!deptId) {
          console.warn(`Warning: Department "${forum.departmentName}" not found. Skipping department reference.`);
        } else {
          forumWithIds.department = deptId;
        }
      } else if (forum.type === 'Inter' && forum.departmentNames) {
        const deptIds = forum.departmentNames
          .map(name => departmentMap[name])
          .filter(id => id !== undefined);
        
        if (deptIds.length === 0) {
          console.warn(`Warning: No valid departments found for forum "${forum.name}". Skipping department references.`);
        } else {
          forumWithIds.departments = deptIds;
        }
      }

      return forumWithIds;
    });

    // Insert new forums
    const forums = await Forum.insertMany(forumsToInsert);
    console.log('Successfully seeded forums:', forums.length);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error seeding forums:', error);
    process.exit(1);
  }
};

// Run the seed function
seedForums(); 