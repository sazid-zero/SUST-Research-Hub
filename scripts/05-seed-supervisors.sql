-- Seed 10 supervisors across departments  
-- Password for all: password123 (hash: $2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK)

DELETE FROM users WHERE role = 'supervisor';

-- Added profile_pic column to all INSERT statements
INSERT INTO users (email, password_hash, full_name, role, department, is_approved, approval_date, profile_pic) VALUES
('hassan.ahmed@supervisor.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Hassan Ahmed', 'supervisor', 'Computer Science & Engineering', true, NOW(), '/placeholder.svg?height=100&width=100'),
('fatima.khan@supervisor.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Fatima Khan', 'supervisor', 'Electrical & Electronic Engineering', true, NOW(), '/placeholder.svg?height=100&width=100'),
('noor.alam2@supervisor.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Noor Alam', 'supervisor', 'Civil Engineering', true, NOW(), '/placeholder.svg?height=100&width=100'),
('kamal.ahmed@supervisor.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Kamal Ahmed', 'supervisor', 'Physics', true, NOW(), '/placeholder.svg?height=100&width=100'),
('fatima.rahman@supervisor.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Fatima Rahman', 'supervisor', 'Chemistry', true, NOW(), '/placeholder.svg?height=100&width=100'),
('sultana.begum@supervisor.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Sultana Begum', 'supervisor', 'Mathematics', true, NOW(), '/placeholder.svg?height=100&width=100'),
('kamal.hossain@supervisor.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Kamal Hossain', 'supervisor', 'Biochemistry', true, NOW(), '/placeholder.svg?height=100&width=100'),
('nasrin.sultana@supervisor.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Nasrin Sultana', 'supervisor', 'Environmental Science', true, NOW(), '/placeholder.svg?height=100&width=100'),
('hassan.mahmud2@supervisor.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Hassan Mahmud', 'supervisor', 'Robotics & Automation', true, NOW(), '/placeholder.svg?height=100&width=100'),
('rahman.ali@supervisor.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Rahman Ali', 'supervisor', 'Economics', true, NOW(), '/placeholder.svg?height=100&width=100');
