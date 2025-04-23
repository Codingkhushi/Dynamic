// routes/timetable.js
const express = require('express');
const router = express.Router();
const db = require('../models/faculty_db');

// Retrieve timetable for a specific branch and semester
router.get('/:branch_id/:semester_id', (req, res) => {
  const { branch_id, semester_id } = req.params;
  // Filter timetable entries based on branch_id and semester_id.
  // (Ensure that when generating the timetable, these fields are added.)
  const filteredTimetable = db.timetable.filter(entry => {
    return entry.branch_id == branch_id && entry.semester_id == semester_id;
  });
  res.status(200).json({ timetable: filteredTimetable });
});

// Retrieve the full timetable (if needed)
router.get('/', (req, res) => {
  res.status(200).json({ timetable: db.timetable });
});

module.exports = router;
