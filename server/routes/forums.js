const express = require('express');
const router = express.Router();
const Forum = require('../models/Forum');

// Get all forums
router.get('/', async (req, res) => {
  try {
    const forums = await Forum.find()
      .populate('department', 'name')
      .populate('departments', 'name')
      .populate({
        path: 'topics.author',
        select: 'name',
        model: 'User'
      })
      .populate({
        path: 'topics.posts.author',
        select: 'name',
        model: 'User'
      })
      .lean();

    // Handle null author fields
    const processedForums = forums.map(forum => ({
      ...forum,
      topics: forum.topics.map(topic => ({
        ...topic,
        author: topic.author || { name: 'Anonymous' },
        posts: topic.posts.map(post => ({
          ...post,
          author: post.author || { name: 'Anonymous' }
        }))
      }))
    }));

    res.json({
      success: true,
      data: processedForums
    });
  } catch (error) {
    console.error('Error fetching forums:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forums',
      error: error.message
    });
  }
});

// Get a single forum
router.get('/:id', async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id)
      .populate('department', 'name')
      .populate('departments', 'name')
      .populate('topics.author', 'name')
      .populate('topics.posts.author', 'name')
      .lean();

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum not found'
      });
    }

    res.json({
      success: true,
      data: forum
    });
  } catch (error) {
    console.error('Error fetching forum:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forum',
      error: error.message
    });
  }
});

// Create a new forum
router.post('/', async (req, res) => {
  try {
    const forum = new Forum({
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      department: req.body.department,
      departments: req.body.departments
    });

    const newForum = await forum.save();
    const populatedForum = await Forum.findById(newForum._id)
      .populate('department', 'name')
      .populate('departments', 'name')
      .lean();

    res.status(201).json({
      success: true,
      data: populatedForum
    });
  } catch (error) {
    console.error('Error creating forum:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create forum',
      error: error.message
    });
  }
});

// Update a forum
router.patch('/:id', async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id);
    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum not found'
      });
    }

    Object.keys(req.body).forEach(key => {
      forum[key] = req.body[key];
    });

    const updatedForum = await forum.save();
    const populatedForum = await Forum.findById(updatedForum._id)
      .populate('department', 'name')
      .populate('departments', 'name')
      .lean();

    res.json({
      success: true,
      data: populatedForum
    });
  } catch (error) {
    console.error('Error updating forum:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update forum',
      error: error.message
    });
  }
});

// Delete a forum
router.delete('/:id', async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id);
    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum not found'
      });
    }

    await forum.deleteOne();
    res.json({
      success: true,
      message: 'Forum deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting forum:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete forum',
      error: error.message
    });
  }
});

// @route   GET api/forums/:id/messages
// @desc    Get messages for a forum
// @access  Public (temporarily)
router.get('/:id/messages', async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id).populate({
      path: 'topics.posts.author',
      select: 'name avatar' // Select name and avatar fields from the User model
    });

    if (!forum) {
      return res.status(404).json({
        success: false,
        message: 'Forum not found'
      });
    }

    // Extract all posts from all topics and flatten into a single array
    const allMessages = forum.topics.reduce((messages, topic) => {
      if (topic.posts) {
        return messages.concat(topic.posts.map(post => ({
          _id: post._id,
          text: post.content,
          createdAt: post.createdAt,
          author: post.author // author will be populated with { _id, name, avatar }
        })));
      }
      return messages;
    }, []);

    // Sort messages by createdAt timestamp
    allMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    res.json({
      success: true,
      data: allMessages
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 