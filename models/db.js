console.log("Loading db.js...");

// db.js
const mongoose = require('mongoose');
const GlobalData = require('../schema/coursesSchema');
const dotenv = require('dotenv');
dotenv.config();

const data = {
    branches: [],
    classrooms: [],
    labs: [],
    EvenCourses: {}
  };
  
  const ready = (async () => {
    try {
      const globalDoc = await GlobalData.findOne();
      if (globalDoc) {
        data.branches = globalDoc.branches || [];
        data.classrooms = globalDoc.classrooms || [];
        data.labs = globalDoc.labs || [];
        data.EvenCourses = globalDoc.EvenCourses || {};
      }
    } catch (err) {
      console.error('Error loading db data:', err);
    }
  })();
  
  module.exports = data;
  module.exports.ready = ready;
  