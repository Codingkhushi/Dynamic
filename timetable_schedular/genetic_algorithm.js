
const { assignTeachers, assignRooms } = require("./assignments");
const { validateTimetable } = require("./validation");
const { applyConstraints } = require("./constraints");
const db = require("../models/db");
const facultyDB = require("../models/faculty_db");
const { calculateEnhancedFitness, calculateFitness } = require("./fitness");
const { v4: uuidv4 } = require('uuid');

// Reduce population size to limit memory usage
const POPULATION_SIZE = 20;
const GENERATIONS = 200;
const MUTATION_RATE = 0.05;
const ELITE_SIZE = 3;
const MAX_EXECUTION_TIME = 60000; // 60 seconds max
const MAX_ATTEMPTS_PER_COURSE = 15;

// Helper function to check if a room is a lab
function isLabRoom(room) {
  return room.toLowerCase().includes('lab');
}

// Helper function to get consecutive time slots
function getConsecutiveSlots(slots, currentIndex) {
  if (currentIndex >= slots.length - 1) return null;
  const currentSlot = slots[currentIndex];
  const nextSlot = slots[currentIndex + 1];
  
  // Parse times
  const currentEnd = currentSlot.split('-')[1];
  const nextStart = nextSlot.split('-')[0];
  
  // Check if slots are consecutive
  if (currentEnd === nextStart) {
    return `${currentSlot.split('-')[0]}-${nextSlot.split('-')[1]}`;
  }
  return null;
}

// Helper function to shuffle array randomly
function shuffleArray(array) {
  const newArray = [...array]; // Create a copy to avoid modifying original
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Helper function to get random item from array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to create empty weekly schedule template
function createWeeklyTemplate() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "08:30-9:30", "9:30-10:30", "10:30-11:30", "11:30-12:30",
    "01:15-02:15", "02:15-03:15", "03:15-04:15", "04:15-05:15"
  ];
  
  const template = {};
  days.forEach(day => {
    template[day] = [...timeSlots];
  });
  return template;
}

// Helper function to check if a slot is available
function isSlotAvailable(scheduleMap, entry) {
  const key = `${entry.day}-${entry.time}`;
  const existing = scheduleMap.get(key) || [];
  
  // Check for conflicts
  return !existing.some(e =>
    e.teacher === entry.teacher || // Same teacher
    e.room === entry.room || // Same room
    (e.branch === entry.branch && e.year === entry.year) || // Same branch and year
    (e.room.toLowerCase().includes('lab') && entry.room.toLowerCase().includes('lab')) // Lab conflict
  );
}

// Helper function to distribute courses across week
function distributeCourseAcrossDays(course, availableSlots, scheduleMap, teachers, rooms, labs) {
  
  const entries = [];
  const daysUsed = new Set();
  let slotsNeeded = course.requiredSlots;
  const maxAttemptsPerSlot = 10;
  const maxTotalAttempts = 50; // Add maximum total attempts
  let totalAttempts = 0;

  // Try to distribute across different days
  while (slotsNeeded > 0 && totalAttempts < maxTotalAttempts) {
    totalAttempts++;
    let slotFound = false;
    let attempts = 0;

    // Get available days that haven't been used yet
    const availableDays = Object.keys(availableSlots).filter(day => 
      availableSlots[day].length > 0 && 
      (slotsNeeded > 3 || !daysUsed.has(day))
    );

    if (availableDays.length === 0) {
      console.log(`No available days left for ${course.course} (${course.branch})`);
      break;
    }

    const randomDay = getRandomItem(availableDays);
    
    while (!slotFound && attempts < maxAttemptsPerSlot) {
      attempts++;

      if (availableSlots[randomDay].length === 0) break;

      const randomSlotIndex = Math.floor(Math.random() * availableSlots[randomDay].length);
      const timeSlot = availableSlots[randomDay][randomSlotIndex];

      // Assign appropriate room and teacher
      const teacher = course.type === "lab" 
        ? assignTeachers(course, shuffleArray([...teachers]), course.branch)
        : assignTeachers(course, shuffleArray([...teachers.filter(t => 
            !entries.some(e => e.teacher === t.name && e.day === randomDay)
          )]), course.branch);

      const room = course.type === "lab"
        ? assignRooms(course, [], shuffleArray([...labs]))
        : assignRooms(course, shuffleArray([...rooms]), []);

      if (!teacher || !room) {
        console.log(`No available teacher or room for ${course.course} (${course.branch})`);
        continue;
      }

      const entry = {
        id: uuidv4(),
        year: course.year,
        branch: course.branch,
        course: course.course,
        teacher: teacher.name,
        room: room.name,
        day: randomDay,
        time: timeSlot,
        type: course.type
      };

      if (isSlotAvailable(scheduleMap, entry)) {
        entries.push(entry);
        daysUsed.add(randomDay);
        availableSlots[randomDay].splice(randomSlotIndex, 1);
        
        const key = `${entry.day}-${entry.time}`;
        const existing = scheduleMap.get(key) || [];
        scheduleMap.set(key, [...existing, entry]);
        
        slotsNeeded--;
        slotFound = true;
      }
    }

    // If we couldn't find a slot after max attempts, break to avoid infinite loop
    if (!slotFound && attempts >= maxAttemptsPerSlot) {
      console.log(`Could not find valid slot for ${course.course} (${course.branch}) after ${attempts} attempts`);
      break;
    }
  }

  // Log if we couldn't schedule all needed slots
  if (slotsNeeded > 0) {
    console.log(`Warning: Could only schedule ${entries.length} slots for ${course.course} (${course.branch}), needed ${course.requiredSlots}`);
  }

  return entries;
}

function generateRandomTimetable() {
  console.log("Starting structured timetable generation...");
  
  const scheduleMap = new Map();
  const timetable = [];
  const maxGenerationAttempts = 3;
  let currentAttempt = 0;
  
  try {
    while (currentAttempt < maxGenerationAttempts) {
      currentAttempt++;
      console.log(`Generation attempt ${currentAttempt}/${maxGenerationAttempts}`);
      
      // Clear previous data
      scheduleMap.clear();
      timetable.length = 0;
      
      // Process all years from even semester courses
      const yearKeys = ["firstYear", "secondYear", "thirdYear", "fourthYear"];
      
      for (const year of yearKeys) {
        if (db.EvenCourses && db.EvenCourses[year]) {
          const branches = Object.keys(db.EvenCourses[year]);
          
          for (const branch of branches) {
            console.log(`Processing ${year} ${branch}...`);
            
            // Create fresh weekly template for each branch
            const branchSchedule = createWeeklyTemplate();
            
            // Get and sort courses by type (labs first, then theory)
            const courses = db.EvenCourses[year][branch];
            const sortedCourses = [...courses].sort((a, b) => {
              if (a.type === "lab" && b.type !== "lab") return -1;
              if (a.type !== "lab" && b.type === "lab") return 1;
              return 0;
            });

            // Process each course for this branch
            for (const course of sortedCourses) {
              const courseToSchedule = {
                course: course.course,
                year,
                branch,
                type: course.type,
                requiredSlots: course.type === "both" ? 4 : course.type === "lab" ? 2 : 3
              };

              const courseEntries = distributeCourseAcrossDays(
                courseToSchedule,
                branchSchedule,
                scheduleMap,
                facultyDB.teachers,
                db.classrooms,
                db.labs
              );

              if (courseEntries.length < courseToSchedule.requiredSlots) {
                console.log(`Failed to schedule all slots for ${course.course}`);
                continue;
              }

              timetable.push(...courseEntries);
            }
          }
        }
      }

      // Check if we have a valid timetable
      if (timetable.length >= 100) {
        console.log(`Successfully generated timetable with ${timetable.length} entries`);
        break;
      } else {
        console.log(`Generated timetable too small (${timetable.length} entries), retrying...`);
      }
    }

    if (timetable.length < 100) {
      throw new Error(`Failed to generate valid timetable after ${maxGenerationAttempts} attempts`);
    }

    // Sort the timetable for better readability
    return timetable.sort((a, b) => {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const years = ["firstYear", "secondYear", "thirdYear", "fourthYear"];
      
      if (years.indexOf(a.year) !== years.indexOf(b.year)) {
        return years.indexOf(a.year) - years.indexOf(b.year);
      }
      if (a.branch !== b.branch) {
        return a.branch.localeCompare(b.branch);
      }
      if (days.indexOf(a.day) !== days.indexOf(b.day)) {
        return days.indexOf(a.day) - days.indexOf(b.day);
      }
      return a.time.localeCompare(b.time);
    });

  } catch (error) {
    console.error("Error in timetable generation:", error);
    return [];
  }
}

function selectParent(population) {
  const tournamentSize = 3;
  let best = null;
  for (let i = 0; i < tournamentSize; i++) {
    const contestant = population[Math.floor(Math.random() * population.length)];
    if (!best || contestant.fitness > best.fitness) {
      best = contestant;
    }
  }
  return best;
}

function crossover(parent1, parent2) {
  const crossoverPoint = Math.floor(Math.random() * parent1.timetable.length);
  const childTimetable = [
    ...parent1.timetable.slice(0, crossoverPoint),
    ...parent2.timetable.slice(crossoverPoint)
  ];
  return { timetable: childTimetable, fitness: calculateFitness(childTimetable) };
}

function mutate(individual) {
  if (Math.random() < MUTATION_RATE) {
    // Simplified mutation to reduce memory usage
    if (individual.timetable.length > 0) {
      const idx = Math.floor(Math.random() * individual.timetable.length);
      const entry = { ...individual.timetable[idx] };
      
      // Just change the day or time
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      entry.day = days[Math.floor(Math.random() * days.length)];
      
      individual.timetable[idx] = entry;
      individual.fitness = calculateFitness(individual.timetable);
    }
  }
}

function geneticAlgorithm() {
  console.log("Starting genetic algorithm with structured scheduling...");
  const startTime = Date.now();
  
  try {
    // Generate first structured timetable
    const timetable = generateRandomTimetable();
    
    // Sort the timetable for better readability
    const sortedTimetable = timetable.sort((a, b) => {
      // Sort by: Year -> Branch -> Day -> Time
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const years = ["firstYear", "secondYear", "thirdYear", "fourthYear"];
      
      if (years.indexOf(a.year) !== years.indexOf(b.year)) {
        return years.indexOf(a.year) - years.indexOf(b.year);
      }
      if (a.branch !== b.branch) {
        return a.branch.localeCompare(b.branch);
      }
      if (days.indexOf(a.day) !== days.indexOf(b.day)) {
        return days.indexOf(a.day) - days.indexOf(b.day);
      }
      return a.time.localeCompare(b.time);
    });

    console.log(`Generated structured timetable with ${sortedTimetable.length} entries`);
    console.log(`Algorithm completed in ${Math.floor((Date.now() - startTime)/1000)} seconds`);
    
    return sortedTimetable;
  } catch (error) {
    console.error("Error in genetic algorithm:", error);
    return [];
  }
}

module.exports = { geneticAlgorithm };

