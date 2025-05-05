const { calculateFitness, calculateEnhancedFitness } = require('./fitness');

// Sample timetable with more complex scenarios
const testTimetable = [
    // Monday Morning
    {
        id: '1',
        year: 'firstYear',
        branch: 'CSE',
        course: 'Math',
        teacher: 'Teacher1',
        room: 'Room1',
        day: 'Monday',
        time: '09:00-10:00',
        type: 'theory'
    },
    // Teacher conflict
    {
        id: '2',
        year: 'firstYear',
        branch: 'CSE',
        course: 'Physics',
        teacher: 'Teacher1', // Same teacher at same time
        room: 'Room2',
        day: 'Monday',
        time: '09:00-10:00',
        type: 'theory'
    },
    // Room conflict
    {
        id: '3',
        year: 'secondYear',
        branch: 'CSE',
        course: 'Chemistry',
        teacher: 'Teacher2',
        room: 'Room1', // Same room at same time
        day: 'Monday',
        time: '09:00-10:00',
        type: 'theory'
    },
    // Valid entry
    {
        id: '4',
        year: 'secondYear',
        branch: 'CSE',
        course: 'Biology',
        teacher: 'Teacher3',
        room: 'Room3',
        day: 'Monday',
        time: '10:00-11:00',
        type: 'theory'
    },
    // Lab session
    {
        id: '5',
        year: 'firstYear',
        branch: 'CSE',
        course: 'Programming Lab',
        teacher: 'Teacher4',
        room: 'Lab1',
        day: 'Monday',
        time: '11:00-13:00',
        type: 'lab'
    },
    // Lab conflict
    {
        id: '6',
        year: 'secondYear',
        branch: 'CSE',
        course: 'Chemistry Lab',
        teacher: 'Teacher5',
        room: 'Lab1', // Same lab at same time
        day: 'Monday',
        time: '11:00-13:00',
        type: 'lab'
    },
    // Consecutive classes for same batch
    {
        id: '7',
        year: 'firstYear',
        branch: 'CSE',
        course: 'English',
        teacher: 'Teacher6',
        room: 'Room4',
        day: 'Monday',
        time: '14:00-15:00',
        type: 'theory'
    },
    {
        id: '8',
        year: 'firstYear',
        branch: 'CSE',
        course: 'English',
        teacher: 'Teacher6',
        room: 'Room4',
        day: 'Monday',
        time: '15:00-16:00',
        type: 'theory'
    },
    // Teacher workload test
    {
        id: '9',
        year: 'thirdYear',
        branch: 'CSE',
        course: 'Database',
        teacher: 'Teacher1', // Same teacher again
        room: 'Room5',
        day: 'Monday',
        time: '16:00-17:00',
        type: 'theory'
    },
    // Tuesday classes
    {
        id: '10',
        year: 'firstYear',
        branch: 'CSE',
        course: 'Math',
        teacher: 'Teacher1',
        room: 'Room1',
        day: 'Tuesday',
        time: '09:00-10:00',
        type: 'theory'
    },
    {
        id: '11',
        year: 'secondYear',
        branch: 'CSE',
        course: 'Physics',
        teacher: 'Teacher2',
        room: 'Room2',
        day: 'Tuesday',
        time: '09:00-10:00',
        type: 'theory'
    }
];

console.log('Testing Simple Fitness Function:');
const simpleFitness = calculateFitness(testTimetable);
console.log('Fitness Score:', simpleFitness);

console.log('\nTesting Enhanced Fitness Function:');
const enhancedFitness = calculateEnhancedFitness(testTimetable);
console.log('Fitness Score:', enhancedFitness.score);
console.log('Total Violations:', enhancedFitness.details.totalViolations);
console.log('Violation Breakdown:', enhancedFitness.details.violationTypes); 