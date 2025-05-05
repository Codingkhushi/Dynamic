const { validateTimetable } = require("./validation");

function calculateEnhancedFitness(timetable) {
    // Hard constraints - violations that make a timetable invalid
    const hardViolations = {
        teacherConflicts: 0,
        roomConflicts: 0,
        classConflicts: 0,
        labConstraints: 0,
        consecutiveClasses: 0,
        teacherWorkload: 0
    };
    
    // Soft constraints - preferences that affect timetable quality
    const softViolations = {
        teacherGaps: 0,         // Gaps in teacher schedules
        studentGaps: 0,         // Gaps in student schedules
        lateAfternoonClasses: 0, // Classes scheduled late in the day
        unevenDistribution: 0,   // Uneven distribution of classes across the week
        consecutiveDifferentRooms: 0, // Students need to change rooms for consecutive classes
        preferredTimeViolations: 0    // Teachers not assigned to preferred times
    };
    
    // Track allocations to detect conflicts
    const teacherAllocations = new Map();
    const roomAllocations = new Map();
    const classAllocations = new Map();
    const teacherDailyWorkload = new Map();
    
    // Track daily class distribution for each class (year-branch)
    const classDailyDistribution = new Map();
    
    // Track teacher daily schedules for gap analysis
    const teacherDailySchedules = new Map();
    
    // Track student (class) daily schedules for gap analysis
    const studentDailySchedules = new Map();
    
    // Preferred times for teachers (example - would come from your database)
    const teacherPreferredTimes = new Map([
        // Just some example data - replace with actual preferences
        ["Ms Sonali Bodekar", { preferred: ["09:00-10:00", "10:00-11:00"], avoid: ["16:00-17:00"] }],
        ["Ms. Prachi Dhanawat", { preferred: ["11:00-12:00", "12:00-13:00"], avoid: ["08:00-09:00"] }]
    ]);
    
    // Process each entry to check for hard constraint violations
    timetable.forEach(entry => {
        const timeKey = `${entry.day}-${entry.time}`;
        const teacherDayKey = `${entry.day}-${entry.teacher}`;
        const classDayKey = `${entry.day}-${entry.year}-${entry.branch}`;
        
        // Check teacher conflicts (hard constraint)
        if (!teacherAllocations.has(timeKey)) {
            teacherAllocations.set(timeKey, new Set());
        }
        if (teacherAllocations.get(timeKey).has(entry.teacher)) {
            hardViolations.teacherConflicts++;
        }
        teacherAllocations.get(timeKey).add(entry.teacher);
        
        // Check room conflicts (hard constraint)
        if (!roomAllocations.has(timeKey)) {
            roomAllocations.set(timeKey, new Set());
        }
        if (roomAllocations.get(timeKey).has(entry.room)) {
            hardViolations.roomConflicts++;
        }
        roomAllocations.get(timeKey).add(entry.room);
        
        // Check class conflicts (hard constraint)
        const classKey = `${entry.year}-${entry.branch}`;
        if (!classAllocations.has(timeKey)) {
            classAllocations.set(timeKey, new Set());
        }
        if (classAllocations.get(timeKey).has(classKey)) {
            hardViolations.classConflicts++;
        }
        classAllocations.get(timeKey).add(classKey);
        
        // Check lab constraints (hard constraint)
        if (entry.type === "lab" && !entry.time.includes("-")) {
            hardViolations.labConstraints++;
        }
        
        // Track teacher daily workload (hard constraint)
        if (!teacherDailyWorkload.has(teacherDayKey)) {
            teacherDailyWorkload.set(teacherDayKey, 0);
        }
        teacherDailyWorkload.set(teacherDayKey, teacherDailyWorkload.get(teacherDayKey) + 1);
        if (teacherDailyWorkload.get(teacherDayKey) > 5) { // Max 5 classes per day
            hardViolations.teacherWorkload++;
        }
        
        // Track daily class distribution (for soft constraint)
        if (!classDailyDistribution.has(classKey)) {
            classDailyDistribution.set(classKey, new Map());
        }
        if (!classDailyDistribution.get(classKey).has(entry.day)) {
            classDailyDistribution.get(classKey).set(entry.day, 0);
        }
        classDailyDistribution.get(classKey).set(
            entry.day, 
            classDailyDistribution.get(classKey).get(entry.day) + 1
        );
        
        // Track teacher schedules (for gap analysis)
        if (!teacherDailySchedules.has(teacherDayKey)) {
            teacherDailySchedules.set(teacherDayKey, []);
        }
        teacherDailySchedules.get(teacherDayKey).push({
            time: entry.time,
            room: entry.room
        });
        
        // Track student schedules (for gap analysis)
        if (!studentDailySchedules.has(classDayKey)) {
            studentDailySchedules.set(classDayKey, []);
        }
        studentDailySchedules.get(classDayKey).push({
            time: entry.time,
            room: entry.room
        });
        
        // Check for late afternoon classes (soft constraint)
        const timeStart = entry.time.split('-')[0];
        if (timeStart.startsWith('15:') || timeStart.startsWith('16:')) {
            softViolations.lateAfternoonClasses++;
        }
        
        // Check for preferred time violations (soft constraint)
        if (teacherPreferredTimes.has(entry.teacher)) {
            const prefs = teacherPreferredTimes.get(entry.teacher);
            if (prefs.avoid && prefs.avoid.includes(entry.time)) {
                softViolations.preferredTimeViolations++;
            }
            // Could also check if they're NOT in preferred times, if enough preferred times exist
        }
    });
    
    // Check for consecutive classes of the same course (hard constraint)
    const sortedTimetable = [...timetable].sort((a, b) => {
        if (a.day !== b.day) return a.day.localeCompare(b.day);
        return a.time.localeCompare(b.time);
    });
    
    for (let i = 0; i < sortedTimetable.length - 1; i++) {
        const current = sortedTimetable[i];
        const next = sortedTimetable[i + 1];
        
        if (current.day === next.day && 
            current.year === next.year && 
            current.branch === next.branch) {
            
            // Check for same course scheduled consecutively (hard constraint)
            if (current.course === next.course) {
                hardViolations.consecutiveClasses++;
            }
            
            // Check for consecutive classes in different rooms (soft constraint)
            if (current.room !== next.room) {
                // Check if times are consecutive
                const currentEndTime = current.time.split('-')[1];
                const nextStartTime = next.time.split('-')[0];
                if (currentEndTime === nextStartTime) {
                    softViolations.consecutiveDifferentRooms++;
                }
            }
        }
    }
    
    // Post-process for gaps in schedules (soft constraints)
    teacherDailySchedules.forEach((schedule, key) => {
        if (schedule.length > 1) {
            // Sort by start time
            schedule.sort((a, b) => a.time.split('-')[0].localeCompare(b.time.split('-')[0]));
            
            // Count gaps
            let gaps = 0;
            for (let i = 0; i < schedule.length - 1; i++) {
                const currentEndTime = schedule[i].time.split('-')[1];
                const nextStartTime = schedule[i+1].time.split('-')[0];
                if (currentEndTime !== nextStartTime) {
                    gaps++;
                }
            }
            
            // Add to soft violations
            softViolations.teacherGaps += gaps;
        }
    });
    
    // Check for gaps in student schedules
    studentDailySchedules.forEach((schedule, key) => {
        if (schedule.length > 1) {
            // Sort by start time
            schedule.sort((a, b) => a.time.split('-')[0].localeCompare(b.time.split('-')[0]));
            
            // Count gaps
            let gaps = 0;
            for (let i = 0; i < schedule.length - 1; i++) {
                const currentEndTime = schedule[i].time.split('-')[1];
                const nextStartTime = schedule[i+1].time.split('-')[0];
                if (currentEndTime !== nextStartTime) {
                    gaps++;
                }
            }
            
            // Add to soft violations
            softViolations.studentGaps += gaps;
        }
    });
    
    // Check for uneven distribution of classes across days
    classDailyDistribution.forEach((dayMap, classKey) => {
        const days = Array.from(dayMap.keys());
        const counts = Array.from(dayMap.values());
        
        if (days.length > 0) {
            // Calculate standard deviation to measure evenness
            const avg = counts.reduce((sum, count) => sum + count, 0) / counts.length;
            const variance = counts.reduce((sum, count) => sum + Math.pow(count - avg, 2), 0) / counts.length;
            const stdDev = Math.sqrt(variance);
            
            // Penalize high standard deviation (uneven distribution)
            softViolations.unevenDistribution += stdDev * 2;
        }
    });
    
    // Calculate total violations with appropriate weights
    const totalHardViolations = 
        hardViolations.teacherConflicts * 1.0 + 
        hardViolations.roomConflicts * 0.8 +
        hardViolations.classConflicts * 0.8 +
        hardViolations.labConstraints * 0.6 +
        hardViolations.consecutiveClasses * 0.4 +
        hardViolations.teacherWorkload * 0.4;
    
    const totalSoftViolations = 
        softViolations.teacherGaps * 0.05 +
        softViolations.studentGaps * 0.08 +
        softViolations.lateAfternoonClasses * 0.03 +
        softViolations.unevenDistribution * 0.05 +
        softViolations.consecutiveDifferentRooms * 0.04 +
        softViolations.preferredTimeViolations * 0.05;
    
    // Calculate final score - hard constraints have much higher impact
    const hardConstraintScore = Math.max(0, 1.0 - (totalHardViolations * 0.1));
    const softConstraintScore = Math.max(0, 1.0 - (totalSoftViolations * 0.01));
    
    // Combined score (80% from hard constraints, 20% from soft constraints)
    const score = (hardConstraintScore * 0.8) + (softConstraintScore * 0.2);
    
    return {
        score,
        details: {
            hardConstraintScore,
            softConstraintScore,
            totalHardViolations,
            totalSoftViolations,
            hardViolations,
            softViolations
        }
    };
}

// Original fitness function from your code
function calculateFitness(timetable) {
    if (!timetable || timetable.length === 0) {
        return 0; // Empty timetable has zero fitness
    }
    
    const conflicts = validateTimetable(timetable);
    
    // Start with perfect fitness and deduct for conflicts
    let fitness = 1.0;
    
    // Deduct for each conflict with adjusted weights
    fitness -= (conflicts.length * 0.1); // Increased penalty per conflict
    
    // Add a small penalty for incomplete timetables
    const targetSize = 100; // Example target size
    if (timetable.length < targetSize) {
        fitness -= 0.3 * (1 - timetable.length / targetSize); // Increased penalty for incompleteness
    }
    
    return Math.max(0, fitness);
}

module.exports = { calculateEnhancedFitness, calculateFitness };