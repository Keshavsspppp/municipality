const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const { check, validationResult } = require('express-validator');
const { io } = require('../index'); // Import io instance

// @route   GET api/departments
// @desc    Get all departments
// @access  Public
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 }).populate('activeProjects');
    res.json({
      success: true,
      data: departments
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET api/departments/:id
// @desc    Get department by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    res.json({
      success: true,
      data: department
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST api/departments
// @desc    Create a department
// @access  Public (temporarily)
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('code', 'Code is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const { name, code, description, head, contactEmail, contactPhone } = req.body;

      // Check if department with same code already exists
      let department = await Department.findOne({ code });
      if (department) {
        return res.status(400).json({
          success: false,
          message: 'Department with this code already exists'
        });
      }

      department = new Department({
        name,
        code,
        description,
        head,
        contactEmail,
        contactPhone
      });

      await department.save();
      io.emit('departmentCreated', department); // Emit event

      res.json({
        success: true,
        data: department
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @route   PATCH api/departments/:id
// @desc    Update a department
// @access  Public (temporarily)
router.patch(
  '/:id',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('code', 'Code is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const { name, code, description, head, contactEmail, contactPhone } = req.body;

      // Check if department exists
      let department = await Department.findById(req.params.id);
      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }

      // Check if code is being changed and if it's already in use
      if (code !== department.code) {
        const existingDepartment = await Department.findOne({ code });
        if (existingDepartment) {
          return res.status(400).json({
            success: false,
            message: 'Department with this code already exists'
          });
        }
      }

      // Update department
      department = await Department.findByIdAndUpdate(
        req.params.id,
        {
          name,
          code,
          description,
          head,
          contactEmail,
          contactPhone
        },
        { new: true }
      );
      io.emit('departmentUpdated', department); // Emit event

      res.json({
        success: true,
        data: department
      });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
);

// @route   DELETE api/departments/:id
// @desc    Delete a department
// @access  Public (temporarily)
router.delete('/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    await department.deleteOne();
    io.emit('departmentDeleted', req.params.id); // Emit event

    res.json({
      success: true,
      message: 'Department removed'
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 