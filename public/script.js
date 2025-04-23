let timetableData = [];

// Function to generate new timetable
async function generateTimetable() {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) loadingDiv.style.display = 'flex';
    
    try {
        const response = await fetch("http://localhost:3000/api/generate-timetable", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        
        if (data.success) {
            timetableData = data.timetable;
            displayTimetable(timetableData);
            return true;
        } else {
            showError("Failed to generate timetable: " + (data.error || "Unknown error"));
            return false;
        }
    } catch (error) {
        showError("Error generating timetable: " + error.message);
        return false;
    } finally {
        if (loadingDiv) loadingDiv.style.display = 'none';
    }
}

// Function to show error messages
function showError(message) {
    // Remove any existing error messages
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());

    // Create new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    // Insert before the filters div if it exists, otherwise before the table
    const filtersDiv = document.querySelector('.filters');
    const tableContainer = document.querySelector('.table-container');
    const targetElement = filtersDiv || tableContainer;

    if (targetElement && targetElement.parentNode) {
        targetElement.parentNode.insertBefore(errorDiv, targetElement);
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

// Fetch timetable data on page load
document.addEventListener("DOMContentLoaded", async () => {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) loadingDiv.style.display = 'flex';

    try {
        await displayStructuredTimetable();
    } catch (error) {
        console.error("Error loading timetable:", error);
        showError("Could not load timetable. Please try again later.");
    } finally {
        if (loadingDiv) loadingDiv.style.display = 'none';
    }

    // Add event listeners for buttons
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const success = await generateTimetable();
            if (success) {
                await displayStructuredTimetable();
            }
        });
    }

    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', handlePrint);
    }
});

// Function to sort timetable: First by day, then by time
function sortTimetable(timetable) {
    if (!Array.isArray(timetable)) {
        console.error("sortTimetable error: Expected an array, got:", typeof timetable, timetable);
        return [];
    }

    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    return timetable.sort((a, b) => {
        let dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
        if (dayDiff !== 0) return dayDiff;

        const timeA = a.time.split('-')[0];
        const timeB = b.time.split('-')[0];
        return timeA.localeCompare(timeB);
    });
}

// Function to display the timetable
function displayTimetable(timetable) {
    const tbody = document.getElementById("timetable-body");
    if (!tbody) {
        console.error("Timetable body element not found");
        return;
    }

    // Clear existing content
    tbody.innerHTML = "";

    if (!Array.isArray(timetable) || timetable.length === 0) {
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = '<td colspan="8" class="empty-message">No timetable data available</td>';
        tbody.appendChild(emptyRow);
        return;
    }

    const sortedTimetable = sortTimetable(timetable);

    sortedTimetable.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${formatYear(entry.year)}</td>
            <td>${entry.branch}</td>
            <td>${entry.course}</td>
            <td>${entry.teacher}</td>
            <td>${entry.room}</td>
            <td>${entry.day}</td>
            <td>${entry.type}</td>
            <td>${entry.time}</td>
        `;
        tbody.appendChild(row);
    });
}

// Format year for display
function formatYear(yearStr) {
    switch(yearStr) {
        case 'firstYear': return '1st Year';
        case 'secondYear': return '2nd Year';
        case 'thirdYear': return '3rd Year';
        case 'fourthYear': return '4th Year';
        default: return yearStr;
    }
}

// Filter data based on year
function filterByYear(year) {
    const filtered = timetableData.filter(entry => entry.year === year);
    displayTimetable(filtered);
    showSemesterButtons(year);
}

// Show semester buttons when a year is selected
function showSemesterButtons(year) {
    const semesterButtons = document.getElementById("semester-buttons");
    if (semesterButtons) {
        semesterButtons.style.display = "block";
        
        const oddSemBtn = document.getElementById("oddSemBtn");
        const evenSemBtn = document.getElementById("evenSemBtn");
        
        if (oddSemBtn) oddSemBtn.onclick = () => filterBySemester(year, "odd");
        if (evenSemBtn) evenSemBtn.onclick = () => filterBySemester(year, "even");
    }
}

// Filter data based on year & semester
async function filterBySemester(year, semesterType) {
    try {
        const response = await fetch(`http://localhost:3000/api/courses/${semesterType}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        const semesterCourses = Array.isArray(data) ? data : [];
        
        if (semesterCourses.length === 0) {
            showError(`No courses found for ${formatYear(year)} ${semesterType} semester`);
            return;
        }

        // Filter courses by year first
        const yearSpecificCourses = semesterCourses.filter(course => 
            course.year === year
        );
        
        if (yearSpecificCourses.length === 0) {
            showError(`No courses found for ${formatYear(year)} ${semesterType} semester`);
            return;
        }
        
        // Get course names for the specific year
        const courseNames = yearSpecificCourses.map(course => 
            typeof course === 'string' ? course : course.course || course.name || ''
        ).filter(name => name !== '');

        // Filter timetable for this year and these courses
        const filtered = timetableData.filter(entry =>
            entry.year === year && courseNames.includes(entry.course)
        );

        if (filtered.length === 0) {
            showError(`No matching timetable entries found for ${formatYear(year)} ${semesterType} semester`);
        }

        displayTimetable(filtered);
    } catch (error) {
        console.error("Error details:", error);
        showError(`Error fetching semester data: ${error.message}`);
    }
}

// Add event listeners for year buttons
document.addEventListener('DOMContentLoaded', () => {
    const yearButtons = {
        'firstYearBtn': 'firstYear',
        'secondYearBtn': 'secondYear',
        'thirdYearBtn': 'thirdYear',
        'fourthYearBtn': 'fourthYear',
        'allYearsBtn': 'all'
    };

    Object.entries(yearButtons).forEach(([btnId, yearValue]) => {
        const button = document.getElementById(btnId);
        if (button) {
            button.addEventListener('click', () => {
                if (yearValue === 'all') {
                    const semesterButtons = document.getElementById("semester-buttons");
                    if (semesterButtons) semesterButtons.style.display = "none";
                    displayTimetable(timetableData);
                } else {
                    filterByYear(yearValue);
                }
            });
        }
    });
});

async function displayStructuredTimetable() {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) loadingDiv.style.display = 'flex';

    try {
        const response = await fetch("http://localhost:3000/api/structured-timetable");
        const data = await response.json();

        console.log("Data: ", data);

        if (!data.success) {
            throw new Error(data.error || "Failed to fetch structured timetable");
        }

        const container = document.querySelector('.table-container');
        container.innerHTML = ''; // Clear existing content

        const years = ["firstYear", "secondYear", "thirdYear", "fourthYear"];
        const yearNames = {
            firstYear: "First Year",
            secondYear: "Second Year",
            thirdYear: "Third Year",
            fourthYear: "Fourth Year"
        };

        years.forEach(year => {
            const yearDiv = document.createElement('div');
            yearDiv.className = 'year-section';
            yearDiv.dataset.year = year;  
            yearDiv.innerHTML = `<h2 style="margin-left: 15px">${yearNames[year]}</h2>`;

            Object.keys(data.data[year]).forEach(branch => {
                if (Object.values(data.data[year][branch]).some(day => day.length > 0)) {
                    
                    const branchDiv = document.createElement('div');
                    branchDiv.className = 'branch-section';
                    branchDiv.innerHTML = `
                        <h3>${branch}</h3>
                        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc;">
    <thead>
        <tr>
            <th style="border: 1px solid #000; padding: 8px;">Time</th>
            <th style="border: 1px solid #000; padding: 8px;">Monday</th>
            <th style="border: 1px solid #000; padding: 8px;">Tuesday</th>
            <th style="border: 1px solid #000; padding: 8px;">Wednesday</th>
            <th style="border: 1px solid #000; padding: 8px;">Thursday</th>
            <th style="border: 1px solid #000; padding: 8px;">Friday</th>
        </tr>
    </thead>
    <tbody>
        ${generateBranchTimetableRows(data.data[year][branch])}
    </tbody>
</table>


                    `;
                    yearDiv.appendChild(branchDiv);
                }
            });

            if (yearDiv.children.length > 1) { // More than just the h2
                container.appendChild(yearDiv);
            }
        });
    } catch (error) {
        showError("Error displaying structured timetable: " + error.message);
    } finally {
        if (loadingDiv) loadingDiv.style.display = 'none';
    }
}

function generateBranchTimetableRows(branchData) {
    const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
    const timeSlots = Array.from(
      days.reduce((s,d)=> {
        (branchData[d]||[]).forEach(e=>s.add(e.time));
        return s;
      }, new Set())
    ).sort((a,b)=>a.localeCompare(b));
  
    let rows = "";
  
    timeSlots.forEach(time => {
      // Time‐label cell
      rows += `<tr>
        <td style="border:1px solid #000; padding:8px;">
          <strong>${time}</strong>
        </td>`;
  
      days.forEach(day => {
        const cellEntry = (branchData[day]||[]).find(e=>e.time===time);
        if (cellEntry) {
          // Draggable entry
          rows += `<td
            draggable="true"
            data-entry-id="${cellEntry.id}"
            data-day="${day}"
            data-time="${cellEntry.time}"
            style="border:1px solid #000; padding:8px;"
          >
            <strong>${cellEntry.subject}</strong><br>
            ${cellEntry.faculty}<br>
            <em>${cellEntry.room}</em><br>
            (${cellEntry.type})
          </td>`;
        } else {
          // Break cell: now with data‑attributes
          rows += `<td
            style="border:1px solid #000; padding:8px;"
            data-day="${day}"
            data-time="${time}"
          >
            Break
          </td>`;
        }
      });
  
      rows += `</tr>`;
    });
  
    return rows;
  }
  


function handlePrint() {
    // Add a print timestamp
    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'print-timestamp';
    timestampDiv.style.textAlign = 'center';
    timestampDiv.style.marginBottom = '20px';
    timestampDiv.style.fontSize = '12px';
    timestampDiv.style.color = '#666';
    
    const now = new Date();
    timestampDiv.textContent = `Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
    
    const container = document.querySelector('.table-container');
    container.insertBefore(timestampDiv, container.firstChild);

    // Trigger print
    window.print();

    // Remove timestamp after printing
    setTimeout(() => {
        container.removeChild(timestampDiv);
    }, 100);
}

// 1) Start drag → stash the entry id
document.addEventListener('dragstart', e => {
    // climb up from whatever inner node you clicked to the <td draggable="true">
    const td = e.target.closest('td[draggable="true"]');
    if (!td) return;               // if it wasn’t a draggable cell, ignore
    const id = td.dataset.entryId; // data-entry-id → dataset.entryId
    if (id) {
      e.dataTransfer.setData('text/plain', id);
    }
  });
  
  
  // 2) Allow drop on any cell
  // Before: only on existing entries
// document.addEventListener('dragover', e => {
//   if (e.target.dataset.entryId !== undefined) e.preventDefault();
// });

// After: allow drop anywhere in the grid
document.addEventListener('dragover', e => {
    if (e.target.tagName === 'TD') {
      e.preventDefault();
    }
  });
  
  // 3) On drop → ask server to validate & commit
  document.addEventListener('drop', async e => {
    e.preventDefault();
  
    // find the <td> you dropped onto
    const dropTd = e.target.closest('td');
    if (!dropTd) return;
  
    const newDay  = dropTd.dataset.day;
    const newTime = dropTd.dataset.time;
    const id      = e.dataTransfer.getData('text/plain');
  
    if (!id) {
      return alert("Cannot move: no entry selected");
    }
    const resp = await fetch('/api/update-entry', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({id, day:newDay, time:newTime})
    }).then(r => r.json());
  
    if (resp.success) {
      timetableData = resp.timetable;           // update local copy
      displayStructuredTimetable();             // re‑render grid
    } else {
      alert('Cannot move: ' + resp.error);      // show first conflict
    }
  });
  
