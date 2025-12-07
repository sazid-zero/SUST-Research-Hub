-- Fix missing supervisor assignments for theses
-- Updated to match actual thesis titles from seed scripts

-- Update theses that are missing supervisors
-- Assign supervisors from existing users with role 'supervisor'

UPDATE theses 
SET supervisor_id = (SELECT id FROM users WHERE role = 'supervisor' LIMIT 1 OFFSET 0)
WHERE title = 'Deep Learning Approaches for Advanced Image Recognition';

-- Fixed title to match seed script
UPDATE theses 
SET supervisor_id = (SELECT id FROM users WHERE role = 'supervisor' LIMIT 1 OFFSET 1)
WHERE title = 'Blockchain Technology: Security Analysis and Applications';

-- Fixed title to match seed script
UPDATE theses 
SET supervisor_id = (SELECT id FROM users WHERE role = 'supervisor' LIMIT 1 OFFSET 2)
WHERE title = 'Autonomous Robotics: Navigation and Decision-Making Systems';
