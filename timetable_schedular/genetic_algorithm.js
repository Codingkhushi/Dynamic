const { assignTeachers, assignRooms } = require("./assignments");
const { validateTimetable } = require("./validation");
const { applyConstraints } = require("./constraints");
const db = require("../models/db");
const facultyDB = require("../models/faculty_db");
const { calculateEnhancedFitness, calculateFitness } = require("./fitness");
const { v4: uuidv4 } = require('uuid');


// Adjust algorithm parameters
const POPULATION_SIZE = 100;
const GENERATIONS = 1000;
const MUTATION_RATE = 0.2; // Increased from 0.03 to 0.2 for more variation
const ELITE_SIZE = 5;
const MAX_EXECUTION_TIME = 60000; // 60 seconds max
const MAX_ATTEMPTS_PER_COURSE = 15;


const Constraints = require('../models/constraintsSchema');
async function loadConfig() {
  return (await Constraints.findOne()) || await new Constraints().save();
}

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

function parseTime(t) {
  const [h, m] = t.split(':').map(Number);
  return h + m/60;
}
// Helper function to create empty weekly schedule template
async function createWeeklyTemplate() {
  const cfg  = await loadConfig();
  const days = cfg.workingDays;        // e.g. ["Monday",...]
  const slots = [];

  // convert all times to decimals once
  let current     = cfg.workingHours.start;     // e.g. "08:30"
  const dayEnd    = cfg.workingHours.end;       // e.g. "17:15"
  const lunchStart= parseTime(cfg.lunchBreak.start);
  const lunchEnd  = parseTime(cfg.lunchBreak.end);

  while (true) {
    // 1) compute end-of-slot (+60min)
    const [h, m] = current.split(':').map(Number);
    const nextDt = new Date(0,0,0,h, m + 60);
    const end    = `${String(nextDt.getHours()).padStart(2,'0')}:${String(nextDt.getMinutes()).padStart(2,'0')}`;

    // 2) stop if this slot would finish past your configured dayEnd
    if (parseTime(end) > parseTime(dayEnd)) break;

    // 3) if this 1-hr block overlaps lunch window → jump to lunchEnd
    const slotStart = parseTime(current);
    const slotEnd   = parseTime(end);
    if (slotStart < lunchEnd && slotEnd > lunchStart) {
      current = cfg.lunchBreak.end;  // e.g. "13:15"
      continue;
    }

    // 4) otherwise record it
    slots.push(`${current}-${end}`);

    // 5) advance
    current = end;
  }

  // build the template map
  const template = {};
  days.forEach(d => template[d] = [...slots]);
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

// timetable_schedular/genetic_algorithm.js

async function generateRandomTimetable() {
  console.log("Starting structured timetable generation...");
  
  const scheduleMap = new Map();
  const timetable   = [];
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
            const branchSchedule = await createWeeklyTemplate();

            // Get and sort courses by type (labs first, then theory)
            const courses       = db.EvenCourses[year][branch];
            const sortedCourses = [...courses].sort((a, b) => {
              if (a.type === "lab" && b.type !== "lab") return -1;
              if (a.type !== "lab" && b.type === "lab") return 1;
              return 0;
            });

            // ─── NEW: loop over each course ───────────────────────
            for (const course of sortedCourses) {
              // Load user constraints
              const cfg  = await loadConfig();
              const rule = cfg.sessionRules[course.type] || {};

              // Determine how many slots this course needs
              const requiredSlots = rule.weeklyCount
                                  || (course.type === "both" ? 4
                                  :  course.type === "lab"  ? 2
                                  :  3);

              // Build the course descriptor
              const courseToSchedule = {
                course:        course.course,
                year,
                branch,
                type:          course.type,
                requiredSlots,
              };

              // Distribute this course across days
              const courseEntries = distributeCourseAcrossDays(
                courseToSchedule,
                branchSchedule,
                scheduleMap,
                facultyDB.teachers,
                db.classrooms,
                db.labs
              );

              // If not all required slots were filled, skip
              if (courseEntries.length < requiredSlots) {
                console.log(`Failed to schedule all slots for ${course.course}`);
                continue;
              }

              // Add the scheduled entries
              timetable.push(...courseEntries);
            }  // ─── end for-of sortedCourses ────────────────────

          }  // end branch loop
        }    // end if EvenCourses[year]
      }      // end year loop

      // If we've scheduled enough entries, stop retrying
      if (timetable.length >= 100) {
        console.log(`Successfully generated timetable with ${timetable.length} entries`);
        break;   // ← now legal: inside the while loop
      } else {
        console.log(`Generated timetable too small (${timetable.length} entries), retrying...`);
      }
    }  // end while

    if (timetable.length < 100) {
      throw new Error(`Failed to generate valid timetable after ${maxGenerationAttempts} attempts`);
    }

    // Sort the final timetable for readability
    return timetable.sort((a, b) => {
      const days  = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
      const years = ["firstYear","secondYear","thirdYear","fourthYear"];
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
  const fitnessResult = calculateEnhancedFitness(childTimetable);
  return { timetable: childTimetable, fitness: fitnessResult.score };
}

function mutate(individual) {
  if (Math.random() < MUTATION_RATE) {
    // Enhanced mutation to create more diversity
    if (individual.timetable.length > 0) {
      // Mutate multiple entries for better exploration
      const mutationCount = Math.max(1, Math.floor(individual.timetable.length * 0.05)); // Mutate 5% of entries
      
      for (let i = 0; i < mutationCount; i++) {
        const idx = Math.floor(Math.random() * individual.timetable.length);
        const entry = { ...individual.timetable[idx] };
        
        // Randomly choose what to mutate
        const mutationType = Math.floor(Math.random() * 3);
        
        if (mutationType === 0) {
          // Change day
          const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
          entry.day = days[Math.floor(Math.random() * days.length)];
        } 
        else if (mutationType === 1) {
          // Change time (need to implement this based on your time slots)
          const times = ["08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", 
                         "13:15-14:15", "14:15-15:15", "15:15-16:15", "16:15-17:15"];
          entry.time = times[Math.floor(Math.random() * times.length)];
        }
        else if (mutationType === 2) {
          // Change room (if you have room information available)
          // This would need to be implemented with your actual room list
          // For now, we'll just change the day as a fallback
          const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
          entry.day = days[Math.floor(Math.random() * days.length)];
        }
        
        individual.timetable[idx] = entry;
      }
      
      // Recalculate fitness after mutations
      const fitnessResult = calculateEnhancedFitness(individual.timetable);
      individual.fitness = fitnessResult.score;
    }
  }
}

// Function to display generation details and fitness information
function displayGenerationInfo(generation, bestIndividual, population) {
  // Calculate average fitness
  const avgFitness = population.reduce((sum, ind) => sum + ind.fitness, 0) / population.length;
  
  // Get detailed fitness information
  const fitnessDetails = calculateEnhancedFitness(bestIndividual.timetable);
  const hardViolations = fitnessDetails.details.hardViolations;
  const softViolations = fitnessDetails.details.softViolations;
  
  console.log("\n==================================================");
  console.log(`GENERATION ${generation} SUMMARY`);
  console.log("==================================================");
  console.log(`Best Fitness Score: ${fitnessDetails.score.toFixed(4)}`);
  console.log(`Hard Constraint Score: ${fitnessDetails.details.hardConstraintScore.toFixed(4)}`);
  console.log(`Soft Constraint Score: ${fitnessDetails.details.softConstraintScore.toFixed(4)}`);
  console.log(`Average Population Fitness: ${avgFitness.toFixed(4)}`);
  console.log("\nHARD CONSTRAINT VIOLATIONS:");
  console.log(`- Teacher Conflicts: ${hardViolations.teacherConflicts}`);
  console.log(`- Room Conflicts: ${hardViolations.roomConflicts}`);
  console.log(`- Class Conflicts: ${hardViolations.classConflicts}`);
  console.log(`- Lab Constraints: ${hardViolations.labConstraints}`);
  console.log(`- Consecutive Classes: ${hardViolations.consecutiveClasses}`);
  console.log(`- Teacher Workload: ${hardViolations.teacherWorkload}`);
  console.log("\nSOFT CONSTRAINT VIOLATIONS:");
  console.log(`- Teacher Gaps: ${softViolations.teacherGaps}`);
  console.log(`- Student Gaps: ${softViolations.studentGaps}`);
  console.log(`- Late Afternoon Classes: ${softViolations.lateAfternoonClasses}`);
  console.log(`- Uneven Distribution: ${softViolations.unevenDistribution.toFixed(2)}`);
  console.log(`- Consecutive Room Changes: ${softViolations.consecutiveDifferentRooms}`);
  console.log(`- Preferred Time Violations: ${softViolations.preferredTimeViolations}`);
  console.log("==================================================");
  
  return fitnessDetails;
}

async function geneticAlgorithm() {
  console.log("Starting genetic algorithm with structured scheduling...");
  const startTime = Date.now();
  
  try {
    // Generate initial population
    console.log("Generating initial population...");
    
    // Start with one good structured timetable
    const initialTimetable = await generateRandomTimetable();
    const fitnessResult = calculateEnhancedFitness(initialTimetable);
    
    let population = [{ 
      timetable: initialTimetable, 
      fitness: fitnessResult.score 
    }];
    
    // Fill the rest of the population with variations
    for (let i = 1; i < POPULATION_SIZE; i++) {
      // Create a clone with slight modifications
      const clone = JSON.parse(JSON.stringify(initialTimetable));
      
      // Perform random mutations (change days/times for 10% of entries)
      const mutationCount = Math.floor(clone.length * 0.1);
      for (let j = 0; j < mutationCount; j++) {
        const randomIndex = Math.floor(Math.random() * clone.length);
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        clone[randomIndex].day = days[Math.floor(Math.random() * days.length)];
        
        // Also randomly change times for some entries
        if (Math.random() < 0.5) {
          const times = ["08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", 
                         "13:15-14:15", "14:15-15:15", "15:15-16:15", "16:15-17:15"];
          clone[randomIndex].time = times[Math.floor(Math.random() * times.length)];
        }
      }
      
      const cloneFitness = calculateEnhancedFitness(clone);
      population.push({ 
        timetable: clone, 
        fitness: cloneFitness.score 
      });
    }
    
    let bestIndividual = population[0];
    let bestFitness = bestIndividual.fitness;
    let lastImprovementGen = 0;
    let lastGenerationRun = 0; // Track the last generation that actually ran
    
    // Display initial generation info
    console.log("\nINITIAL POPULATION:");
    const initialFitnessDetails = displayGenerationInfo(0, bestIndividual, population);
    
    // Main evolutionary loop
    for (let generation = 1; generation <= GENERATIONS; generation++) {
      // Check execution time limit
      if (Date.now() - startTime > MAX_EXECUTION_TIME) {
        console.log(`Execution time limit reached after ${generation} generations.`);
        break;
      }
      
      // Create a new population
      const newPopulation = [];
      
      // Elitism - keep the best individuals
      population.sort((a, b) => b.fitness - a.fitness);
      for (let i = 0; i < ELITE_SIZE; i++) {
        newPopulation.push(population[i]);
      }
      
      // Fill the rest of the population with crossover and mutation
      while (newPopulation.length < POPULATION_SIZE) {
        const parent1 = selectParent(population);
        const parent2 = selectParent(population);
        const child = crossover(parent1, parent2);
        mutate(child);
        newPopulation.push(child);
      }
      
      // Update the population
      population = newPopulation;
      
      // Find the best individual
      population.sort((a, b) => b.fitness - a.fitness);
      const currentBest = population[0];
      
      // Display generation info every 10 generations or on improvement
      if (generation % 10 === 0 || currentBest.fitness > bestFitness) {
        if (currentBest.fitness > bestFitness) {
          bestFitness = currentBest.fitness;
          bestIndividual = currentBest;
          lastImprovementGen = generation;
          console.log(`\nNew best solution found in generation ${generation}!`);
        }
        
        displayGenerationInfo(generation, currentBest, population);
      }
      
      // Early stopping if no improvement for many generations
      if (generation - lastImprovementGen > 50) {
        console.log(`No improvement for 50 generations. Stopping at generation ${generation}.`);
        break;
      }
    }
    
    // Final output with the best solution
    console.log("\n==================================================");
    console.log("GENETIC ALGORITHM COMPLETED");
    console.log("==================================================");
    const finalFitnessDetails = displayGenerationInfo("FINAL", bestIndividual, population);
    console.log(`Algorithm completed in ${Math.floor((Date.now() - startTime)/1000)} seconds`);
    console.log(`Last generation run: ${lastGenerationRun}`);
    console.log(`Last improvement found at generation: ${lastImprovementGen}`);
    console.log(`Generated timetable with ${bestIndividual.timetable.length} entries`);
    console.log("==================================================");
    
    // Sort the timetable for better readability
    const sortedTimetable = bestIndividual.timetable.sort((a, b) => {
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

    return sortedTimetable;
  } catch (error) {
    console.error("Error in genetic algorithm:", error);
    return [];
  }
}

module.exports = { geneticAlgorithm };
