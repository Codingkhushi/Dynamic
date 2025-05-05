
console.log("Scheduler script started...");

const { geneticAlgorithm } = require("./genetic_algorithm");

;(async () => {
  try {
    const timetable = await geneticAlgorithm();
    console.log("Generated Timetable:", JSON.stringify(timetable, null, 2));

    // Format the timetable into a structured array for console.table()
    function formatTimetable(timetable) {
      const formattedTimetable = [];
      timetable.forEach(entry => {
        formattedTimetable.push({
          Year: entry.year,
          Branch: entry.branch,
          Day: entry.day,
          Time: entry.time,
          Course: entry.course,
          Teacher: entry.teacher,
          Room: entry.room
        });
      });
      return formattedTimetable;
    }

    const formattedTimetable = formatTimetable(timetable);

    // Print the timetable in table format
    console.log("\nFormatted Timetable:");
    console.table(formattedTimetable);

  } catch (err) {
    console.error("Error during timetable generation:", err);
  }
})();


