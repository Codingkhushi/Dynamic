const db = require('../models/db');
const Constraints = require('../models/constraintsSchema');
async function loadConfig() {
  return (await Constraints.findOne()) || await new Constraints().save();
}
// helper to parse “HH:MM” → decimal hours
function parseTime(t) {
  const [h,m] = t.split(':').map(Number);
  return h + m/60;
}

async function applyConstraints(timetable) {
    const cfg = await loadConfig(); 
    const teacherSchedule = {};
    const roomSchedule = {};
    const labSchedule = {};
    const courseLastScheduled = {};
    const teacherWorkload = {};
    const courseCount = {};

    timetable.forEach(entry => {
        const { teacher, room, day, time, course, type } = entry;
        const slotKey = `${day}-${time}`;

        // 1. Prevent overlapping classes in the same room
        if (!roomSchedule[slotKey]) roomSchedule[slotKey] = new Set();
        if (roomSchedule[slotKey].has(room)) {
            throw new Error(`Room ${room} is already occupied at ${slotKey}.`);
        }
        roomSchedule[slotKey].add(room);

        // 2. Ensure teachers don’t have two classes at the same time
        const teacherKey = `${teacher}-${day}-${time}`;
        if (teacherSchedule[teacherKey]) {
            throw new Error(`Teacher ${teacher} has multiple classes scheduled at ${day}-${time}.`);
        }
        teacherSchedule[teacherKey] = true;

        // 3. Ensuring labs are not overlapping at the same time
        if (room.includes("Lab")) {
            if (!labSchedule[slotKey]) labSchedule[slotKey] = new Set();
            if (labSchedule[slotKey].has(room)) {
                throw new Error(`Lab ${room} is already scheduled at ${slotKey}.`);
            }
            labSchedule[slotKey].add(room);
        }

        // 4. Teacher Workload Limits (e.g., max 5 classes per day)
        const teacherDayKey = `${day}-${teacher}`;
            if (!teacherWorkload[teacherDayKey]) teacherWorkload[teacherDayKey] = 0;
            teacherWorkload[teacherDayKey]++;
            if (cfg.maxClassesPerTeacherPerDay) {
              if (teacherWorkload[teacherDayKey] > cfg.maxClassesPerTeacherPerDay) {
                throw new Error(
                  `Teacher ${teacher} exceeds daily limit (${cfg.maxClassesPerTeacherPerDay}) on ${day}.`
                );
              }
        }
        // 5. Course Repetition Rules (Avoid back-to-back same course)
       // 5. Course Repetition (optional via cfg)
    const courseKey = `${day}-${course}`;
    if (cfg.noBackToBackSameCourse) {
      if (courseLastScheduled[courseKey] === time) {
        throw new Error(`Course ${course} is scheduled consecutively on ${day}.`);
      }
    }
    courseLastScheduled[courseKey] = time;

        // 6–8. Dynamic session rules (duration & weekly count)
        const rule = cfg.sessionRules[type] || {};
    
        // weekly count
        courseCount[course] = (courseCount[course] || 0) + 1;
        if (rule.weeklyCount && courseCount[course] > rule.weeklyCount) {
          throw new Error(
            `Course ${course} exceeds ${rule.weeklyCount} sessions/week for type '${type}'.`
          );
        }
    
        // duration
        if (rule.duration) {
          const [start, end] = time.split('-');
          const diff = parseTime(end) - parseTime(start);
          if (diff !== rule.duration) {
            throw new Error(
              `Course ${course} must have a ${rule.duration}-hour session.`
            );
          }
        }

        if (`${time}` === `${cfg.lunchBreak.start}-${cfg.lunchBreak.end}`) {
                  throw new Error(`Time slot ${time} is reserved for lunch break.`);
                }
    });
}

module.exports = { applyConstraints };
