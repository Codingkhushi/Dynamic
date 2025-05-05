const express = require("express");
const cors = require("cors");
const path = require('path');
const { geneticAlgorithm } = require("./timetable_schedular/genetic_algorithm");
const courseRoutes = require('./routes/courses');
const db = require('./models/db');
const hardcodedDB = require('./hardcoded/db')
const facultyDB = require('./models/faculty_db');
const hardcodedFacultyDB = require('./hardcoded/faculty_db');
const { v4: uuidv4 } = require('uuid');
const app = express();
const MongoClient = require("mongodb").MongoClient;
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const PORT = 3000;
const GlobalData = require('./schema/coursesSchema');
const Constraints = require('./models/constraintsSchema');

// Memory-saving measures
global.gc && global.gc(); // Force garbage collection if available

// Store generated timetable in memory
let generatedTimetable = [];

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' })); // Limit JSON payload size
app.use(express.static('public'));

// Simplify data validation to reduce memory usage
console.log("Starting server with simplifying data validation...");

// Use a try/catch for initializing the timetable
try {
    // Only generate a small timetable on startup to save memory
    console.log("Generating a minimal timetable for startup...");
    
    // Create a simple timetable with a few entries as fallback
    generatedTimetable = [
        // First Year
        {
            id:      uuidv4(),
            year: "firstYear",
            branch: "CST",
            course: "Maths 2",
            teacher: "Dr. John Doe",
            room: "201",
            day: "Monday",
            time: "09:30-10:30",
            type: "theory"
        },
        {
            id:      uuidv4(),
            year: "firstYear",
            branch: "IT",
            course: "PPS",
            teacher: "Dr. Jane Smith",
            room: "202",
            day: "Tuesday",
            time: "10:30-11:30",
            type: "theory"
        },
        
        // Second Year
        {
            id:      uuidv4(),
            year: "secondYear",
            branch: "CST",
            course: "DAA",
            teacher: "Dr. Robert Brown",
            room: "101",
            day: "Monday",
            time: "10:30-11:30",
            type: "theory"
        },
        {
            id:      uuidv4(),
            year: "secondYear",
            branch: "IT",
            course: "DBMP",
            teacher: "Dr. Sarah Wilson",
            room: "102",
            day: "Tuesday",
            time: "01:15-02:15",
            type: "theory"
        },
        
        // Third Year
        {
            id:      uuidv4(),
            year: "thirdYear",
            branch: "CST",
            course: "AI",
            teacher: "Dr. Michael Johnson",
            room: "301",
            day: "Wednesday",
            time: "11:30-12:30",
            type: "theory"
        },
        {
            id:      uuidv4(),
            year: "thirdYear",
            branch: "IT",
            course: "IOT",
            teacher: "Dr. Emily Davis",
            room: "302",
            day: "Thursday",
            time: "02:15-03:15",
            type: "theory"
        },
        
        // Fourth Year
        {
            id:      uuidv4(),
            year: "fourthYear",
            branch: "CST",
            course: "Cyber Law & Ethics",
            teacher: "Dr. David Miller",
            room: "401",
            day: "Friday",
            time: "09:30-10:30",
            type: "theory"
        },
        {
            id:      uuidv4(),
            year: "fourthYear",
            branch: "IT",
            course: "Geospatial Technology",
            teacher: "Dr. Lisa Anderson",
            room: "402",
            day: "Friday",
            time: "01:15-02:15",
            type: "theory"
        }
    ];
    
    console.log("Initial minimal timetable created");
} catch (error) {
    console.error("Error in initial timetable setup:", error);
}

// ─── Get or create the one Constraints doc ─────────────────────────────────
// ─── Fetch current constraints (create defaults if none) ─────────────────
app.get('/api/constraints', async (req, res) => {
  let cfg = await Constraints.findOne();
  if (!cfg) {
    cfg = await new Constraints().save();    // first‐time defaults
  }
  res.json(cfg);
});

// ─── Save updated constraints from the UI ───────────────────────────────
app.post('/api/constraints', async (req, res) => {
  try {
    const updates = req.body;                // expects the same shape as our schema
    let cfg = await Constraints.findOne();
    if (!cfg) cfg = new Constraints();
    Object.assign(cfg, updates);
    await cfg.save();
    res.json({ success: true, config: cfg });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});


// Generate new timetable with error handling
app.post("/api/generate-timetable", async (req, res) => {
    console.log("Generate timetable request received");
    
    try {
        // Add timeout to prevent hanging - increased to 3 minutes (180000ms)
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Timetable generation timed out after 3 minutes")), 180000);
        });
        
        // Generate timetable with race against timeout
        generatedTimetable = await Promise.race([
          geneticAlgorithm(),
          timeoutPromise
        ]);
        
        
       
        
        console.log(`Generated timetable with ${generatedTimetable.length} entries`);
        
        // Validate minimum entries requirement
        if (generatedTimetable.length < 100) {
            throw new Error(`Generated timetable has insufficient entries (${generatedTimetable.length})`);
        }
        
        // Force garbage collection if available
        if (global.gc) {
            console.log("Running garbage collection...");
            global.gc();
        }
        
        res.json({ 
            success: true, 
            timetable: generatedTimetable,
            entryCount: generatedTimetable.length
        });
    } catch (error) {
        console.error("Error generating timetable:", error);
        
        // Send a more detailed error response
        res.status(500).json({ 
            success: false, 
            error: error.message,
            details: {
                type: error.name,
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            }
        });
        
        // Force garbage collection after error
        if (global.gc) {
            console.log("Running garbage collection after error...");
            global.gc();
        }
    }
});

// Get current timetable with simple error handling
app.get("/api/timetable", (req, res) => {
    try {
        // Just return whatever timetable we have
        res.json({ timetable: generatedTimetable });
    } catch (error) {
        console.error("Error serving timetable:", error);
        res.status(500).json({ error: "Failed to retrieve timetable" });
    }
});

// Simplified course routes to prevent memory issues
app.get('/api/courses/:semesterType', (req, res) => {
    try {
        const { semesterType } = req.params;
        
        // Return courses based on semester type
        if (semesterType === 'even') {
            // Return a representative sample of even semester courses for all years
            const evenCourses = [
                // First Year
                { year: "firstYear", branch: "CST", course: "Maths 2", type: "non" },
                { year: "firstYear", branch: "CST", course: "PPS", type: "non" },
                { year: "firstYear", branch: "IT", course: "DE", type: "non" },
                { year: "firstYear", branch: "CE", course: "EC", type: "non" },
                { year: "firstYear", branch: "DS", course: "BEE", type: "non" },
                
                // Second Year
                { year: "secondYear", branch: "CST", course: "DAA", type: "non" },
                { year: "secondYear", branch: "CST", course: "OS", type: "non" },
                { year: "secondYear", branch: "IT", course: "DBMP", type: "non" },
                { year: "secondYear", branch: "CE", course: "OS", type: "non" },
                { year: "secondYear", branch: "DS", course: "DBMS", type: "non" },
                
                // Third Year
                { year: "thirdYear", branch: "CST", course: "AI", type: "non" },
                { year: "thirdYear", branch: "CST", course: "CN", type: "non" },
                { year: "thirdYear", branch: "IT", course: "IOT", type: "non" },
                { year: "thirdYear", branch: "CE", course: "CD", type: "non" },
                { year: "thirdYear", branch: "DS", course: "NNDL", type: "non" },
                
                // Fourth Year
                { year: "fourthYear", branch: "CST", course: "Cyber Law & Ethics", type: "non" },
                { year: "fourthYear", branch: "IT", course: "Geospatial Technology", type: "non" },
                { year: "fourthYear", branch: "CE", course: "Fundamentals of Bitcoin Technology", type: "non" },
                { year: "fourthYear", branch: "DS", course: "Cyber Law & Ethics", type: "non" }
            ];
            
            res.json(evenCourses);
        } else if (semesterType === 'odd') {
            // Return a representative sample of odd semester courses for all years
            const oddCourses = [
                // Second Year (first year doesn't have odd semester in this model)
                { year: "secondYear", branch: "CST", course: "DSA", type: "non" },
                { year: "secondYear", branch: "CST", course: "Digital Electronics", type: "non" },
                { year: "secondYear", branch: "IT", course: "DSA", type: "non" },
                { year: "secondYear", branch: "CE", course: "Analog Electronics", type: "non" },
                { year: "secondYear", branch: "DS", course: "Maths 3", type: "non" },
                
                // Third Year
                { year: "thirdYear", branch: "CST", course: "DBMS", type: "non" },
                { year: "thirdYear", branch: "IT", course: "OOPS", type: "non" },
                { year: "thirdYear", branch: "ENC", course: "DSP", type: "non" },
                
                // Fourth Year
                { year: "fourthYear", branch: "CST", course: "CC", type: "non" },
                { year: "fourthYear", branch: "IT", course: "CDA", type: "non" },
                { year: "fourthYear", branch: "CE", course: "CNS", type: "non" },
                { year: "fourthYear", branch: "DS", course: "NLP", type: "non" }
            ];
            
            res.json(oddCourses);
        } else {
            res.status(400).json({ error: "Invalid semester type. Use 'odd' or 'even'." });
        }
    } catch (error) {
        console.error(`Error serving ${req.params.semesterType} semester courses:`, error);
        res.status(500).json({ error: "Failed to retrieve courses" });
    }
});



// Handle root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get structured timetable data
// At the top of server.js, make sure you have:

// ... your other requires and app setup ...
// let generatedTimetable = [ … ]

// --------------------------------------------------------------------
// Get structured timetable data
app.get("/api/structured-timetable", async (req, res) => {
  try {
    // 0) Load user’s day‐settings
    let cfg = await Constraints.findOne();
    if (!cfg) cfg = await new Constraints().save();
    const days = cfg.workingDays;   // e.g. ["Monday","Tuesday",…,"Saturday"]

    // 1) Define the years, branches, and weekdays
    const years   = ["firstYear", "secondYear", "thirdYear", "fourthYear"];
    const branches = db.branches; // ["CST","CE",…]
    
    // 2) Build the empty container
    const structuredTimetable = {};
    years.forEach(year => {
      structuredTimetable[year] = {};
      branches.forEach(branch => {
        structuredTimetable[year][branch] = {};
        days.forEach(day => {
          structuredTimetable[year][branch][day] = [];
        });
      });
    });

    // 3) Populate with every entry
    generatedTimetable.forEach(entry => {
      const { year, branch, day, time, course, teacher, room, type, id } = entry;
      if (
        structuredTimetable[year] &&
        structuredTimetable[year][branch] &&
        Array.isArray(structuredTimetable[year][branch][day])
      ) {
        structuredTimetable[year][branch][day].push({
          id,
          subject: course,
          faculty: teacher,
          room,
          type,
          time
        });
      }
    });

    // 4) Sort each day by start time
    years.forEach(year => {
      branches.forEach(branch => {
        days.forEach(day => {
          structuredTimetable[year][branch][day].sort((a, b) => {
            const tA = a.time.split('-')[0];
            const tB = b.time.split('-')[0];
            return tA.localeCompare(tB);
          });
        });
      });
    });

    // 5) Return
    res.json({
      success: true,
      data: structuredTimetable
    });

  } catch (error) {
    console.error("Error getting structured timetable:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


const { validateTimetable } = require('./timetable_schedular/validation');

app.post('/api/update-entry', (req, res) => {
    const { id, day, time } = req.body;
    // 1) Clone the existing timetable
    const clone = JSON.parse(JSON.stringify(generatedTimetable));
    const entry = clone.find(e => e.id === id);
    if (!entry) return res.status(404).json({ success: false, error: 'Entry not found' });
  
    // 2) Remember its old slot, then apply the move
    const oldDay  = entry.day, oldTime = entry.time;
    entry.day  = day;
    entry.time = time;
  
    // 3) Look just for conflicts involving *this* moved entry
    const blocker = clone.find(e =>
      e.id !== id &&
      e.day === entry.day &&
      e.time === entry.time &&
      (
        e.room === entry.room            // room conflict
        || e.teacher === entry.teacher   // teacher conflict
        || (e.branch === entry.branch && e.year === entry.year) // batch conflict
      )
    );
  
    if (blocker) {
      let msg;
      if (blocker.room === entry.room) {
        msg = `Cannot schedule ${entry.course} in room ${entry.room} at ${day}-${time}: ` +
              `room is occupied by ${blocker.course} taught by ${blocker.teacher} ` +
              `for ${blocker.branch} (${formatYear(blocker.year)}).`;
      } else if (blocker.teacher === entry.teacher) {
        msg = `Cannot schedule ${entry.course} at ${day}-${time}: ` +
              `teacher ${entry.teacher} is already teaching ${blocker.course} ` +
              `for ${blocker.branch} (${formatYear(blocker.year)}).`;
      } else {
        msg = `Cannot schedule ${entry.course} for ${entry.branch} (${formatYear(entry.year)}) ` +
              `at ${day}-${time}: batch has ${blocker.course} taught by ${blocker.teacher}.`;
      }
      return res.json({ success:false, error: msg });
    }
  
    // 4) No direct blocker—now run your full validateTimetable for any secondary issues
    const conflicts = validateTimetable(clone);
    if (conflicts.length) {
      return res.json({ success:false, error: conflicts[0] });
    }
  
    // 5) Commit and return
    generatedTimetable = clone;
    res.json({ success:true, timetable: generatedTimetable });
  });
  
  // Nice helper to humanize years
  function formatYear(year) {
    switch(year) {
      case 'firstYear':  return 'First Year';
      case 'secondYear': return 'Second Year';
      case 'thirdYear':  return 'Third Year';
      case 'fourthYear': return 'Fourth Year';
      default:           return year;
    }
  }
  

        // Populate structure with sorted entries
       

// Catch-all error handler
app.use((err, req, res, next) => {
    console.error("Unhandled server error:", err);
    res.status(500).json({ error: "Internal server error" });
});

// Graceful error handling for the entire process
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    // Keep the server running despite errors
});

app.post('/api/bulk-upload-data', async (req, res) => {
  try {
    await bulkUploadData();
    res.json({ success: true, message: 'data uploaded successfully' });
  } catch (err) {
    console.error('Error uploading data:', err);
    res.status(500).json({ success: false, error: 'Error uploading data' });
  }
});

// Function to bulk insert course data into the database
const bulkUploadData = async () => {
  try {
    const {branches, EvenCourses, classrooms, labs} = hardcodedDB
    const newGlobalDoc = new GlobalData({
      branches,
      classrooms,
      labs,
      EvenCourses,
      faculty: hardcodedFacultyDB.teachers,
    });

    await newGlobalDoc.save(); // Save to MongoDB
    console.log('data uploaded successfully');
  } catch (err) {
    console.error('Error uploading data:', err);
  }
};

// Mongo connection and server start
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('MongoDB connected');

  // Wait for both modules to finish loading data
  await Promise.all([db.ready, facultyDB.ready]);

  console.log("Courses data from database: ", db);
  console.log("Faculty data from database: ", facultyDB);

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
