const { type } = require("express/lib/response");

const EvenCourses = {
    firstYear: {
        CST: [
            { course: "DE", type: "non" },
            { course: "DE", type: "lab" },
            { course: "EC", type: "non" },
            { course: "EC", type: "lab" },
            { course: "EGD", type: "lab" },
            { course: "IKS", type: "non" },
            { course: "IPDC", type: "non" },
            { course: "Maths 2", type: "non" },
            { course: "MaD", type: "non" },
            { course: "MaD", type: "lab" },
            { course: "PM", type: "non" },
            { course: "PPS", type: "non" },
            { course: "PPS", type: "lab" }
        ],
        IT: [
            { course: "DE", type: "non" },
            { course: "DE", type: "lab" },
            { course: "EC", type: "non" },
            { course: "EC", type: "lab" },
            { course: "EGD", type: "lab" },
            { course: "IKS", type: "non" },
            { course: "IPDC", type: "non" },
            { course: "Maths 2", type: "non" },
            { course: "MaD", type: "non" },
            { course: "MaD", type: "lab" },
            { course: "PM", type: "non" },
            { course: "PPS", type: "non" },
            { course: "PPS", type: "lab" }
        ],
        CE: [
            { course: "DE", type: "non" },
            { course: "DE", type: "lab" },
            { course: "EC", type: "non" },
            { course: "EC", type: "lab" },
            { course: "EGD", type: "lab" },
            { course: "IKS", type: "non" },
            { course: "IPDC", type: "non" },
            { course: "Maths 2", type: "non" },
            { course: "MaD", type: "non" },
            { course: "MaD", type: "lab" },
            { course: "PM", type: "non" },
            { course: "PPS", type: "non" },
            { course: "PPS", type: "lab" }
        ],
        DS: [
            { course: "BEE", type: "non" },
            { course: "BEE", type: "lab" },
            { course: "EP", type: "non" },
            { course: "EP", type: "lab" },
            { course: "EGD", type: "lab" },
            { course: "IKS", type: "non" },
            { course: "IPDC", type: "non" },
            { course: "Maths 2", type: "non" },
            { course: "MaD", type: "non" },
            { course: "MaD", type: "lab" },
            { course: "PM", type: "non" },
            { course: "PPS", type: "non" },
            { course: "PPS", type: "lab" }
        ],
        ENC: [
            { course: "BEE", type: "non" },
            { course: "BEE", type: "lab" },
            { course: "EP", type: "non" },
            { course: "EP", type: "lab" },
            { course: "EGD", type: "lab" },
            { course: "IKS", type: "non" },
            { course: "IPDC", type: "non" },
            { course: "Maths 2", type: "non" },
            { course: "MaD", type: "non" },
            { course: "MaD", type: "lab" },
            { course: "PM", type: "non" },
            { course: "PPS", type: "non" },
            { course: "PPS", type: "lab" }
        ],
        AI: [
            { course: "BEE", type: "non" },
            { course: "BEE", type: "lab" },
            { course: "EP", type: "non" },
            { course: "EP", type: "lab" },
            { course: "EGD", type: "lab" },
            { course: "IKS", type: "non" },
            { course: "IPDC", type: "non" },
            { course: "Maths 2", type: "non" },
            { course: "MaD", type: "non" },
            { course: "MaD", type: "lab" },
            { course: "PM", type: "non" },
            { course: "PPS", type: "non" },
            { course: "PPS", type: "lab" }
        ]
    },

    secondYear: {
        CST: [
            { course: "Advance Technical Communication", type: "non" },
            { course: "DAA", type: "non" },
            { course: "DAA", type: "lab" },
            { course: "Environmental Science", type: "non" },
            { course: "Probability and Statistics", type: "non" },
            { course: "OS", type: "non" },
            { course: "OS", type: "lab" },
            { course: "JP", type: "non" },
            { course: "JP", type: "lab" },
            { course: "Minor Degree", type: "non" },
            { course: "Principle of Entrepreneurship", type: "non" },
            { course: "CAO", type: "non" }
        ],
        IT: [
            { course: "Foundation of Linear Algebra,P and S", type: "non" },
            { course: "Advance Technical Communication", type: "non" },
            { course: "CAO", type: "non" },
            { course: "DBMP", type: "non" },
            { course: "DBMP", type: "lab" },
            { course: "Environmental Science", type: "non" },
            { course: "Full Stack Development", type: "non" },
            { course: "Full Stack Development", type: "lab" },
            { course: "Principle of Entrepreneurship", type: "non" },
            { course: "System Software", type: "non" },
            { course: "System Software", type: "lab" }
        ],
        CE: [
            { course: "Advance Technical Communication", type: "non" },
            { course: "DAA", type: "non" },
            { course: "DAA", type: "lab" },
            { course: "Environmental Science", type: "non" },
            { course: "Foundation of Linear Algebra,P and S", type: "non" },
            { course: "OS", type: "non" },
            { course: "JP", type: "non" },
            { course: "JP", type: "lab" },
            { course: "Minor Degree", type: "non" },
            { course: "Principle of Entrepreneurship", type: "non" },
            { course: "CAO", type: "non" }
        ],
        DS: [
            { course: "Advance Technical Communication", type: "non" },
            { course: "DAA", type: "non" },
            { course: "DAA", type: "lab" },
            { course: "DBMP", type: "lab" },
            { course: "DBMS", type: "non" },
            { course: "Environmental Science", type: "non" },
            { course: "Foundation of Linear Algebra,P and S", type: "non" },
            { course: "Introduction to OS", type: "non" },
            { course: "JP", type: "non" },
            { course: "JP", type: "lab" },
            { course: "Minor Degree", type: "non" },
            { course: "Principle of Entrepreneurship", type: "non" }
        ],
        ENC: [
            { course: "Advance Technical Communication", type: "non" },
            { course: "Electromagnetic Wave Theory", type: "non" },
            { course: "Electromagnetic Wave Theory", type: "lab" },
            { course: "Environmental Science", type: "non" },
            { course: "Introduction to PCB", type: "non" },
            { course: "Introduction to PCB", type: "lab" },
            { course: "Minor Degree", type: "non" },
            { course: "Microcontroller", type: "non" },
            { course: "Microcontroller", type: "lab" },
            { course: "OOPS", type: "non" },
            { course: "OOPS", type: "lab" },
            { course: "Principle of Entrepreneurship", type: "non" },
            { course: "Probability Theory and Stochastic Process", type: "non" }
        ],
        AI: [
            { course: "Advance Technical Communication", type: "non" },
            { course: "Cloud Computing Fundamentals", type: "non" },
            { course: "Cloud Computing Fundamentals", type: "lab" },
            { course: "DBMS", type: "non" },
            { course: "DBMS", type: "lab" },
            { course: "Environmental Science", type: "non" },
            { course: "Foundation of Linear Algebra,P and S", type: "non" },
            { course: "Fuzzy Logic", type: "non" },
            { course: "Minor Degree", type: "non" },
            { course: "ML", type: "non" },
            { course: "ML", type: "lab" },
            { course: "Principle of Entrepreneurship", type: "non" }
        ]
    },
    thirdYear: {
        CST: [
            { course: "AI", type: "non" },
            { course: "AI", type: "lab" },
            { course: "CD", type: "non" },
            { course: "CD", type: "lab" },
            { course: "CN", type: "non" },
            { course: "CN", type: "lab"},
            { course: "NNDL", type: "non" },
            { course: "NNDL", type: "lab" },
            { course: "OOMD", type: "non" },
            { course: "UJ Lab", type: "lab" }
        ],
        IT: [
            { course: "AI", type: "non" },
            { course: "AI", type: "lab" },
            { course: "IOT", type: "non" },
            { course: "IOT", type: "lab" },
            { course: "CN", type: "non" },
            { course: "CN", type: "lab"},
            { course: "OOMD", type: "non" },
            { course: "UJ Lab", type: "lab" },
            { course: "ML", type: "non" },
            { course: "ML", type: "lab" }
        ],
        CE: [
            { course: "AI", type: "non" },
            { course: "AI", type: "lab" },
            { course: "CD", type: "non" },
            { course: "CD", type: "lab" },
            { course: "CN", type: "non" },
            { course: "CN", type: "lab"},
            { course: "NNDL", type: "non" },
            { course: "NNDL", type: "lab" },
            { course: "OOMD", type: "non" },
            { course: "EIKT", type: "non" },
            { course: "MaM", type: "non" }
        ],
        DS: [
            { course: "AI", type: "non" },
            { course: "AI", type: "lab" },
            { course: "Data Visualization", type: "non" },
            { course: "Data Visualization", type: "lab" },
            { course: "NNDL", type: "non" },
            { course: "NNDL", type: "lab" },
            { course: "EIKT", type: "non" },
            { course: "MaM", type: "non" },
            { course: "SE", type: "non" }
        ],
        ENC: [
            { course: "CN", type: "non" },
            { course: "CN", type: "lab"},
            { course: "Database Management", type: "non" },
            { course: "Database Management", type: "lab" },
            { course: "IOT", type: "non" },
            { course: "IOT", type: "lab" },
            { course: "Microwave Theory", type: "non" },
            { course: "VLSI", type: "non" },
            { course: "Web Technology", type: "non" },
            { course: "Web Technology", type: "lab" }
        ]
    },
    fourthYear: {
        CST: [{ course: "Cyber Law & Ethics", type: "non" }],
        IT: [{ course: "Geospatial Technology", type: "non" }],
        CE: [{ course: "Fundamentals of Bitcoin Technology", type: "non" }],
        DS: [{ course: "Cyber Law & Ethics", type: "non" }],
        ENC: [{ course: "Design, Visualization & Thinking", type: "non" }],
        common: [{ course: "Project", type: "non" }]
    }
};

const OddCourses = {
    secondYear: {
        CST: [
            { course: "Analog Electronics", type: "non" },
            { course: "Analog Electronics", type: "lab" },
            { course: "Digital Electronics", type: "non" },
            { course: "Digital Electronics", type: "lab" },
            { course: "DSA", type: "non" },
            { course: "DSA", type: "lab" },
            { course: "IW Lab", type: "lab" },
            { course: "Maths 3", type: "non" }
        ],
        IT: [
            { course: "Analog Electronics", type: "non" },
            { course: "Analog Electronics", type: "lab" },
            { course: "Digital Electronics", type: "non" },
            { course: "Digital Electronics", type: "lab" },
            { course: "DSA", type: "non" },
            { course: "DSA", type: "lab" },
            { course: "IW Lab", type: "lab" },
            { course: "Maths 3", type: "non" }
        ],
        ENC: [
            { course: "Applied Mathematics", type: "non" },
            { course: "Applied Mathematics Tutorial", type: "non" },
            { course: "CAO", type: "non" },
            { course: "Constitution of India (COI)", type: "non" },
            { course: "DSA", type: "lab" },
            { course: "Digital System Design", type: "non" },
            { course: "Digital System Design", type: "lab" },
            { course: "Electronic Devices", type: "non" },
            { course: "Electronic Devices", type: "lab" },
            { course: "Economics for Engineers", type: "non" },
            { course: "Signals System", type: "non" }
        ],
        CE: [
            { course: "Analog Electronics", type: "non" },
            { course: "Analog Electronics", type: "lab" },
            { course: "Digital Electronics", type: "non" },
            { course: "Digital Electronics", type: "lab" },
            { course: "DSA", type: "non" },
            { course: "DSA", type: "lab" },
            { course: "Economics for Engineers", type: "non" },
            { course: "IW Lab", type: "lab" },
            { course: "Maths 3", type: "non" }
        ],
        DS: [
            { course: "Analog and Digital Electronics", type: "non" },
            { course: "Analog and Digital Electronics", type: "lab" },
            { course: "DSA", type: "non" },
            { course: "DSA", type: "lab" },
            { course: "Economics for Engineers", type: "non" },
            { course: "Introduction to Data Science", type: "non" },
            { course: "Introduction to Data Science", type: "lab" },
            { course: "Maths 3", type: "non" }
        ]
    },
    thirdYear: {
        CST: [
            { course: "DBMS", type: "non" },
            { course: "DBMS", type: "lab" },
            { course: "EIKT", type: "non" },
            { course: "Formal Language and Automata Theory", type: "non" },
            { course: "Formal Language and Automata Theory", type: "lab" },
            { course: "OOPS", type: "non" },
            { course: "OOPS", type: "lab" },
            { course: "Signals System", type: "non" },
            { course: "Signals System", type: "lab" },
            { course: "SE", type: "non" },
            { course: "SE", type: "lab" }
        ],
        IT: [
            { course: "DBMS", type: "non" },
            { course: "DBMS", type: "lab" },
            { course: "EIKT", type: "non" },
            { course: "DIVP", type: "non" },
            { course: "DIVP", type: "lab" },
            { course: "OOPS", type: "non" },
            { course: "OOPS", type: "lab" },
            { course: "DSP", type: "non" },
            { course: "DSP", type: "lab" },
            { course: "SE", type: "non" },
            { course: "SE", type: "lab" }
        ],
        ENC: [
            { course: "Analog and Digital Communication (AaDC)", type: "non" },
            { course: "Analog and Digital Communication (AaDC)", type: "lab" },
            { course: "Control System", type: "non" },
            { course: "Control System", type: "lab" },
            { course: "DSP", type: "non" },
            { course: "DSP", type: "lab" },
            { course: "Embedded", type: "non" },
            { course: "Embedded", type: "lab" },
            { course: "EIKT", type: "non" },
            { course: "EMI", type: "lab" },
            { course: "Effective Technical Communication (ETC)", type: "non" },
            { course: "Effective Technical Communication (ETC)", type: "lab" },
            { course: "Signals System", type: "non" }
        ]
    },
    fourthYear: {
        CST: [
            { course: "CC", type: "non" },
            { course: "CC", type: "lab" },
            { course: "CDA", type: "non" },
            { course: "CDA", type: "lab" },
            { course: "CNS", type: "non" },
            { course: "CNS", type: "lab" },
            { course: "Game theory", type: "non" },
            { course: "TCPE", type: "non" }
        ],
        IT: [
            { course: "CC", type: "non" },
            { course: "CC", type: "lab" },
            { course: "CDA", type: "non" },
            { course: "CDA", type: "lab" },
            { course: "CNS", type: "non" },
            { course: "CNS", type: "lab" },
            { course: "Digital marketing", type: "non" },
            { course: "Digital marketing", type: "lab" },
            { course: "TCPE", type: "non" }
        ],
        CE: [
            { course: "CC", type: "non" },
            { course: "CC", type: "lab" },
            { course: "CDA", type: "non" },
            { course: "CDA", type: "lab" },
            { course: "CNS", type: "non" },
            { course: "CNS", type: "lab" },
            { course: "NLP", type: "non" },
            { course: "NLP", type: "lab" }
        ],
        DS: [
            { course: "Business Intellect with DA", type: "non" },
            { course: "Business Intellect with DA", type: "lab" },
            { course: "Data Science in Cloud Computing (DSCC)", type: "non" },
            { course: "Data Science in Cloud Computing (DSCC)", type: "lab" },
            { course: "NLP", type: "non" },
            { course: "NLP", type: "lab" },
            { course: "Social Media Analytics (SMA)", type: "non" },
            { course: "Social Media Analytics (SMA)", type: "lab" }
        ],
        ENC: [
            { course: "AI", type: "non" },
            { course: "AI", type: "lab" },
            { course: "Disaster Management (DM)", type: "non" },
            { course: "Fibre Optic Communication (FOC)", type: "non" },
            { course: "Information Theory and Coding (ITC)", type: "non" },
            { course: "Information Theory and Coding (ITC)", type: "lab" },
            { course: "Mobile Communication and WSN", type: "non" },
            { course: "Mobile Communication and WSN", type: "lab" },
            { course: "ML", type: "non" },
            { course: "ML", type: "lab" }
        ]
    }
};

// Export a single module with all the data
module.exports = {
    branches: ["CST", "CE", "IT", "DS", "AI", "ENC"],
    EvenCourses,
    OddCourses,
    classrooms: [
        { name: "011" },
        { name: "010" },
        { name: "105" },
        { name: "109" },
        { name: "210" },
        { name: "502" },
        { name: "108" },
        { name: "505" },
        { name: "408" },
        { name: "407" },
        { name: "307" },
        { name: "308" },
        { name: "304" },
        { name: "203" },
        { name: "202" },
        { name: "207" }
    ],
    labs: [
        { name: "TCC-1" },
        { name: "TCC-3" },
        { name: "TCC-4" },
        { name: "SCC-2" },
        { name: "SCC-3" },
        { name: "SCC-5" },
        { name: "TCC-2" },
        { name: "IoT Lab" },
        { name: "NPTEL Lab" },
        { name: "Microprocessor Lab" },
        { name: "SCC-4" },
        { name: "SCC-1" },
        { name: "Control Instrument Lab (CI)" },
        { name: "Advance Communication Lab (AdvComm)" },
        { name: "Advance EMI Lab (AEMI)" },
        { name: "AS Lab" },
        { name: "New1" },
        { name: "New2" },
        { name: "CCM Lab (CC and M)" },
        { name: "IC Lab (Integrated Circuit)" },
        { name: "BE Lab (Basic Electronics Lab)" },
        { name: "Communication Lab" },
        { name: "Conference Hall" }
    ]
};

