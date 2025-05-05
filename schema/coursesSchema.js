const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define the global schema without defaults
const globalSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  branches: {
    type: [String],  // Array of branch names like 'CST', 'IT', etc.
    required: true,
  },
  classrooms: {
    type: [Object],
    required: true,
  },
  labs: {
    type: [Object],  // Array of lab identifiers like 'Lab 1', 'Lab 2', etc.
    required: true,
  },
  EvenCourses: {
    type: Object,  // Empty object that can dynamically store data
    required: true,
  },
  faculty: {
    type: [Object],  // Array of faculty names like 'Dr. Smith', 'Prof. Johnson', etc.
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('GlobalData', globalSchema);
