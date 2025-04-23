const { validateTimetable } = require("./validation");
function calculateEnhancedFitness(timetable) {
    const violations = {
    teacherConflicts: 0,
    roomConflicts: 0,
    classConflicts: 0,
    labConstraints: 0
    };
    
    // Track allocations to detect conflicts
    const teacherAllocations = new Map();
    const roomAllocations = new Map();
    const classAllocations = new Map();
    
    timetable.forEach(entry => {
    const timeKey = `${entry.day}-${entry.time}`;
      // Check teacher conflicts
    if (!teacherAllocations.has(timeKey)) {
        teacherAllocations.set(timeKey, new Set());
    }
    if (teacherAllocations.get(timeKey).has(entry.teacher)) {
        violations.teacherConflicts++;
    }
    teacherAllocations.get(timeKey).add(entry.teacher);
      // Check room conflicts
    if (!roomAllocations.has(timeKey)) {
        roomAllocations.set(timeKey, new Set());
    }
    if (roomAllocations.get(timeKey).has(entry.room)) {
        violations.roomConflicts++;
    }
    roomAllocations.get(timeKey).add(entry.room);
    
      // Check class conflicts
    const classKey = `${entry.year}-${entry.branch}`;
    if (!classAllocations.has(timeKey)) {
        classAllocations.set(timeKey, new Set());
    }
    if (classAllocations.get(timeKey).has(classKey)) {
        violations.classConflicts++;
    }
    classAllocations.get(timeKey).add(classKey);
      // Check lab constraints
    if (entry.type === "lab" && !entry.time.includes("-")) {
        violations.labConstraints++; // Labs should have timespan format
    }
    });
    
    const totalViolations =
    violations.teacherConflicts +
    violations.roomConflicts +
    violations.classConflicts +
    violations.labConstraints;
    
    // Calculate score - decrease from 1.0 based on violations
    const score = Math.max(0, 1.0 - (totalViolations * 0.01));
    
    return {
    score,
    details: {
        totalViolations,
        violationTypes: violations
    }
    };
}
function calculateFitness(timetable) {
    if (!timetable || timetable.length === 0) {
      return 0; // Empty timetable has zero fitness
    }
    const conflicts = validateTimetable(timetable);
    
    // Start with perfect fitness and deduct for conflicts
    let fitness = 1.0;
    
    // Deduct for each conflict
    fitness -= (conflicts.length * 0.05);
    
    // Add a small penalty for incomplete timetables
    // Adjust the target size based on your expectations
    const targetSize = 100; // Example target size
    if (timetable.length < targetSize) {
      fitness -= 0.2 * (1 - timetable.length / targetSize);
    }
    
    return Math.max(0, fitness);
}


module.exports = { calculateEnhancedFitness, calculateFitness };
