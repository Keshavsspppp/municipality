const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

// Import models
require('./models/User');
require('./models/Department');
require('./models/Forum');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow both development ports
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000, // Increase ping timeout
  pingInterval: 25000, // Increase ping interval
  connectTimeout: 45000, // Increase connection timeout
  transports: ['websocket', 'polling'] // Enable both WebSocket and polling
});

// Export io for use in routes
module.exports.io = io;

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Handle joining a forum room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle leaving a forum room
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  // Handle sending messages
  socket.on('sendMessage', async (messageData) => {
    console.log('Received sendMessage event:', messageData);
    try {
      // Fetch user to get avatar using clerkId
      const User = mongoose.model('User'); // Access the User model
      const user = await User.findOne({ clerkId: socket.handshake.query.userId });

      if (!user) {
        console.error('User not found for clerkId:', socket.handshake.query.userId);
        // Optionally emit an error back to the sender
        return;
      }

      const messageToSend = {
        ...messageData,
        createdAt: new Date(),
        author: { // Include author details with avatar
          _id: user._id, // Use MongoDB _id for author reference if needed elsewhere
          name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email, // Use first/last name or email as name
          avatar: user.avatar // Include avatar (assuming this field exists in your User model)
        }
      };

      console.log('Broadcasting message to room', messageData.forumId, ':', messageToSend);
      io.to(messageData.forumId).emit('message', messageToSend);

    } catch (error) {
      console.error('Error sending message or fetching user:', error);
      // Optionally emit an error back to the sender
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Handle connection errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow both development ports
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://keshav23100:Keshav23100@mun.lyp1p1l.mongodb.net/?retryWrites=true&w=majority&appName=MUN';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => {
  console.error('Could not connect to MongoDB:', err);
  process.exit(1); // Exit if cannot connect to database
});

// Routes
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/forums', require('./routes/forums'));
app.use('/api/departments', require('./routes/departments'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 