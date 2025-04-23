const { geneticAlgorithm } = require('./genetic_algorithm');
const { calculateEnhancedFitness } = require('./fitness');

// Generate a timetable using the genetic algorithm
const timetable = geneticAlgorithm();

// Calculate the fitness details for the timetable
const fitnessDetails = calculateEnhancedFitness(timetable);

// Log the results
console.log("Final Timetable:", timetable);
console.log("Fitness Score:", fitnessDetails.score.toFixed(4));
console.log("Total Violations:", fitnessDetails.details.totalViolations);
console.log("Violation Breakdown:", fitnessDetails.details.violationTypes);
