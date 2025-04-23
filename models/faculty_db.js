console.log("Loading faculty_db.js...");

// faculty_db.js
const mongoose = require('mongoose');
const GlobalData = require('../schema/coursesSchema');
const dotenv = require('dotenv');
dotenv.config();

const facultyDB = { teachers: [] };

const ready = (async () => {
  try {
    const globalDoc = await GlobalData.findOne();
    if (globalDoc) {
      facultyDB.teachers = globalDoc.faculty || [];
    }
  } catch (err) {
    console.error('Error loading faculty data:', err);
  }
})();

module.exports = facultyDB;
module.exports.ready = ready;
