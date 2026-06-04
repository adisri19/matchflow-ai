const fs = require('fs');
const path = require('path');

const firstNamesMale = [
  "Aarav", "Arjun", "Aditya", "Vihaan", "Vivaan", "Reyansh", "Muhammad", "Sai", "Ishaan", "Aayan",
  "Atharv", "Shaurya", "Kabir", "Rudra", "Aryan", "Ayaan", "Krishna", "Rahal", "Dev", "Anant",
  "Yash", "Pranav", "Rohan", "Siddharth", "Rahul", "Karan", "Abhishek", "Amit", "Vikram", "Sanjay",
  "Alok", "Sameer", "Rajesh", "Vivek", "Manish", "Gaurav", "Nikhil", "Akash", "Varun", "Rishabh",
  "Kunwar", "Harsh", "Mayank", "Piyush", "Tushar", "Sandeep", "Deepak", "Anil", "Sunil", "Ravi"
];

const firstNamesFemale = [
  "Aadhya", "Ananya", "Sanya", "Diya", "Priya", "Anushka", "Ira", "Riya", "Kavya", "Kiara",
  "Meera", "Zara", "Aanya", "Prisha", "Myra", "Saanvi", "Aaradhya", "Angel", "Ahana", "Zoya",
  "Shruti", "Neha", "Pooja", "Divya", "Kirti", "Komal", "Sneha", "Aditi", "Shreya", "Nisha",
  "Preeti", "Ritu", "Swati", "Shalini", "Priyanka", "Deepika", "Kriti", "Sonam", "Alia", "Anjali",
  "Kiran", "Vidya", "Nandini", "Ridhima", "Ishita", "Avani", "Tanvi", "Suhana", "Simran", "Mehak"
];

const lastNames = [
  "Sharma", "Verma", "Gupta", "Patel", "Mehta", "Joshi", "Singh", "Kumar", "Iyer", "Nair",
  "Reddy", "Choudhury", "Das", "Banerjee", "Chatterjee", "Sen", "Roy", "Mukherjee", "Mishra", "Trivedi",
  "Pandey", "Dwivedi", "Dubey", "Shukla", "Bajpai", "Rao", "Hegde", "Shetty", "Pillai", "Menon",
  "Deshmukh", "Kulkarni", "Joshi", "Patil", "Bhide", "Apte", "Sinha", "Prasad", "Srivastava", "Saxena",
  "Johri", "Mathur", "Bhatnagar", "Malhotra", "Kapoor", "Khanna", "Mehra", "Grover", "Anand", "Chawla"
];

const colleges = [
  "IIT Bombay", "IIT Delhi", "IIT Madras", "BITS Pilani", "Delhi College of Engineering",
  "IIM Ahmedabad", "IIM Bangalore", "IIM Calcutta", "FMS Delhi", "XLRI Jamshedpur",
  "SRCC Delhi", "St. Xavier's College Mumbai", "Christ University Bangalore", "Loyola College Chennai",
  "Manipal Academy of Higher Education", "VIT Vellore", "RV College of Engineering Bangalore",
  "BITS Mesra", "Delhi University", "Mumbai University", "Pune University", "Anna University"
];

const degrees = [
  "B.Tech in Computer Science", "B.Tech in Mechanical Engineering", "M.Tech in Software Engineering",
  "MBA in Finance", "MBA in Marketing", "MBA in HR", "MBBS", "MD in Pediatrics", "MS in General Surgery",
  "B.Arch", "B.Com Honors", "M.Com", "B.A. in Economics", "M.A. in English", "B.Sc in Mathematics",
  "M.Sc in Biotechnology", "BBA", "BCA", "MCA", "Ph.D. in Physics"
];

const companies = [
  "Google", "Microsoft", "Amazon", "Meta", "TCS", "Infosys", "Wipro", "Cognizant",
  "McKinsey & Company", "Boston Consulting Group", "Goldman Sachs", "J.P. Morgan",
  "HDFC Bank", "ICICI Bank", "Reliance Industries", "Tata Motors", "Aditya Birla Group",
  "Apollo Hospitals", "Fortis Healthcare", "PwC", "Deloitte", "EY", "KPMG"
];

const designations = [
  "Software Engineer", "Senior Software Engineer", "Product Manager", "Lead Product Manager",
  "Management Consultant", "Engagement Manager", "Investment Banking Analyst", "VP Finance",
  "Assistant Manager", "Marketing Director", "UX Designer", "Senior Data Scientist",
  "General Physician", "Pediatrician", "Architect", "Research Scientist", "Chartered Accountant",
  "HR Manager", "Operations Lead", "Systems Engineer"
];

const cities = [
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Delhi", state: "Delhi" },
  { name: "Bangalore", state: "Karnataka" },
  { name: "Pune", state: "Maharashtra" },
  { name: "Hyderabad", state: "Telangana" },
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Kolkata", state: "West Bengal" },
  { name: "Ahmedabad", state: "Gujarat" },
  { name: "Jaipur", state: "Rajasthan" },
  { name: "Indore", state: "Madhya Pradesh" },
  { name: "Lucknow", state: "Uttar Pradesh" }
];

const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Parsi"];

const castesMap = {
  "Hindu": ["Brahmin", "Kshatriya", "Vaishya", "Kayastha", "Khatri", "Maratha", "Nair", "Iyer", "Iyengar", "Jat"],
  "Muslim": ["Sunni", "Shia", "Sayyid", "Sheikh"],
  "Christian": ["Roman Catholic", "Protestant", "Syrian Christian"],
  "Sikh": ["Jat Sikh", "Khatri Sikh", "Ramgarhia"],
  "Jain": ["Digambar", "Shvetambar", "Oswal"],
  "Parsi": ["Not Applicable"]
};

const languages = ["Hindi", "English", "Punjabi", "Bengali", "Gujarati", "Marathi", "Tamil", "Telugu", "Kannada", "Malayalam"];

const hobbiesPool = [
  "Reading", "Hiking", "Cooking", "Photography", "Traveling", "Yoga", "Gaming", "Gardening",
  "Painting", "Running", "Cycling", "Playing Guitar", "Singing", "Blogging", "Dancing",
  "Watching Movies", "Swimming", "Stargazing", "Cooking Indian Cuisine", "Gym/Fitness"
];

const valuesPool = [
  "Family-oriented", "Career-focused", "Traditional", "Modern", "Spiritual", "Independent",
  "Adventurous", "Compassionate", "Ambitious", "Down-to-earth", "Liberal", "Cultured",
  "Health-conscious", "Intellectual"
];

const maleBioTemplates = [
  "I am a warm, ambitious individual who balances a busy tech career with personal growth. I value deep conversations, family gatherings, and exploring new cities. Looking for a partner who is passionate about her career, values family, and enjoys the small moments in life.",
  "Raised in a close-knit family, I believe in mutual respect and shared growth. I am passionate about my work as a {designation} and spend my free time {hobby1} and {hobby2}. Seeking a companion who is positive, values honesty, and has a modern yet grounded outlook.",
  "A tech-enthusiast by day and {hobby1} lover by night. I value intellectual curiosity and an active lifestyle. I'm seeking someone with whom I can share both career aspirations and weekend adventures. Let's build a warm home filled with laughter.",
  "I would describe myself as a simple, family-oriented person who values work-life balance. I appreciate good food, music, and travel. Looking for a warm-hearted girl who is independent, expressive, and ready to embark on a beautiful lifelong journey together."
];

const femaleBioTemplates = [
  "I am an independent, career-driven professional who deeply cherishes family roots. I love {hobby1} and exploring nature. Looking for a partner who is mature, supportive, and shares a similar balance of modern values and traditional respect.",
  "Creative and energetic, I work as a {designation} and love making the most of every day. In my free time, you'll find me {hobby1} or {hobby2}. I value communication, respect, and mutual support in a relationship. Seeking a partner who is my equal, friend, and confidant.",
  "Raised with strong family values, I believe in kindness and ambition. I'm looking for a partner who is career-oriented, family-minded, and has a great sense of humor. Someone who is willing to co-create a peaceful and progressive life together.",
  "I love life, travel, and constant learning. Professionally, I am dedicated to my role at {company}. Personally, I enjoy {hobby1}. Looking for an honest, intellectually stimulating partner who values trust, deep conversations, and family connections."
];

// Unsplash high quality portraits representing Indian/diverse professional adults
const maleImages = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=350",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=350",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300&h=350",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=350",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300&h=350",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=350",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=350", // actually female, let's filter carefully
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=300&h=350",
  "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=300&h=350",
  "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?auto=format&fit=crop&q=80&w=300&h=350"
];

// Better to have direct placeholder styled portraits that match Indian demographics or look nice
const portraitPoolMale = [
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400", // female
  "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?auto=format&fit=crop&q=80&w=400&h=400"
];

// Real Indian/South Asian Unsplash portraits
const indianMalePortraits = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400", // Generic but good
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400&h=400"
];

const indianFemalePortraits = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400"
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateDOBandAge() {
  const age = Math.floor(Math.random() * 16) + 23; // 23 to 38
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - age;
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return {
    age,
    dob: `${birthYear}-${month}-${day}`
  };
}

function generatePhoneNumber() {
  const prefix = getRandomItem(["98", "99", "97", "96", "95", "88", "87", "76"]);
  const suffix = Math.floor(10000000 + Math.random() * 90000000);
  return `+91 ${prefix}${String(suffix).slice(0, 8)}`;
}

function generateSiblings() {
  const count = Math.floor(Math.random() * 4);
  if (count === 0) return "None";
  const types = ["brother", "sister"];
  const ages = ["younger", "older"];
  let res = [];
  for (let i = 0; i < count; i++) {
    res.push(`1 ${getRandomItem(ages)} ${getRandomItem(types)}`);
  }
  return res.join(", ");
}

const profiles = [];

// Generate 50 Males
for (let i = 0; i < 50; i++) {
  const firstName = firstNamesMale[i % firstNamesMale.length];
  const lastName = lastNames[i % lastNames.length];
  const { age, dob } = generateDOBandAge();
  const height = Math.floor(Math.random() * 31) + 165; // 165 to 195 cm
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  const phone = generatePhoneNumber();
  const college = getRandomItem(colleges);
  const degree = getRandomItem(degrees);
  const income = Math.floor(Math.random() * 73) + 8; // 8 to 80 LPA
  const company = getRandomItem(companies);
  const designation = getRandomItem(designations);
  const cityObj = getRandomItem(cities);
  const maritalStatus = getRandomItem(["Never Married", "Never Married", "Never Married", "Divorced", "Widowed"]);
  const religion = getRandomItem(religions);
  const castes = castesMap[religion] || ["General"];
  const caste = getRandomItem(castes);
  const wantsKids = getRandomItem(["Yes", "Yes", "Open", "No"]);
  const openToRelocate = getRandomItem(["Yes", "No", "Maybe"]);
  const openToPets = getRandomItem(["Yes", "No", "Maybe"]);
  const profileLanguages = Array.from(new Set(["English", getRandomItem(languages), getRandomItem(languages)]));
  const hobbies = getRandomItems(hobbiesPool, 3);
  const values = getRandomItems(valuesPool, 3);
  
  let bio = getRandomItem(maleBioTemplates)
    .replace("{designation}", designation)
    .replace("{company}", company)
    .replace("{hobby1}", hobbies[0])
    .replace("{hobby2}", hobbies[1]);

  // Image selection
  const profileImage = indianMalePortraits[i % indianMalePortraits.length];

  profiles.push({
    id: `prof-m-${i + 1}`,
    firstName,
    lastName,
    gender: "Male",
    dob,
    age,
    country: "India",
    city: cityObj.name,
    state: cityObj.state,
    height,
    email,
    phone,
    college,
    degree,
    income,
    company,
    designation,
    maritalStatus,
    languages: profileLanguages,
    siblings: generateSiblings(),
    religion,
    caste,
    wantsKids,
    openToRelocate,
    openToPets,
    hobbies,
    values,
    bio,
    profileImage,
    notes: ""
  });
}

// Generate 50 Females
for (let i = 0; i < 50; i++) {
  const firstName = firstNamesFemale[i % firstNamesFemale.length];
  const lastName = lastNames[(i + 25) % lastNames.length]; // offset lastnames
  const { age, dob } = generateDOBandAge();
  const height = Math.floor(Math.random() * 26) + 150; // 150 to 175 cm
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  const phone = generatePhoneNumber();
  const college = getRandomItem(colleges);
  const degree = getRandomItem(degrees);
  const income = Math.floor(Math.random() * 63) + 6; // 6 to 68 LPA
  const company = getRandomItem(companies);
  const designation = getRandomItem(designations);
  const cityObj = getRandomItem(cities);
  const maritalStatus = getRandomItem(["Never Married", "Never Married", "Never Married", "Divorced", "Widowed"]);
  const religion = getRandomItem(religions);
  const castes = castesMap[religion] || ["General"];
  const caste = getRandomItem(castes);
  const wantsKids = getRandomItem(["Yes", "Yes", "Open", "No"]);
  const openToRelocate = getRandomItem(["Yes", "No", "Maybe"]);
  const openToPets = getRandomItem(["Yes", "No", "Maybe"]);
  const profileLanguages = Array.from(new Set(["English", getRandomItem(languages), getRandomItem(languages)]));
  const hobbies = getRandomItems(hobbiesPool, 3);
  const values = getRandomItems(valuesPool, 3);
  
  let bio = getRandomItem(femaleBioTemplates)
    .replace("{designation}", designation)
    .replace("{company}", company)
    .replace("{hobby1}", hobbies[0])
    .replace("{hobby2}", hobbies[1]);

  const profileImage = indianFemalePortraits[i % indianFemalePortraits.length];

  profiles.push({
    id: `prof-f-${i + 1}`,
    firstName,
    lastName,
    gender: "Female",
    dob,
    age,
    country: "India",
    city: cityObj.name,
    state: cityObj.state,
    height,
    email,
    phone,
    college,
    degree,
    income,
    company,
    designation,
    maritalStatus,
    languages: profileLanguages,
    siblings: generateSiblings(),
    religion,
    caste,
    wantsKids,
    openToRelocate,
    openToPets,
    hobbies,
    values,
    bio,
    profileImage,
    notes: ""
  });
}

// Ensure the data directory exists
const dir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'profiles.json'), JSON.stringify(profiles, null, 2));
console.log("Successfully generated 100 profiles and saved to data/profiles.json");
