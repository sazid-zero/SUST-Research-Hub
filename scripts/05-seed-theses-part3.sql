-- Seed theses 31-37 with co-authors
-- Run this fifth (final seed script)

-- Thesis 31: Polymer Chemistry
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Polymer Chemistry: Biodegradable Plastics Development',
  'Research on biodegradable polymer materials for sustainable packaging applications.',
  'Chemistry',
  ARRAY['polymer chemistry', 'biodegradable plastics', 'sustainability', 'materials science'],
  2024,
  '2024-01-05',
  (SELECT id FROM users WHERE email = 'fatima.rahman@supervisor.edu' LIMIT 1),
  'approved',
  923,
  334
);
-- Replaced fake student emails with real students from database
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Polymer Chemistry: Biodegradable Plastics Development' LIMIT 1),
 (SELECT id FROM users WHERE email = 'ayesha.khan2@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Polymer Chemistry: Biodegradable Plastics Development' LIMIT 1),
 (SELECT id FROM users WHERE email = 'jahangir.alam@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Polymer Chemistry: Biodegradable Plastics Development' LIMIT 1),
 'pdf', 'polymer-chemistry.pdf', '/files/thesis-31.pdf', 5505024);

-- Thesis 32: Ecosystem Management
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Ecosystem Management: Biodiversity Conservation Strategies',
  'Analysis of ecosystem management practices for preserving biodiversity in threatened habitats.',
  'Environmental Science',
  ARRAY['ecosystem management', 'biodiversity', 'conservation', 'habitat restoration'],
  2024,
  '2024-01-12',
  (SELECT id FROM users WHERE email = 'nasrin.sultana@supervisor.edu' LIMIT 1),
  'approved',
  845,
  298
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Ecosystem Management: Biodiversity Conservation Strategies' LIMIT 1),
 (SELECT id FROM users WHERE email = 'rafiq.ahmed@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Ecosystem Management: Biodiversity Conservation Strategies' LIMIT 1),
 (SELECT id FROM users WHERE email = 'farzana.islam@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Ecosystem Management: Biodiversity Conservation Strategies' LIMIT 1),
 'pdf', 'ecosystem-management.pdf', '/files/thesis-32.pdf', 6553600);

-- Thesis 33: Water Resource Management
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Water Resource Management: Sustainable Urban Water Systems',
  'Development of integrated water management systems for sustainable urban development.',
  'Environmental Science',
  ARRAY['water management', 'urban planning', 'sustainability', 'water conservation'],
  2024,
  '2024-03-05',
  (SELECT id FROM users WHERE email = 'nasrin.sultana@supervisor.edu' LIMIT 1),
  'approved',
  1067,
  389
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Water Resource Management: Sustainable Urban Water Systems' LIMIT 1),
 (SELECT id FROM users WHERE email = 'farzana.islam@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Water Resource Management: Sustainable Urban Water Systems' LIMIT 1),
 (SELECT id FROM users WHERE email = 'rashed.mahmud@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Water Resource Management: Sustainable Urban Water Systems' LIMIT 1),
 'pdf', 'water-management.pdf', '/files/thesis-33.pdf', 5898240);

-- Thesis 34: Swarm Robotics
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Swarm Robotics: Collective Intelligence and Coordination',
  'Study of swarm robotics systems for coordinated task execution in complex environments.',
  'Robotics & Automation',
  ARRAY['swarm robotics', 'collective intelligence', 'multi-agent systems', 'coordination'],
  2024,
  '2024-02-28',
  (SELECT id FROM users WHERE email = 'hassan.mahmud2@supervisor.edu' LIMIT 1),
  'approved',
  978,
  356
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Swarm Robotics: Collective Intelligence and Coordination' LIMIT 1),
 (SELECT id FROM users WHERE email = 'imran.khan@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Swarm Robotics: Collective Intelligence and Coordination' LIMIT 1),
 (SELECT id FROM users WHERE email = 'tanvir.ahmed@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Swarm Robotics: Collective Intelligence and Coordination' LIMIT 1),
 'pdf', 'swarm-robotics.pdf', '/files/thesis-34.pdf', 6815744);

-- Thesis 35: Medical Robotics
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Medical Robotics: Minimally Invasive Surgical Systems',
  'Design of robotic systems for precision minimally invasive surgical procedures.',
  'Robotics & Automation',
  ARRAY['medical robotics', 'surgical systems', 'minimally invasive', 'precision medicine'],
  2024,
  '2024-04-22',
  (SELECT id FROM users WHERE email = 'hassan.mahmud2@supervisor.edu' LIMIT 1),
  'approved',
  1334,
  498
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Medical Robotics: Minimally Invasive Surgical Systems' LIMIT 1),
 (SELECT id FROM users WHERE email = 'kamal.uddin@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Medical Robotics: Minimally Invasive Surgical Systems' LIMIT 1),
 (SELECT id FROM users WHERE email = 'imran.khan@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Medical Robotics: Minimally Invasive Surgical Systems' LIMIT 1),
 'pdf', 'medical-robotics.pdf', '/files/thesis-35.pdf', 7340032);

-- Thesis 36: International Trade
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'International Trade: Impact of Global Supply Chain Disruptions',
  'Analysis of supply chain resilience and trade patterns during global disruptions.',
  'Economics',
  ARRAY['international trade', 'supply chain', 'globalization', 'economic policy'],
  2024,
  '2024-01-18',
  (SELECT id FROM users WHERE email = 'rahman.ali@supervisor.edu' LIMIT 1),
  'approved',
  1189,
  445
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'International Trade: Impact of Global Supply Chain Disruptions' LIMIT 1),
 (SELECT id FROM users WHERE email = 'kamal.uddin@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'International Trade: Impact of Global Supply Chain Disruptions' LIMIT 1),
 (SELECT id FROM users WHERE email = 'nusrat.jahan@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'International Trade: Impact of Global Supply Chain Disruptions' LIMIT 1),
 'pdf', 'international-trade.pdf', '/files/thesis-36.pdf', 5636096);

-- Thesis 37: Biochemistry Research
INSERT INTO theses (title, abstract, department, keywords, year, submitted_date, supervisor_id, status, views, downloads)
VALUES (
  'Biochemistry: Protein Folding and Enzyme Mechanisms',
  'Investigation of protein folding pathways and enzyme catalytic mechanisms at molecular level.',
  'Biochemistry',
  ARRAY['biochemistry', 'protein folding', 'enzyme mechanisms', 'molecular biology'],
  2024,
  '2024-03-16',
  (SELECT id FROM users WHERE email = 'kamal.hossain@supervisor.edu' LIMIT 1),
  'approved',
  1423,
  567
);
INSERT INTO thesis_authors (thesis_id, author_id, author_order) VALUES
((SELECT id FROM theses WHERE title = 'Biochemistry: Protein Folding and Enzyme Mechanisms' LIMIT 1),
 (SELECT id FROM users WHERE email = 'farzana.islam@student.edu' LIMIT 1), 1),
((SELECT id FROM theses WHERE title = 'Biochemistry: Protein Folding and Enzyme Mechanisms' LIMIT 1),
 (SELECT id FROM users WHERE email = 'rashed.mahmud@student.edu' LIMIT 1), 2);
INSERT INTO thesis_files (thesis_id, file_type, file_name, file_url, file_size) VALUES
((SELECT id FROM theses WHERE title = 'Biochemistry: Protein Folding and Enzyme Mechanisms' LIMIT 1),
 'pdf', 'biochemistry-research.pdf', '/files/thesis-37.pdf', 6291456);
