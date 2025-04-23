function applyConstraints(timetable) {
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
        if (teacherWorkload[teacherDayKey] > 5) {
            throw new Error(`Teacher ${teacher} exceeds daily workload limit on ${day}.`);
        }

        // 5. Course Repetition Rules (Avoid back-to-back same course)
        const courseKey = `${day}-${course}`;
        if (courseLastScheduled[courseKey] === time) {
            throw new Error(`Course ${course} is scheduled consecutively on ${day}.`);
        }
        courseLastScheduled[courseKey] = time;

        // 6. Ensure project and non-theory subjects have only 1 lecture per week
        if (!courseCount[course]) courseCount[course] = 0;
        courseCount[course]++;
        if (course === "Project" || type === "non") {
            if (courseCount[course] > 1) {
                throw new Error(`Course ${course} exceeds the limit of 1 lecture per week.`);
            }
        }

        // 7. Ensure theory and lab subjects have 3 lectures and 1 lab session per week
        if (type === "both") {
            if (courseCount[course] > 4) {
                throw new Error(`Course ${course} exceeds the limit of 3 lectures and 1 lab session per week.`);
            }
        }

        // 8. Ensure all theory lectures are 1 hour long and in classrooms
        if (type === "non" || type === "lab" || type === "both") {
            if (!db.classrooms.some(classroom => classroom.name === room)) {
                throw new Error(`Course ${course} must be scheduled in a classroom.`);
            }
            if (time.split('-')[1] - time.split('-')[0] !== 1) {
                throw new Error(`Course ${course} must have a 1-hour lecture.`);
            }
        }

        // 9. Ensure consistent breaks (e.g., lunch break)
        if (time === "12:30-01:15") {
            throw new Error(`Time slot ${time} is reserved for lunch break.`);
        }
    });
}

module.exports = { applyConstraints };
