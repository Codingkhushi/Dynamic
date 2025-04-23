// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../models/faculty_db');
const scheduler = require('../timetable_schedular/scheduler');

// Add a new course
router.post('/courses', (req, res) => {
  const { branch_id, semester_id, course_name, course_type } = req.body;
  if (!branch_id || !semester_id || !course_name || !course_type) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const newCourse = {
    id: db.courses.length + 1,
    branch_id,
    semester_id,
    course_name,
    course_type,
  };
  db.courses.push(newCourse);
  res.status(201).json({ message: 'Course added successfully', course: newCourse });
});

// Add a new teacher
router.post('/teachers', (req, res) => {
  const { teacher_name } = req.body;
  if (!teacher_name) {
    return res.status(400).json({ message: 'Missing teacher name' });
  }
  const newTeacher = {
    id: db.teachers.length + 1,
    teacher_name,
  };
  db.teachers.push(newTeacher);
  res.status(201).json({ message: 'Teacher added successfully', teacher: newTeacher });
});

// Add a new room (classroom or lab)
router.post('/rooms', (req, res) => {
  const { room_name, capacity, room_type } = req.body;
  if (!room_name || !capacity || !room_type) {
    return res.status(400).json({ message: 'Missing required room fields' });
  }
  const newRoom = {
    id: db.rooms.length + 1,
    room_name,
    capacity,
    room_type,
  };
  db.rooms.push(newRoom);
  res.status(201).json({ message: 'Room added successfully', room: newRoom });
});

// Trigger timetable generation
router.post('/generate-timetable', (req, res) => {
  try {
    const timetable = scheduler.generateTimetable(db);
    db.timetable = timetable;  // Save the generated timetable in our “database”
    res.status(200).json({ message: 'Timetable generated successfully', timetable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating timetable', error: error.message });
  }
});

module.exports = router;
