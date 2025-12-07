-- Seed first 10 published theses with 2 co-authors each
-- Each thesis has exactly 2 student co-authors and 1 supervisor from matching department

DELETE FROM thesis_files;
DELETE FROM thesis_authors;
DELETE FROM theses;

-- Thesis 1: Machine Learning in Healthcare (CSE)
-- Added category field from INSERT statement and defense_date
INSERT INTO theses (title, abstract, department, supervisor_id, status, views, downloads, keywords, year, submitted_date)
VALUES (
  'Machine Learning Applications in Healthcare',
  'This comprehensive thesis explores the implementation and optimization of machine learning algorithms for healthcare applications. We propose a novel hybrid approach combining collaborative filtering with content-based methods to improve diagnostic accuracy and patient outcomes.',
  'Computer Science & Engineering',
  (SELECT id FROM users WHERE email = 'hassan.ahmed@supervisor.edu' LIMIT 1),
  'approved',
  1203,
  245,
  ARRAY['Machine Learning', 'Healthcare', 'AI', 'Diagnostics', 'Neural Networks'],
  2024,
  '2024-01-20'
);

INSERT INTO thesis_authors (thesis_id, author_id, author_order)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'ahmed.khan@student.edu' LIMIT 1), 1),
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'karim.hassan@student.edu' LIMIT 1), 2);

INSERT INTO thesis_files (thesis_id, file_name, file_url, file_type, file_size)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), 'Thesis_Document.pdf', '/uploads/thesis-1-doc.pdf', 'pdf', 2621440);

-- Thesis 2: Renewable Energy (EEE)
INSERT INTO theses (title, abstract, department, supervisor_id, status, views, downloads, keywords, year, submitted_date)
VALUES (
  'Renewable Energy Solutions for Bangladesh',
  'A comprehensive study on the implementation and optimization of renewable energy systems in urban environments. This research focuses on solar and wind power integration in Bangladesh energy grid.',
  'Electrical & Electronic Engineering',
  (SELECT id FROM users WHERE email = 'fatima.khan@supervisor.edu' LIMIT 1),
  'approved',
  856,
  189,
  ARRAY['Renewable Energy', 'Solar Power', 'Wind Energy', 'Sustainability', 'Bangladesh'],
  2024,
  '2024-02-10'
);

INSERT INTO thesis_authors (thesis_id, author_id, author_order)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'fatima.begum@student.edu' LIMIT 1), 1),
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'aisha.khan@student.edu' LIMIT 1), 2);

INSERT INTO thesis_files (thesis_id, file_name, file_url, file_type, file_size)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), 'Thesis_Document.pdf', '/uploads/thesis-2-doc.pdf', 'pdf', 3248128);

-- Thesis 3: Blockchain (CSE)
INSERT INTO theses (title, abstract, department, supervisor_id, status, views, downloads, keywords, year, submitted_date)
VALUES (
  'Blockchain in Supply Chain Management',
  'This thesis investigates the application of blockchain technology in supply chain management systems. We propose a decentralized framework for tracking products from manufacturing to delivery.',
  'Computer Science & Engineering',
  (SELECT id FROM users WHERE email = 'hassan.ahmed@supervisor.edu' LIMIT 1),
  'approved',
  654,
  123,
  ARRAY['Blockchain', 'Supply Chain', 'Distributed Systems', 'Transparency', 'Security'],
  2024,
  '2024-03-05'
);

INSERT INTO thesis_authors (thesis_id, author_id, author_order)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'noor.hassan@student.edu' LIMIT 1), 1),
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'tanvir.ahmed@student.edu' LIMIT 1), 2);

INSERT INTO thesis_files (thesis_id, file_name, file_url, file_type, file_size)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), 'Thesis_Document.pdf', '/uploads/thesis-3-doc.pdf', 'pdf', 2936012);

-- Thesis 4: Water Quality (Civil)
INSERT INTO theses (title, abstract, department, supervisor_id, status, views, downloads, keywords, year, submitted_date)
VALUES (
  'Water Quality Assessment Using IoT',
  'An innovative approach to real-time water quality monitoring using Internet of Things sensors. This research develops a cost-effective system for continuous water quality assessment in urban water distribution networks.',
  'Civil Engineering',
  (SELECT id FROM users WHERE email = 'noor.alam2@supervisor.edu' LIMIT 1),
  'approved',
  512,
  98,
  ARRAY['IoT', 'Water Quality', 'Environmental Monitoring', 'Sensors', 'Smart Cities'],
  2024,
  '2024-01-15'
);

INSERT INTO thesis_authors (thesis_id, author_id, author_order)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'noor.alam@student.edu' LIMIT 1), 1),
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'hassan.mahmud@student.edu' LIMIT 1), 2);

INSERT INTO thesis_files (thesis_id, file_name, file_url, file_type, file_size)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), 'Thesis_Document.pdf', '/uploads/thesis-4-doc.pdf', 'pdf', 2306867);

-- Thesis 5: Quantum Entanglement (Physics)
INSERT INTO theses (title, abstract, department, supervisor_id, status, views, downloads, keywords, year, submitted_date)
VALUES (
  'Quantum Entanglement and Its Applications in Cryptography',
  'This research explores the fundamental principles of quantum entanglement and its practical applications in developing secure cryptographic systems. We demonstrate how entangled particles can be used to create unbreakable encryption methods.',
  'Physics',
  (SELECT id FROM users WHERE email = 'kamal.ahmed@supervisor.edu' LIMIT 1),
  'approved',
  1876,
  342,
  ARRAY['Quantum Physics', 'Entanglement', 'Cryptography', 'Quantum Mechanics', 'Security'],
  2024,
  '2024-04-10'
);

INSERT INTO thesis_authors (thesis_id, author_id, author_order)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'rahman.hossain@student.edu' LIMIT 1), 1),
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'sabbir.rahman@student.edu' LIMIT 1), 2);

INSERT INTO thesis_files (thesis_id, file_name, file_url, file_type, file_size)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), 'Thesis_Document.pdf', '/uploads/thesis-5-doc.pdf', 'pdf', 5031936);

-- Thesis 6: Green Chemistry (Chemistry)
INSERT INTO theses (title, abstract, department, supervisor_id, status, views, downloads, keywords, year, submitted_date)
VALUES (
  'Green Chemistry Approaches for Sustainable Industrial Processes',
  'This research investigates environmentally friendly chemical processes that minimize waste and reduce energy consumption in industrial applications. We propose novel catalytic methods that significantly improve efficiency.',
  'Chemistry',
  (SELECT id FROM users WHERE email = 'fatima.rahman@supervisor.edu' LIMIT 1),
  'approved',
  1654,
  312,
  ARRAY['Green Chemistry', 'Sustainability', 'Catalysis', 'Industrial Chemistry', 'Environment'],
  2024,
  '2024-02-25'
);

INSERT INTO thesis_authors (thesis_id, author_id, author_order)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'mahmud.hassan@student.edu' LIMIT 1), 1),
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'ayesha.khan2@student.edu' LIMIT 1), 2);

INSERT INTO thesis_files (thesis_id, file_name, file_url, file_type, file_size)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), 'Thesis_Document.pdf', '/uploads/thesis-6-doc.pdf', 'pdf', 4508876);

-- Thesis 7: Mathematical Modeling (Mathematics)
INSERT INTO theses (title, abstract, department, supervisor_id, status, views, downloads, keywords, year, submitted_date)
VALUES (
  'Advanced Mathematical Modeling of Complex Systems',
  'A comprehensive study on mathematical modeling techniques for analyzing complex dynamical systems. This thesis develops novel algorithms for predicting system behavior in chaotic environments.',
  'Mathematics',
  (SELECT id FROM users WHERE email = 'sultana.begum@supervisor.edu' LIMIT 1),
  'approved',
  1543,
  289,
  ARRAY['Mathematics', 'Complex Systems', 'Modeling', 'Chaos Theory', 'Algorithms'],
  2024,
  '2024-03-15'
);

INSERT INTO thesis_authors (thesis_id, author_id, author_order)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'nusrat.jahan@student.edu' LIMIT 1), 1),
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'mahmud.hassan@student.edu' LIMIT 1), 2);

INSERT INTO thesis_files (thesis_id, file_name, file_url, file_type, file_size)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), 'Thesis_Document.pdf', '/uploads/thesis-7-doc.pdf', 'pdf', 4087808);

-- Thesis 8: Genetic Engineering (Biochemistry)
INSERT INTO theses (title, abstract, department, supervisor_id, status, views, downloads, keywords, year, submitted_date)
VALUES (
  'Genetic Engineering for Disease-Resistant Crops',
  'Exploring genetic modification techniques to develop crop varieties resistant to common plant diseases. This research demonstrates how CRISPR-Cas9 technology can be used to enhance plant immunity.',
  'Biochemistry',
  (SELECT id FROM users WHERE email = 'kamal.hossain@supervisor.edu' LIMIT 1),
  'approved',
  2156,
  445,
  ARRAY['Genetic Engineering', 'CRISPR', 'Biotechnology', 'Agriculture', 'Disease Resistance'],
  2024,
  '2024-04-05'
);

INSERT INTO thesis_authors (thesis_id, author_id, author_order)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'farzana.islam@student.edu' LIMIT 1), 1),
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'rashed.mahmud@student.edu' LIMIT 1), 2);

INSERT INTO thesis_files (thesis_id, file_name, file_url, file_type, file_size)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), 'Thesis_Document.pdf', '/uploads/thesis-8-doc.pdf', 'pdf', 5662310);

-- Thesis 9: Climate Change (Environmental Science)
INSERT INTO theses (title, abstract, department, supervisor_id, status, views, downloads, keywords, year, submitted_date)
VALUES (
  'Climate Change Impact on Coastal Ecosystems in Bangladesh',
  'A comprehensive analysis of climate change effects on coastal ecosystems in Bangladesh. This research examines rising sea levels, temperature changes, and their impact on biodiversity.',
  'Environmental Science',
  (SELECT id FROM users WHERE email = 'nasrin.sultana@supervisor.edu' LIMIT 1),
  'approved',
  2145,
  423,
  ARRAY['Climate Change', 'Environmental Science', 'Coastal Ecosystems', 'Biodiversity', 'Conservation'],
  2024,
  '2024-01-30'
);

INSERT INTO thesis_authors (thesis_id, author_id, author_order)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'rafiq.ahmed@student.edu' LIMIT 1), 1),
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'nusrat.jahan@student.edu' LIMIT 1), 2);

INSERT INTO thesis_files (thesis_id, file_name, file_url, file_type, file_size)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), 'Thesis_Document.pdf', '/uploads/thesis-9-doc.pdf', 'pdf', 4928307);

-- Thesis 10: Autonomous Navigation (Robotics)
INSERT INTO theses (title, abstract, department, supervisor_id, status, views, downloads, keywords, year, submitted_date)
VALUES (
  'Autonomous Navigation Systems for Mobile Robots',
  'Development of advanced navigation algorithms for autonomous mobile robots in complex environments. This research combines computer vision, sensor fusion, and machine learning.',
  'Robotics & Automation',
  (SELECT id FROM users WHERE email = 'hassan.mahmud2@supervisor.edu' LIMIT 1),
  'approved',
  1923,
  367,
  ARRAY['Robotics', 'Autonomous Navigation', 'Computer Vision', 'Machine Learning', 'Automation'],
  2024,
  '2024-03-20'
);

INSERT INTO thesis_authors (thesis_id, author_id, author_order)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'imran.khan@student.edu' LIMIT 1), 1),
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), (SELECT id FROM users WHERE email = 'ahmed.khan@student.edu' LIMIT 1), 2);

INSERT INTO thesis_files (thesis_id, file_name, file_url, file_type, file_size)
VALUES
  ((SELECT id FROM theses ORDER BY id DESC LIMIT 1), 'Thesis_Document.pdf', '/uploads/thesis-10-doc.pdf', 'pdf', 5138022);
