-- Seed theses 16-30 with co-authors
-- Run this fourth

-- Thesis 16: Human-Robot Interaction
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Human-Robot Interaction: Natural Language Processing Integration',
  'Research on improving human-robot communication through advanced natural language processing techniques.',
  'Robotics & Automation',
  ARRAY['human-robot interaction', 'NLP', 'social robotics', 'AI'],
  2024,
  '2024-01-10',
  (SELECT id FROM users WHERE email = 'hassan.mahmud2@supervisor.edu' LIMIT 1),
  'approved',
  876,
  298
);
-- Replaced fake student emails with real students from database
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Human-Robot Interaction: Natural Language Processing Integration' LIMIT 1),
 (SELECT id FROM users WHERE email = 'imran.khan@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Human-Robot Interaction: Natural Language Processing Integration' LIMIT 1),
 (SELECT id FROM users WHERE email = 'kamal.uddin@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Human-Robot Interaction: Natural Language Processing Integration' LIMIT 1),
 'pdf', 'human-robot-interaction.pdf', '/files/thesis-16.pdf', 5505024);

-- Thesis 17: Behavioral Economics
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Behavioral Economics: Decision-Making Under Uncertainty',
  'Analysis of cognitive biases and heuristics in economic decision-making processes.',
  'Economics',
  ARRAY['behavioral economics', 'decision theory', 'cognitive bias', 'game theory'],
  2024,
  '2024-03-22',
  (SELECT id FROM users WHERE email = 'rahman.ali@supervisor.edu' LIMIT 1),
  'approved',
  734,
  256
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Behavioral Economics: Decision-Making Under Uncertainty' LIMIT 1),
 (SELECT id FROM users WHERE email = 'kamal.uddin@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Behavioral Economics: Decision-Making Under Uncertainty' LIMIT 1),
 (SELECT id FROM users WHERE email = 'rafiq.ahmed@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Behavioral Economics: Decision-Making Under Uncertainty' LIMIT 1),
 'pdf', 'behavioral-economics.pdf', '/files/thesis-17.pdf', 4718592);

-- Thesis 18: Digital Currency Systems
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Digital Currency: Economic Impact and Regulatory Frameworks',
  'Study of cryptocurrency adoption and its implications for traditional financial systems.',
  'Economics',
  ARRAY['cryptocurrency', 'blockchain', 'digital economy', 'fintech'],
  2024,
  '2024-02-18',
  (SELECT id FROM users WHERE email = 'rahman.ali@supervisor.edu' LIMIT 1),
  'approved',
  1289,
  512
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Digital Currency: Economic Impact and Regulatory Frameworks' LIMIT 1),
 (SELECT id FROM users WHERE email = 'rafiq.ahmed@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Digital Currency: Economic Impact and Regulatory Frameworks' LIMIT 1),
 (SELECT id FROM users WHERE email = 'nusrat.jahan@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Digital Currency: Economic Impact and Regulatory Frameworks' LIMIT 1),
 'pdf', 'digital-currency.pdf', '/files/thesis-18.pdf', 6291456);

-- Thesis 19: Precision Agriculture - REMOVED (no Agriculture department in seed)

-- Thesis 20: Sustainable Farming - REMOVED (no Agriculture department in seed)

-- Thesis 21: Natural Language Processing
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Natural Language Processing: Context-Aware Sentiment Analysis',
  'Development of advanced NLP models for context-aware sentiment analysis in social media.',
  'Computer Science & Engineering',
  ARRAY['NLP', 'sentiment analysis', 'machine learning', 'text mining'],
  2024,
  '2024-01-15',
  (SELECT id FROM users WHERE email = 'hassan.ahmed@supervisor.edu' LIMIT 1),
  'approved',
  1445,
  523
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Natural Language Processing: Context-Aware Sentiment Analysis' LIMIT 1),
 (SELECT id FROM users WHERE email = 'tanvir.ahmed@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Natural Language Processing: Context-Aware Sentiment Analysis' LIMIT 1),
 (SELECT id FROM users WHERE email = 'ahmed.khan@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Natural Language Processing: Context-Aware Sentiment Analysis' LIMIT 1),
 'pdf', 'nlp-sentiment-analysis.pdf', '/files/thesis-21.pdf', 4980736);

-- Thesis 22: Machine Learning for Healthcare
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Machine Learning in Healthcare: Predictive Disease Modeling',
  'Application of machine learning algorithms for early disease detection and patient outcome prediction.',
  'Computer Science & Engineering',
  ARRAY['machine learning', 'healthcare', 'predictive modeling', 'medical AI'],
  2024,
  '2024-02-08',
  (SELECT id FROM users WHERE email = 'hassan.ahmed@supervisor.edu' LIMIT 1),
  'approved',
  1678,
  601
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Machine Learning in Healthcare: Predictive Disease Modeling' LIMIT 1),
 (SELECT id FROM users WHERE email = 'karim.hassan@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Machine Learning in Healthcare: Predictive Disease Modeling' LIMIT 1),
 (SELECT id FROM users WHERE email = 'noor.hassan@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Machine Learning in Healthcare: Predictive Disease Modeling' LIMIT 1),
 'pdf', 'ml-healthcare.pdf', '/files/thesis-22.pdf', 6815744);

-- Thesis 23: Edge Computing
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Edge Computing: Low-Latency Data Processing for IoT',
  'Design of edge computing architectures for real-time IoT data processing with minimal latency.',
  'Computer Science & Engineering',
  ARRAY['edge computing', 'IoT', 'distributed systems', 'real-time processing'],
  2024,
  '2024-03-30',
  (SELECT id FROM users WHERE email = 'hassan.ahmed@supervisor.edu' LIMIT 1),
  'approved',
  967,
  341
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Edge Computing: Low-Latency Data Processing for IoT' LIMIT 1),
 (SELECT id FROM users WHERE email = 'noor.hassan@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Edge Computing: Low-Latency Data Processing for IoT' LIMIT 1),
 (SELECT id FROM users WHERE email = 'tanvir.ahmed@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Edge Computing: Low-Latency Data Processing for IoT' LIMIT 1),
 'pdf', 'edge-computing.pdf', '/files/thesis-23.pdf', 5505024);

-- Thesis 24: Power Electronics
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Advanced Power Electronics for Renewable Energy Integration',
  'Design of efficient power conversion systems for integrating renewable energy sources into the grid.',
  'Electrical & Electronic Engineering',
  ARRAY['power electronics', 'renewable energy', 'grid integration', 'converters'],
  2024,
  '2024-01-28',
  (SELECT id FROM users WHERE email = 'fatima.khan@supervisor.edu' LIMIT 1),
  'approved',
  823,
  287
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Advanced Power Electronics for Renewable Energy Integration' LIMIT 1),
 (SELECT id FROM users WHERE email = 'fatima.begum@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Advanced Power Electronics for Renewable Energy Integration' LIMIT 1),
 (SELECT id FROM users WHERE email = 'aisha.khan@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Advanced Power Electronics for Renewable Energy Integration' LIMIT 1),
 'pdf', 'power-electronics.pdf', '/files/thesis-24.pdf', 5636096);

-- Thesis 25: Signal Processing
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Digital Signal Processing: Real-Time Audio Enhancement',
  'Development of real-time digital signal processing algorithms for audio quality enhancement.',
  'Electrical & Electronic Engineering',
  ARRAY['signal processing', 'audio processing', 'digital filters', 'real-time systems'],
  2024,
  '2024-03-14',
  (SELECT id FROM users WHERE email = 'fatima.khan@supervisor.edu' LIMIT 1),
  'approved',
  712,
  245
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Digital Signal Processing: Real-Time Audio Enhancement' LIMIT 1),
 (SELECT id FROM users WHERE email = 'aisha.khan@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Digital Signal Processing: Real-Time Audio Enhancement' LIMIT 1),
 (SELECT id FROM users WHERE email = 'fatima.begum@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Digital Signal Processing: Real-Time Audio Enhancement' LIMIT 1),
 'pdf', 'signal-processing.pdf', '/files/thesis-25.pdf', 4718592);

-- Thesis 26: Structural Engineering
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Structural Engineering: Seismic-Resistant Building Design',
  'Analysis and design of earthquake-resistant structures using advanced materials and techniques.',
  'Civil Engineering',
  ARRAY['structural engineering', 'seismic design', 'earthquake resistance', 'building materials'],
  2024,
  '2024-02-22',
  (SELECT id FROM users WHERE email = 'noor.alam2@supervisor.edu' LIMIT 1),
  'approved',
  1089,
  412
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Structural Engineering: Seismic-Resistant Building Design' LIMIT 1),
 (SELECT id FROM users WHERE email = 'noor.alam@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Structural Engineering: Seismic-Resistant Building Design' LIMIT 1),
 (SELECT id FROM users WHERE email = 'hassan.mahmud@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Structural Engineering: Seismic-Resistant Building Design' LIMIT 1),
 'pdf', 'seismic-design.pdf', '/files/thesis-26.pdf', 7340032);

-- Thesis 27: Transportation Systems
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Intelligent Transportation Systems: Traffic Flow Optimization',
  'Development of AI-based traffic management systems for urban transportation networks.',
  'Civil Engineering',
  ARRAY['transportation', 'traffic management', 'smart cities', 'optimization'],
  2024,
  '2024-04-18',
  (SELECT id FROM users WHERE email = 'noor.alam2@supervisor.edu' LIMIT 1),
  'approved',
  934,
  356
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Intelligent Transportation Systems: Traffic Flow Optimization' LIMIT 1),
 (SELECT id FROM users WHERE email = 'hassan.mahmud@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Intelligent Transportation Systems: Traffic Flow Optimization' LIMIT 1),
 (SELECT id FROM users WHERE email = 'karim.ahmed@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Intelligent Transportation Systems: Traffic Flow Optimization' LIMIT 1),
 'pdf', 'transportation-systems.pdf', '/files/thesis-27.pdf', 6291456);

-- Thesis 28: Particle Physics
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Particle Physics: Higgs Boson Decay Channels Analysis',
  'Detailed analysis of Higgs boson decay channels using Large Hadron Collider data.',
  'Physics',
  ARRAY['particle physics', 'Higgs boson', 'LHC', 'high energy physics'],
  2024,
  '2024-01-20',
  (SELECT id FROM users WHERE email = 'kamal.ahmed@supervisor.edu' LIMIT 1),
  'approved',
  567,
  189
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Particle Physics: Higgs Boson Decay Channels Analysis' LIMIT 1),
 (SELECT id FROM users WHERE email = 'rahman.hossain@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Particle Physics: Higgs Boson Decay Channels Analysis' LIMIT 1),
 (SELECT id FROM users WHERE email = 'sabbir.rahman@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Particle Physics: Higgs Boson Decay Channels Analysis' LIMIT 1),
 'pdf', 'particle-physics.pdf', '/files/thesis-28.pdf', 5242880);

-- Thesis 29: Condensed Matter Physics
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Condensed Matter Physics: Superconductivity in Novel Materials',
  'Investigation of high-temperature superconductivity in newly discovered materials.',
  'Physics',
  ARRAY['condensed matter', 'superconductivity', 'materials science', 'low temperature physics'],
  2024,
  '2024-03-25',
  (SELECT id FROM users WHERE email = 'kamal.ahmed@supervisor.edu' LIMIT 1),
  'approved',
  789,
  267
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Condensed Matter Physics: Superconductivity in Novel Materials' LIMIT 1),
 (SELECT id FROM users WHERE email = 'sabbir.rahman@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Condensed Matter Physics: Superconductivity in Novel Materials' LIMIT 1),
 (SELECT id FROM users WHERE email = 'rahman.hossain@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Condensed Matter Physics: Superconductivity in Novel Materials' LIMIT 1),
 'pdf', 'condensed-matter.pdf', '/files/thesis-29.pdf', 5767168);

-- Thesis 30: Green Chemistry
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Green Chemistry: Environmentally Benign Synthesis Methods',
  'Development of sustainable chemical synthesis methods that minimize environmental impact.',
  'Chemistry',
  ARRAY['green chemistry', 'sustainable synthesis', 'environmental chemistry', 'catalysis'],
  2024,
  '2024-02-10',
  (SELECT id FROM users WHERE email = 'fatima.rahman@supervisor.edu' LIMIT 1),
  'approved',
  1156,
  423
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Green Chemistry: Environmentally Benign Synthesis Methods' LIMIT 1),
 (SELECT id FROM users WHERE email = 'mahmud.hassan@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Green Chemistry: Environmentally Benign Synthesis Methods' LIMIT 1),
 (SELECT id FROM users WHERE email = 'ayesha.khan2@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Green Chemistry: Environmentally Benign Synthesis Methods' LIMIT 1),
 'pdf', 'green-chemistry.pdf', '/files/thesis-30.pdf', 6029312);
