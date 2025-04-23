// validation.js

/**
 * Validates a single, global timetable (all years & branches).
 * Returns an array of conflict strings; empty if none.
 */
function validateTimetable(timetable) {
    const teacherSchedule = {}; // key -> first entry
    const roomSchedule    = {};
    const batchSchedule   = {};
    const conflicts       = [];
  
    // Helper to humanize 'firstYear' → 'First Year'
    const formatYear = yearStr => {
      switch (yearStr) {
        case 'firstYear':  return 'First Year';
        case 'secondYear': return 'Second Year';
        case 'thirdYear':  return 'Third Year';
        case 'fourthYear': return 'Fourth Year';
        default:           return yearStr;
      }
    };
  
    timetable.forEach(entry => {
      const slotKey = `${entry.day}-${entry.time}`;
  
      // 1) Teacher conflict
      const teacherKey = `${entry.teacher}-${slotKey}`;
      if (!teacherSchedule[teacherKey]) {
        teacherSchedule[teacherKey] = entry;
      } else {
        const prev = teacherSchedule[teacherKey];
        conflicts.push(
          `Cannot schedule ${entry.course} taught by ${entry.teacher} at ${slotKey}: ` +
          `teacher is already teaching ${prev.course} to ${prev.branch} (${formatYear(prev.year)}) ` +
          `in room ${prev.room}.`
        );
      }
  
      // 2) Room conflict
      const roomKey = `${entry.room}-${slotKey}`;
      if (!roomSchedule[roomKey]) {
        roomSchedule[roomKey] = entry;
      } else {
        const prev = roomSchedule[roomKey];
        conflicts.push(
          `Cannot schedule ${entry.course} in room ${entry.room} at ${slotKey}: ` +
          `room is occupied by ${prev.course} taught by ${prev.teacher} ` +
          `for ${prev.branch} (${formatYear(prev.year)}).`
        );
      }
  
      // 3) Batch (branch+year) conflict
      const batchKey = `${entry.branch}-${entry.year}-${slotKey}`;
      if (!batchSchedule[batchKey]) {
        batchSchedule[batchKey] = entry;
      } else {
        const prev = batchSchedule[batchKey];
        conflicts.push(
          `Cannot schedule ${entry.course} for ${entry.branch} (${formatYear(entry.year)}) at ${slotKey}: ` +
          `batch already has ${prev.course} taught by ${prev.teacher} in room ${prev.room}.`
        );
      }
    });
  
    if (conflicts.length === 0) {
      console.log("✅ Timetable validation passed!");
    } else {
      console.log("❌ Timetable validation found issues:", conflicts);
    }
  
    return conflicts;
  }
  
  module.exports = { validateTimetable };
  