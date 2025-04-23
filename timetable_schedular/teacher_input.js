const readline = require('readline');

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    rl.question(query, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function getNewTeachers() {
  const teachers = [];
  const hasNew = await askQuestion("Do you have any new or visiting teachers? (yes/no): ");
  if (hasNew.trim().toLowerCase() === 'yes') {
    let addMore = true;
    while (addMore) {
      const name = await askQuestion("Enter teacher name: ");
      const subjects = await askQuestion("Enter subjects (comma separated): ");
      const branch = await askQuestion("Enter branch: ");
      const year = await askQuestion("Enter the year the teacher will teach: ");
      teachers.push({
        name: name.trim(),
        subjects: subjects.split(',').map(s => s.trim()),
        branch: branch.trim(),
        year: year.trim()
      });
      const more = await askQuestion("Do you want to add another teacher? (yes/no): ");
      if (more.trim().toLowerCase() !== 'yes') {
        addMore = false;
      }
    }
  }
  return teachers;
}

module.exports = { getNewTeachers };
