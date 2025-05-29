const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Intra', 'Inter', 'Public'],
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: function() {
      return this.type === 'Intra';
    }
  },
  departments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: function() {
      return this.type === 'Inter';
    }
  }],
  topics: [{
    title: String,
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    posts: [{
      content: String,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Forum', forumSchema); 