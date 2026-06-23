export const DEPARTMENTS = [
  "Computer Science and Engineering (CSE)",
  "Electrical and Electronic Engineering (EEE)",
  "Civil and Environmental Engineering (CEE)",
  "Chemical Engineering and Polymer Science (CEP)",
  "Industrial and Production Engineering (IPE)",
  "Petroleum and Mining Engineering (PME)",
  "Mechanical Engineering (ME)",
  "Architecture (ARC)",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Statistics",
  "Geography and Environment",
  "Oceanography",
  "Public Administration",
  "Economics",
  "Social Work",
  "Political Studies",
  "Sociology",
  "Anthropology",
  "Business Administration",
  "English",
  "Bangla",
  "Biochemistry and Molecular Biology",
  "Genetic Engineering and Biotechnology",
  "Forestry and Environmental Science",
  "Food Engineering and Tea Technology",
] as const;

export const FIELDS_OF_STUDY = [
  // Computer Science & Engineering
  "Artificial Intelligence",
  "Machine Learning",
  "Deep Learning",
  "Computer Vision",
  "Natural Language Processing",
  "Robotics",
  "Human-Computer Interaction",
  "Distributed Systems",
  "Computer Networks",
  "Database Systems",
  "Information Retrieval",
  "Data Mining",
  "Computer Graphics",
  "Embedded Systems",
  "Digital Image Processing",
  "High Performance Computing",
  "Cloud Computing",
  "Cyber Security",
  "Blockchain",
  "Bioinformatics",
  "Internet of Things",

  // EEE
  "Power Systems",
  "Control Systems",
  "Signal Processing",
  "Wireless Communications",
  "VLSI Design",
  "Microelectronics",
  "Telecommunication Engineering",
  "Smart Grid Technology",

  // Mechanical / IPE
  "Manufacturing Engineering",
  "Industrial Automation",
  "Operations Research",
  "Supply Chain Management",
  "Quality Control",
  "Thermodynamics",
  "Fluid Mechanics",
  "Mechatronics",

  // Civil Engineering
  "Transportation Engineering",
  "Geotechnical Engineering",
  "Water Resources Engineering",
  "Construction Management",
  "Earthquake Engineering",
  "Urban Planning",

  // Chemical Engineering
  "Process Engineering",
  "Polymer Engineering",
  "Nanotechnology",
  "Catalysis",
  "Materials Science",

  // Petroleum & Mining
  "Reservoir Engineering",
  "Drilling Engineering",
  "Mining Engineering",
  "Geology",
  "Geophysics",

  // Architecture
  "Sustainable Architecture",
  "Urban Design",
  "Landscape Architecture",
  "Housing and Settlement Planning",

  // Physics
  "Astrophysics",
  "Particle Physics",
  "Nuclear Physics",
  "Condensed Matter Physics",
  "Theoretical Physics",

  // Chemistry
  "Analytical Chemistry",
  "Physical Chemistry",
  "Inorganic Chemistry",
  "Medicinal Chemistry",
  "Polymer Chemistry",

  // Mathematics & Statistics
  "Applied Statistics",
  "Probability Theory",
  "Mathematical Modeling",
  "Optimization",
  "Financial Mathematics",
  "Biostatistics",

  // Geography & Environment
  "GIS and Remote Sensing",
  "Climate Change",
  "Disaster Management",
  "Environmental Management",

  // Oceanography
  "Marine Science",
  "Marine Ecology",
  "Coastal Management",
  "Ocean Climate Studies",

  // Forestry & Environment
  "Forest Conservation",
  "Biodiversity",
  "Wildlife Management",
  "Environmental Sustainability",

  // Food Engineering
  "Food Processing",
  "Food Safety",
  "Nutrition Science",
  "Tea Science and Technology",

  // Biology / Biotechnology
  "Molecular Biology",
  "Biotechnology",
  "Genomics",
  "Proteomics",
  "Microbiology",
  "Immunology",
  "Cancer Biology",

  // Economics & Business
  "Development Economics",
  "Financial Economics",
  "Behavioral Economics",
  "Finance",
  "Accounting",
  "Human Resource Management",
  "Entrepreneurship",
  "Business Analytics",
  "International Business",

  // Social Sciences
  "Governance",
  "Public Administration",
  "International Relations",
  "Political Economy",
  "Social Development",
  "Gender Studies",
  "Criminology",
  "Development Studies",

  // English & Bangla
  "Literature",
  "Applied Linguistics",
  "Translation Studies",
  "Cultural Studies",
  "Creative Writing",
  "Language Education",

  // Anthropology
  "Cultural Anthropology",
  "Medical Anthropology",
  "Social Anthropology",
  "Archaeology",
] as const;
export type Department = typeof DEPARTMENTS[number];
export type FieldOfStudy = typeof FIELDS_OF_STUDY[number];
