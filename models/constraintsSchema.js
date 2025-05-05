// models/constraintsSchema.js
const mongoose = require('mongoose');

const ConstraintsSchema = new mongoose.Schema({
  // → Which weekdays to schedule (user can pick Mon–Sun)
  workingDays: {
    type: [String],
    required: true,
    default: ["Monday","Tuesday","Wednesday","Thursday","Friday"]
  },
  // → What hours are “school hours”
  workingHours: {
    start: { type: String, required: true, default: "08:30" },
    end:   { type: String, required: true, default: "17:15" }
  },
  // → Where to carve out lunch
  lunchBreak: {
    start: { type: String, required: true, default: "12:30" },
    end:   { type: String, required: true, default: "13:15" }
  },
  // → How many classes/day before we warn
  maxClassesPerTeacherPerDay: {
    type: Number, required: true, default: 5
  },
  // → Prevent scheduling same course twice in a row
  noBackToBackSameCourse: {
    type: Boolean, required: true, default: true
  },
  // → Duration & weekly count per “type” (theory, lab, both)
  sessionRules: {
    type: Object,
    required: true,
    default: {
      non:  { duration: 1, weeklyCount: 3 },
      lab:  { duration: 1, weeklyCount: 2 },
      both: { duration: 1, weeklyCount: 4 }
    }
  }
});

module.exports = mongoose.model('Constraints', ConstraintsSchema);
