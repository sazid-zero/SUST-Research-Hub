-- Seed theses 1-15 with co-authors
-- Run this third

-- Thesis 1: Deep Learning for Image Recognition
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Deep Learning Approaches for Advanced Image Recognition',
  'This thesis explores novel deep learning architectures for image recognition tasks, achieving state-of-the-art results on benchmark datasets.',
  'Computer Science & Engineering',
  ARRAY['deep learning', 'image recognition', 'neural networks', 'computer vision'],
  2024,
  '2024-01-15',
  -- Added LIMIT 1 to prevent "more than one row" error
  (SELECT id FROM users WHERE email = 'dr.smith@university.edu' LIMIT 1),
  'approved',
  1243,
  456
);
-- Using actual student emails from 04-seed-students.sql
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Deep Learning Approaches for Advanced Image Recognition' LIMIT 1),
 -- Added LIMIT 1 to all author subqueries
 (SELECT id FROM users WHERE email = 'ahmed.khan@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Deep Learning Approaches for Advanced Image Recognition' LIMIT 1),
 (SELECT id FROM users WHERE email = 'karim.hassan@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Deep Learning Approaches for Advanced Image Recognition' LIMIT 1),
 'pdf', 'deep-learning-image-recognition.pdf', '/files/thesis-1.pdf', 5242880);

-- Thesis 2: Blockchain Security
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Blockchain Technology: Security Analysis and Applications',
  'Comprehensive analysis of blockchain security mechanisms and their applications in distributed systems.',
  'Computer Science & Engineering',
  ARRAY['blockchain', 'security', 'cryptography', 'distributed systems'],
  2024,
  '2024-02-20',
  (SELECT id FROM users WHERE email = 'dr.johnson@university.edu' LIMIT 1),
  'approved',
  987,
  321
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Blockchain Technology: Security Analysis and Applications' LIMIT 1),
 (SELECT id FROM users WHERE email = 'noor.hassan@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Blockchain Technology: Security Analysis and Applications' LIMIT 1),
 (SELECT id FROM users WHERE email = 'tanvir.ahmed@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Blockchain Technology: Security Analysis and Applications' LIMIT 1),
 'pdf', 'blockchain-security.pdf', '/files/thesis-2.pdf', 4194304);

-- Thesis 3: Quantum Computing Algorithms
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Quantum Computing: Novel Algorithms for Complex Problem Solving',
  'Development of quantum algorithms for solving NP-hard problems with improved time complexity.',
  'Computer Science & Engineering',
  ARRAY['quantum computing', 'algorithms', 'complexity theory', 'optimization'],
  2024,
  '2024-04-10',
  (SELECT id FROM users WHERE email = 'dr.smith@university.edu' LIMIT 1),
  'approved',
  756,
  234
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Quantum Computing: Novel Algorithms for Complex Problem Solving' LIMIT 1),
 (SELECT id FROM users WHERE email = 'ahmed.khan@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Quantum Computing: Novel Algorithms for Complex Problem Solving' LIMIT 1),
 (SELECT id FROM users WHERE email = 'noor.hassan@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Quantum Computing: Novel Algorithms for Complex Problem Solving' LIMIT 1),
 'pdf', 'quantum-algorithms.pdf', '/files/thesis-3.pdf', 6291456);

-- Thesis 4: Cloud Computing Architecture
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Scalable Cloud Computing Architecture for Big Data Processing',
  'Design and implementation of a highly scalable cloud architecture optimized for big data analytics.',
  'Computer Science & Engineering',
  ARRAY['cloud computing', 'big data', 'scalability', 'distributed systems'],
  2024,
  '2024-01-25',
  (SELECT id FROM users WHERE email = 'dr.johnson@university.edu' LIMIT 1),
  'approved',
  892,
  267
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Scalable Cloud Computing Architecture for Big Data Processing' LIMIT 1),
 (SELECT id FROM users WHERE email = 'karim.hassan@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Scalable Cloud Computing Architecture for Big Data Processing' LIMIT 1),
 (SELECT id FROM users WHERE email = 'tanvir.ahmed@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Scalable Cloud Computing Architecture for Big Data Processing' LIMIT 1),
 'pdf', 'cloud-architecture.pdf', '/files/thesis-4.pdf', 5767168);

-- Thesis 5: 5G Network Optimization
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  '5G Network Optimization: Performance Analysis and Enhancement',
  'Research on 5G network optimization techniques to improve bandwidth efficiency and reduce latency.',
  'Electrical & Electronic Engineering',
  ARRAY['5G', 'network optimization', 'telecommunications', 'wireless networks'],
  2024,
  '2024-03-01',
  (SELECT id FROM users WHERE email = 'dr.williams@university.edu' LIMIT 1),
  'approved',
  1045,
  389
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = '5G Network Optimization: Performance Analysis and Enhancement' LIMIT 1),
 (SELECT id FROM users WHERE email = 'fatima.begum@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = '5G Network Optimization: Performance Analysis and Enhancement' LIMIT 1),
 (SELECT id FROM users WHERE email = 'aisha.khan@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = '5G Network Optimization: Performance Analysis and Enhancement' LIMIT 1),
 'pdf', '5g-optimization.pdf', '/files/thesis-5.pdf', 4718592);

-- Thesis 6: IoT Security Framework
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Internet of Things: Comprehensive Security Framework',
  'Development of a comprehensive security framework for IoT devices and networks.',
  'Electrical & Electronic Engineering',
  ARRAY['IoT', 'security', 'embedded systems', 'network protocols'],
  2024,
  '2024-02-15',
  (SELECT id FROM users WHERE email = 'dr.williams@university.edu' LIMIT 1),
  'approved',
  923,
  312
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Internet of Things: Comprehensive Security Framework' LIMIT 1),
 (SELECT id FROM users WHERE email = 'aisha.khan@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Internet of Things: Comprehensive Security Framework' LIMIT 1),
 (SELECT id FROM users WHERE email = 'fatima.begum@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Internet of Things: Comprehensive Security Framework' LIMIT 1),
 'pdf', 'iot-security.pdf', '/files/thesis-6.pdf', 5505024);

-- Thesis 7: Sustainable Building Design
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Sustainable Building Design: Energy-Efficient Construction Methods',
  'Analysis of sustainable building practices and their impact on energy consumption and environmental sustainability.',
  'Civil Engineering',
  ARRAY['sustainability', 'green building', 'energy efficiency', 'construction'],
  2024,
  '2024-04-05',
  (SELECT id FROM users WHERE email = 'dr.brown@university.edu' LIMIT 1),
  'approved',
  834,
  278
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Sustainable Building Design: Energy-Efficient Construction Methods' LIMIT 1),
 (SELECT id FROM users WHERE email = 'noor.alam@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Sustainable Building Design: Energy-Efficient Construction Methods' LIMIT 1),
 (SELECT id FROM users WHERE email = 'hassan.mahmud@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Sustainable Building Design: Energy-Efficient Construction Methods' LIMIT 1),
 'pdf', 'sustainable-building.pdf', '/files/thesis-7.pdf', 6815744);

-- Thesis 8: Smart City Infrastructure
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Smart City Infrastructure: Integrated Urban Planning Solutions',
  'Design of integrated infrastructure systems for smart cities using IoT and AI technologies.',
  'Civil Engineering',
  ARRAY['smart cities', 'urban planning', 'infrastructure', 'IoT'],
  2024,
  '2024-03-20',
  (SELECT id FROM users WHERE email = 'dr.brown@university.edu' LIMIT 1),
  'approved',
  1156,
  423
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Smart City Infrastructure: Integrated Urban Planning Solutions' LIMIT 1),
 (SELECT id FROM users WHERE email = 'hassan.mahmud@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Smart City Infrastructure: Integrated Urban Planning Solutions' LIMIT 1),
 (SELECT id FROM users WHERE email = 'karim.ahmed@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Smart City Infrastructure: Integrated Urban Planning Solutions' LIMIT 1),
 'pdf', 'smart-city.pdf', '/files/thesis-8.pdf', 7340032);

-- Thesis 9: Quantum Mechanics Applications
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Quantum Mechanics: Applications in Modern Technology',
  'Exploration of quantum mechanical principles and their applications in emerging technologies.',
  'Physics',
  ARRAY['quantum mechanics', 'quantum physics', 'nanotechnology', 'semiconductors'],
  2024,
  '2024-02-28',
  (SELECT id FROM users WHERE email = 'dr.davis@university.edu' LIMIT 1),
  'approved',
  678,
  198
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Quantum Mechanics: Applications in Modern Technology' LIMIT 1),
 (SELECT id FROM users WHERE email = 'rahman.hossain@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Quantum Mechanics: Applications in Modern Technology' LIMIT 1),
 (SELECT id FROM users WHERE email = 'sabbir.rahman@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Quantum Mechanics: Applications in Modern Technology' LIMIT 1),
 'pdf', 'quantum-mechanics.pdf', '/files/thesis-9.pdf', 4456448);

-- Thesis 10: Dark Matter Research
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Dark Matter: Observational Evidence and Theoretical Models',
  'Comprehensive study of dark matter candidates and their detection methods using advanced observational techniques.',
  'Physics',
  ARRAY['dark matter', 'astrophysics', 'cosmology', 'particle physics'],
  2024,
  '2024-04-15',
  (SELECT id FROM users WHERE email = 'dr.davis@university.edu' LIMIT 1),
  'approved',
  945,
  334
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Dark Matter: Observational Evidence and Theoretical Models' LIMIT 1),
 (SELECT id FROM users WHERE email = 'sabbir.rahman@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Dark Matter: Observational Evidence and Theoretical Models' LIMIT 1),
 (SELECT id FROM users WHERE email = 'rahman.hossain@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Dark Matter: Observational Evidence and Theoretical Models' LIMIT 1),
 'pdf', 'dark-matter.pdf', '/files/thesis-10.pdf', 5898240);

-- Thesis 11: Organic Synthesis Methods
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Novel Organic Synthesis Methods for Pharmaceutical Applications',
  'Development of efficient organic synthesis pathways for complex pharmaceutical compounds.',
  'Chemistry',
  ARRAY['organic synthesis', 'pharmaceuticals', 'drug development', 'catalysis'],
  2024,
  '2024-03-10',
  (SELECT id FROM users WHERE email = 'dr.miller@university.edu' LIMIT 1),
  'approved',
  812,
  289
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Novel Organic Synthesis Methods for Pharmaceutical Applications' LIMIT 1),
 (SELECT id FROM users WHERE email = 'mahmud.hassan@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Novel Organic Synthesis Methods for Pharmaceutical Applications' LIMIT 1),
 (SELECT id FROM users WHERE email = 'ayesha.khan2@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Novel Organic Synthesis Methods for Pharmaceutical Applications' LIMIT 1),
 'pdf', 'organic-synthesis.pdf', '/files/thesis-11.pdf', 4980736);

-- Thesis 12: Nanotechnology in Medicine
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Nanotechnology Applications in Targeted Drug Delivery',
  'Research on nanoparticle-based drug delivery systems for targeted cancer therapy.',
  'Chemistry',
  ARRAY['nanotechnology', 'drug delivery', 'nanoparticles', 'biomedicine'],
  2024,
  '2024-02-25',
  (SELECT id FROM users WHERE email = 'dr.miller@university.edu' LIMIT 1),
  'approved',
  1087,
  401
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Nanotechnology Applications in Targeted Drug Delivery' LIMIT 1),
 (SELECT id FROM users WHERE email = 'ayesha.khan2@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Nanotechnology Applications in Targeted Drug Delivery' LIMIT 1),
 (SELECT id FROM users WHERE email = 'jahangir.alam@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Nanotechnology Applications in Targeted Drug Delivery' LIMIT 1),
 'pdf', 'nanotechnology-medicine.pdf', '/files/thesis-12.pdf', 5636096);

-- Thesis 13: Climate Change Modeling
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Climate Change: Advanced Predictive Modeling Techniques',
  'Development of sophisticated climate models to predict long-term environmental changes and their impacts.',
  'Environmental Science',
  ARRAY['climate change', 'environmental modeling', 'global warming', 'sustainability'],
  2024,
  '2024-04-01',
  (SELECT id FROM users WHERE email = 'dr.wilson@university.edu' LIMIT 1),
  'approved',
  1234,
  478
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Climate Change: Advanced Predictive Modeling Techniques' LIMIT 1),
 (SELECT id FROM users WHERE email = 'rafiq.ahmed@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Climate Change: Advanced Predictive Modeling Techniques' LIMIT 1),
 (SELECT id FROM users WHERE email = 'nusrat.jahan@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Climate Change: Advanced Predictive Modeling Techniques' LIMIT 1),
 'pdf', 'climate-modeling.pdf', '/files/thesis-13.pdf', 6553600);

-- Thesis 14: Renewable Energy Systems
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Renewable Energy: Optimization of Solar and Wind Power Systems',
  'Analysis and optimization strategies for hybrid renewable energy systems in urban environments.',
  'Environmental Science',
  ARRAY['renewable energy', 'solar power', 'wind energy', 'sustainability'],
  2024,
  '2024-03-18',
  (SELECT id FROM users WHERE email = 'dr.wilson@university.edu' LIMIT 1),
  'approved',
  998,
  356
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Renewable Energy: Optimization of Solar and Wind Power Systems' LIMIT 1),
 (SELECT id FROM users WHERE email = 'farzana.islam@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Renewable Energy: Optimization of Solar and Wind Power Systems' LIMIT 1),
 (SELECT id FROM users WHERE email = 'rashed.mahmud@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Renewable Energy: Optimization of Solar and Wind Power Systems' LIMIT 1),
 'pdf', 'renewable-energy.pdf', '/files/thesis-14.pdf', 5242880);

-- Thesis 15: Autonomous Robotics
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Autonomous Robotics: Navigation and Decision-Making Systems',
  'Development of autonomous navigation algorithms for mobile robots in dynamic environments.',
  'Robotics & Automation',
  ARRAY['robotics', 'autonomous systems', 'navigation', 'artificial intelligence'],
  2024,
  '2024-02-12',
  (SELECT id FROM users WHERE email = 'dr.moore@university.edu' LIMIT 1),
  'approved',
  1167,
  445
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Autonomous Robotics: Navigation and Decision-Making Systems' LIMIT 1),
 (SELECT id FROM users WHERE email = 'imran.khan@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Autonomous Robotics: Navigation and Decision-Making Systems' LIMIT 1),
 (SELECT id FROM users WHERE email = 'kamal.uddin@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Autonomous Robotics: Navigation and Decision-Making Systems' LIMIT 1),
 'pdf', 'autonomous-robotics.pdf', '/files/thesis-15.pdf', 7077888);
