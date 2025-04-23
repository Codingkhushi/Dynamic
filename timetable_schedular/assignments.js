// assignments.js

function assignTeachers(course, teachers, branch) {
  console.log(`Assigning teacher for course: ${course.course} in branch: ${branch}`);
  if (!teachers) {
    throw new Error("Teachers array is undefined");
  }
  
  const availableTeachers = teachers.filter(teacher => {
    if (!teacher.subjects) return false;
    // Check if any subject in teacher.subjects matches the course name exactly and the branch
    const teachesCourse = teacher.subjects.some(subj => subj.course === course.course && subj.teachesTo.includes(branch));
    return teachesCourse;
  });
  
  if (availableTeachers.length === 0) {
    console.warn(`No teacher found for course: ${course.course} in branch: ${branch}`);
    return null;
  }
  
  const assignedTeacher = availableTeachers.sort((a, b) => (a.workload || 0) - (b.workload || 0))[0];
  console.log(`Assigned teacher: ${assignedTeacher.name} for course: ${course.course} in branch: ${branch}`);
  return assignedTeacher;
}

function assignRooms(course, classrooms, labs) {
  console.log(`Assigning room for course: ${course.course}`);
  let availableRooms;

  // Assign specific labs and courses to their designated rooms
  if (course.type === "lab") {
    switch (course.course) {
      case "DE":
        availableRooms = labs.filter(lab => lab.name === "IC Lab (Integrated Circuit)" || lab.name === "Advance EMI Lab (AEMI)");
        break;
      case "EC":
      case "EP":
        availableRooms = labs.filter(lab => lab.name === "AS Lab");
        break;
      case "BEE":
        availableRooms = labs.filter(lab => lab.name === "BE Lab (Basic Electronics Lab)");
        break;
      case "IOT":
      case "ML":
        availableRooms = labs.filter(lab => lab.name === "IoT Lab");
        break;
      case "Microcontroller":
      case "MaM":
        availableRooms = labs.filter(lab => lab.name === "Microprocessor Lab");
        break;
      default:
        availableRooms = labs;
        break;
    }
  } else {
    switch (course.course) {
      case "IPDC":
      case "IKS":
        availableRooms = classrooms.filter(room => room.name === "Conference Hall");
        break;
      default:
        availableRooms = classrooms;
        break;
    }
  }

  if (availableRooms && availableRooms.length > 0) {
    // Select a random room to reduce chance of conflict
    const randomIndex = Math.floor(Math.random() * availableRooms.length);
    const assignedRoom = availableRooms[randomIndex];
    assignedRoom.occupied = true;
    console.log(`Assigned room: ${assignedRoom.name} for course: ${course.course}`);
    return assignedRoom;
  }
  console.warn(`No room found for course: ${course.course}`);
  return null;
}

module.exports = { assignTeachers, assignRooms };
