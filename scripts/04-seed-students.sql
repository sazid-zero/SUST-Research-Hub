-- Seed 20 students across 9 departments
-- Password for all: password123 (hash: $2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK)

DELETE FROM users WHERE role = 'student';

-- Added profile_pic column to all INSERT statements
INSERT INTO users (email, password_hash, full_name, role, student_id, department, is_approved, approval_date, profile_pic) VALUES
-- Computer Science (4 students)
('ahmed.khan@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Ahmed Khan', 'student', '2020331001', 'Computer Science & Engineering', true, NOW(), '/placeholder.svg?height=100&width=100'),
('karim.hassan@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Karim Hassan', 'student', '2020331078', 'Computer Science & Engineering', true, NOW(), '/placeholder.svg?height=100&width=100'),
('noor.hassan@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Noor Hassan', 'student', '2020331105', 'Computer Science & Engineering', true, NOW(), '/placeholder.svg?height=100&width=100'),
('tanvir.ahmed@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Tanvir Ahmed', 'student', '2020331213', 'Computer Science & Engineering', true, NOW(), '/placeholder.svg?height=100&width=100'),

-- Electrical Engineering (2 students)
('fatima.begum@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Fatima Begum', 'student', '2020331045', 'Electrical & Electronic Engineering', true, NOW(), '/placeholder.svg?height=100&width=100'),
('aisha.khan@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Aisha Khan', 'student', '2020331118', 'Electrical & Electronic Engineering', true, NOW(), '/placeholder.svg?height=100&width=100'),

-- Civil Engineering (3 students)
('noor.alam@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Noor Alam', 'student', '2020331092', 'Civil Engineering', true, NOW(), '/placeholder.svg?height=100&width=100'),
('hassan.mahmud@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Hassan Mahmud', 'student', '2020331132', 'Civil Engineering', true, NOW(), '/placeholder.svg?height=100&width=100'),
('karim.ahmed@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Karim Ahmed', 'student', '2020331145', 'Civil Engineering', true, NOW(), '/placeholder.svg?height=100&width=100'),

-- Physics (2 students)
('rahman.hossain@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Rahman Hossain', 'student', '2020331201', 'Physics', true, NOW(), '/placeholder.svg?height=100&width=100'),
('sabbir.rahman@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Sabbir Rahman', 'student', '2020331216', 'Physics', true, NOW(), '/placeholder.svg?height=100&width=100'),

-- Chemistry (3 students)
('mahmud.hassan@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Mahmud Hassan', 'student', '2020331203', 'Chemistry', true, NOW(), '/placeholder.svg?height=100&width=100'),
('ayesha.khan2@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Ayesha Khan', 'student', '2020331204', 'Chemistry', true, NOW(), '/placeholder.svg?height=100&width=100'),
('jahangir.alam@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Jahangir Alam', 'student', '2020331218', 'Chemistry', true, NOW(), '/placeholder.svg?height=100&width=100'),

-- Mathematics (1 student)
('nusrat.jahan@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Nusrat Jahan', 'student', '2020331202', 'Mathematics', true, NOW(), '/placeholder.svg?height=100&width=100'),

-- Biochemistry (2 students)
('farzana.islam@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Farzana Islam', 'student', '2020331214', 'Biochemistry', true, NOW(), '/placeholder.svg?height=100&width=100'),
('rashed.mahmud@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Rashed Mahmud', 'student', '2020331215', 'Biochemistry', true, NOW(), '/placeholder.svg?height=100&width=100'),

-- Environmental Science (1 student)
('rafiq.ahmed@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Rafiq Ahmed', 'student', '2020331205', 'Environmental Science', true, NOW(), '/placeholder.svg?height=100&width=100'),

-- Robotics (1 student)
('imran.khan@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Imran Khan', 'student', '2020331207', 'Robotics & Automation', true, NOW(), '/placeholder.svg?height=100&width=100'),

-- Economics (1 student)
('kamal.uddin@student.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Kamal Uddin', 'student', '2020331209', 'Economics', true, NOW(), '/placeholder.svg?height=100&width=100');
