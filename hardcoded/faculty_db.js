const facultyData = [
    { name: "Dr Shikha Nema", subjects: [
        { course: "Database Management", type: "both", teachesTo: ["ENC"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Dr Sanjay Shitole", subjects: [
        { course: "ML", type: "both", teachesTo: ["IT"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Dr Kavita Mhatre", subjects: [
        { course: "IOT", type: "non", teachesTo: ["IT"] },
        { course: "Environmental Science", type: "non", teachesTo: ["DS"] },
        { course: "Environmental Science", type: "non", teachesTo: ["ENC"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Ms Rajni Nair", subjects: [
        { course: "Advance Technical Communication", type: "non", teachesTo: ["CST", "IT", "AI", "DS", "CE", "ENC"] }
    ]},
    { name: "Mr Bharat Patil", subjects: [
        { course: "Electromagnetic Wave Theory", type: "both", teachesTo: ["ENC"] },
        { course: "IOT", type: "non", teachesTo: ["ENC"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Mr Yashwant Kale", subjects: [
        { course: "Microcontroller", type: "both", teachesTo: ["ENC"] },
        { course: "MaM", type: "non", teachesTo: ["CE"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Dr Seema Hanchate", subjects: [
        { course: "CN", type: "both", teachesTo: ["ENC"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Mrs Kumud Wasnik", subjects: [
        { course: "DBMP", type: "both", teachesTo: ["AI"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Mr Ajay Lahane", subjects: [
        { course: "DE", type: "both", teachesTo: ["IT"] },
        { course: "MaM", type: "both", teachesTo: ["DS"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Ms Kiran Dange", subjects: [
        { course: "BEE", type: "both", teachesTo: ["AI"] },
        { course: "Foundation of Linear Algebra, P and S", type: "non", teachesTo: ["CE"] },
        { course: "PPS", type: "lab", teachesTo: ["ENC"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Ms Sujata Kullar", subjects: [
        { course: "DAA", type: "both", teachesTo: ["CST"] },
        { course: "PPS", type: "lab", teachesTo: ["IT"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Mr Sumedh Pundkar", subjects: [
        { course: "JP", type: "both", teachesTo: ["CST"] },
        { course: "OOMD", type: "non", teachesTo: ["CST"] },
        { course: "UJ", type: "lab", teachesTo: ["CST"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Dr. Rachana Dhanawat", subjects: [
        { course: "NNDL", type: "both", teachesTo: ["CE"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Mr. Mohan Bonde", subjects: [
        { course: "DAA", type: "both", teachesTo: ["DS"] },
        { course: "PPS", type: "lab", teachesTo: ["IT"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Mr. Rajesh Kolte", subjects: [
        { course: "CN", type: "both", teachesTo: ["IT"] },
        { course: "Project", teachesTo: ["common"] },
        { course: "SE", type: "non", teachesTo: ["DS"] }
    ]},
    { name: "Dr. Anita Morey", subjects: [
        { course: "AI", type: "both", teachesTo: ["IT"] },
        { course: "Fuzzy Logic", type: "non", teachesTo: ["AI"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Ms. Prachi Dhanawat", subjects: [
        { course: "DBMP", type: "both", teachesTo: ["IT"] },
        { course: "DBMS", type: "lab", teachesTo: ["DS"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Mr. Prakash Khelage", subjects: [
        { course: "Cyber Law & Ethics", type: "non", teachesTo: ["CST"] },
        { course: "Cyber Law & Ethics", type: "non", teachesTo: ["DS"] },
        { course: "System Software", type: "both", teachesTo: ["IT"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Ms. Arundhati M", subjects: [
        { course: "AI", type: "both", teachesTo: ["CE", "DS"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Ms. Poonam More", subjects: [
        { course: "Design Thinking", type: "non", teachesTo: ["ENC"] },
        { course: "Design, Visualization & Thinking", type: "non", teachesTo: ["ENC"] },
        { course: "OOPS", type: "lab", teachesTo: ["ENC"] },
        { course: "PPS", type: "lab", teachesTo: ["ENC"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Ms Sonali Bodekar", subjects: [
        { course: "Full Stack Development", type: "both", teachesTo: ["IT"] },
        { course: "PPS", type: "non", teachesTo: ["IT"] },
        { course: "UJ", type: "lab", teachesTo: ["IT"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Ms Prajakta Gotarne", subjects: [
        { course: "NNDL", type: "both", teachesTo: ["CST"] },
        { course: "PM", type: "non", teachesTo: ["CST"] },
        { course: "UJ", type: "lab", teachesTo: ["CST"] },
        { course: "Project", teachesTo: ["common"] }
    ]},
    { name: "Ms Merrin Solomen", subjects: [
        { course: "DBMP", type: "lab", teachesTo: ["DS"] },
        { course: "DBMS", type: "non", teachesTo: ["DS"] },
        { course: "JP", type: "non", teachesTo: ["DS"] },
        { course: "MaD", type: "both", teachesTo: ["DS"] },
        { course: "PPS", type: "lab", teachesTo: ["ENC"] }
    ]},
    { name: "Ms Monica Charate", subjects: [
        { course: "CN", type: "both", teachesTo: ["CST"] },
        { course: "MaD", type: "both", teachesTo: ["DS"] },
        { course: "MaD", type: "both", teachesTo: ["CST"] }
    ]},
    { name: "Ms Sharmila AK", subjects: [
        { course: "Maths 2", type: "non", teachesTo: ["AI", "DS", "CE", "ENC"] }
    ]},
    { name: "Dr Sushma Shreshtha", subjects: [
        { course: "Maths 2", type: "non", teachesTo: ["CST", "IT"] },
        { course: "Probability and Statistics", type: "non", teachesTo: ["CST", "DS"] }
    ]},
    { name: "Dr Jyoti Squera", subjects: [
        { course: "EC", type: "both", teachesTo: ["CST", "IT", "CE"] }
    ]},
    { name: "Dr Pravin Nikam", subjects: [
        { course: "EP", type: "both", teachesTo: ["AI", "DS", "ENC"] }
    ]},
    { name: "Dr Vilas Kharat", subjects: [
        { course: "EGD", type: "lab", teachesTo: ["DS"] },
        { course: "Principles of Entrepreneurship", type: "non", teachesTo: ["ENC", "CE", "AI"] }
    ]},
    { name: "Manoj Ghag", subjects: [
        { course: "EGD", type: "lab", teachesTo: ["CST", "IT", "AI", "CE", "ENC"] }
    ]},
    { name: "Ms Vanashri Ramteke", subjects: [
        { course: "CAO", type: "non", teachesTo: ["IT", "CST"] },
        { course: "DE", type: "lab", teachesTo: ["IT"] },
        { course: "IKS", type: "non", teachesTo: ["CST", "DS", "IT", "AI", "CE"] }
    ]},
    { name: "Ms Samidha", subjects: [
        { course: "JP", type: "lab", teachesTo: ["DS"] },
        { course: "OS", type: "both", teachesTo: ["CE"] },
        { course: "PM", type: "non", teachesTo: ["DS", "CE"] }
    ]},
    { name: "Dr Akhilesh Pande", subjects: [
        { course: "Introduction to PCB", type: "both", teachesTo: ["ENC"] },
        { course: "Microwave Theory", type: "non", teachesTo: ["ENC"] }
    ]},
    { name: "Ms Sheetal Mhatre", subjects: [
        { course: "BEE", type: "both", teachesTo: ["DS"] },
        { course: "DE", type: "both", teachesTo: ["CST"] }
    ]},
    { name: "Ms Prachi Natu", subjects: [
        { course: "Introduction to OS", type: "non", teachesTo: ["DS"] },
        { course: "MaD", type: "lab", teachesTo: ["IT"] },
        { course: "NNDL", type: "both", teachesTo: ["DS"] }
    ]},
    { name: "Mr Sanjay Ranveer", subjects: [
        { course: "Environmental Science", type: "non", teachesTo: ["IT"] },
        { course: "EIKT", type: "non", teachesTo: ["DS"] },
        { course: "JP", type: "lab", teachesTo: ["DS"] },
        { course: "MaD", type: "both", teachesTo: ["CE"] },
        { course: "PM", type: "non", teachesTo: ["IT", "AI"] }
    ]},
    { name: "Mr Sudhakar Yerme", subjects: [
        { course: "CN", type: "both", teachesTo: ["CE"] },
        { course: "Environmental Science", type: "non", teachesTo: ["CST"] },
        { course: "JP", type: "lab", teachesTo: ["DS"] }
    ]},
    { name: "Ms Neha Athawale", subjects: [
        { course: "DE", type: "both", teachesTo: ["CE"] },
        { course: "Foundation of Linear Algebra, P and S", type: "non", teachesTo: ["IT", "AI"] },
        { course: "MaD", type: "both", teachesTo: ["ENC"] }
    ]},
    { name: "Ms Toshi Jain", subjects: [
        { course: "DAA", type: "both", teachesTo: ["CE"] },
        { course: "PPS", type: "both", teachesTo: ["CE"] }
    ]},
    { name: "Snehal Bindu", subjects: [
        { course: "PPS", type: "both", teachesTo: ["DS", "AI"] }
    ]},
    { name: "Supriya Ingale", subjects: [
        { course: "MaD", type: "both", teachesTo: ["AI"] },
        { course: "ML", type: "both", teachesTo: ["AI"] }
    ]},
    { name: "Sonal Kadam", subjects: [
        { course: "CD", type: "both", teachesTo: ["CST"] },
        { course: "PPS", type: "both", teachesTo: ["CST"] }
    ]},
    { name: "Shennaz Siddiqui", subjects: [
        { course: "AI", type: "both", teachesTo: ["CST"] },
        { course: "Web Technology", type: "both", teachesTo: ["ENC"] }
    ]},
    { name: "Ms Shraddha Rokade", subjects: [
        { course: "AI", type: "both", teachesTo: ["CE"] },
        { course: "Fundamentals of Bitcoin Technology", type: "non", teachesTo: ["CE"] },
        { course: "JP", type: "both", teachesTo: ["CE"] }
    ]},
    { name: "Ms Poonam Dharpawar", subjects: [
        { course: "Data Visualization", type: "both", teachesTo: ["DS"] },
        { course: "Geospatial Technology", type: "non", teachesTo: ["IT"] },
        { course: "JP", type: "lab", teachesTo: ["DS"] },
        { course: "OOMD", type: "non", teachesTo: ["IT"] }
    ]},
    { name: "Ms Pratibha Mahakal", subjects: [
        { course: "BEE", type: "both", teachesTo: ["ENC"] },
        { course: "Database Management", type: "lab", teachesTo: ["ENC"] },
        { course: "Environmental Science", type: "non", teachesTo: ["AI"] }
    ]},
    { name: "Ms Iffat Kazi", subjects: [
        { course: "CAO", type: "non", teachesTo: ["CE"] },
        { course: "CD", type: "both", teachesTo: ["CE"] },
        { course: "PPS", type: "lab", teachesTo: ["CE"] }
    ]},
    { name: "Dr Santoshi Pote", subjects: [
        { course: "PM", type: "non", teachesTo: ["ENC"] },
        { course: "Project", teachesTo: ["common"] },
        { course: "VLSI", type: "non", teachesTo: ["ENC"] }
    ]},
    { name: "Ms Pooja Jambale", subjects: [
        { course: "IPDC", type: "non", teachesTo: ["CST", "ENC", "IT", "AI", "DS", "CE"] }
    ]},
    { name: "Ms Poonam V", subjects: [
        { course: "Cloud Computing Fundamentals", type: "both", teachesTo: ["AI"] },
        { course: "OS", type: "both", teachesTo: ["CST"] }
    ]}    
];

module.exports = { teachers: facultyData };

console.log("faculty_db.js loaded successfully.");


