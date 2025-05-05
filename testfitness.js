const { calculateEnhancedFitness } = require('./timetable_schedular/fitness');

const timetable = [
  { day: 'Mon', time: '9AM', teacher: 'A', room: '101', year: '1', branch: 'CSE', type: 'theory' },
  { day: 'Mon', time: '9AM', teacher: 'A', room: '101', year: '1', branch: 'CSE', type: 'lab' },
  { day: 'Tue', time: '10AM', teacher: 'B', room: '102', year: '2', branch: 'ECE', type: 'lab' },
  { day: 'Tue', time: '10AM', teacher: 'C', room: '102', year: '2', branch: 'ECE', type: 'lab' },
  { day: 'Wed', time: '11AM', teacher: 'D', room: '103', year: '3', branch: 'MECH', type: 'lab' },
];

const result = calculateEnhancedFitness(timetable);

console.log("Final Fitness Score:", result.score);
console.log("Total Violations:", result.details.totalViolations);
console.log("Violation Types:", result.details.violationTypes);
