const express = require('express');
const router = express.Router();
const { OddCourses, EvenCourses } = require('../models/db.js');

// Helper function to flatten courses by year and branch
function flattenCourses(courses) {
  const flattened = [];
  for (const year in courses) {
    for (const branch in courses[year]) {
      courses[year][branch].forEach(course => {
        flattened.push({
          year,
          branch,
          course: course.course,
          type: course.type,
        });
      });
    }
  }
  return flattened;
}

// API endpoint to get odd semester courses
router.get('/courses/odd', (req, res) => {
  try {
    const flattenedOddCourses = flattenCourses(OddCourses); // Flatten the nested structure
    res.status(200).json(flattenedOddCourses); // Send a flat array
  } catch (error) {
    console.error("Error fetching odd semester courses:", error);
    res.status(500).json({ error: "Failed to fetch odd semester courses" });
  }
});

// API endpoint to get even semester courses
router.get('/courses/even', (req, res) => {
  try {
    const flattenedEvenCourses = flattenCourses(EvenCourses); // Flatten the nested structure
    res.status(200).json(flattenedEvenCourses); // Send a flat array
  } catch (error) {
    console.error("Error fetching even semester courses:", error);
    res.status(500).json({ error: "Failed to fetch even semester courses" });
  }
});

module.exports = router;