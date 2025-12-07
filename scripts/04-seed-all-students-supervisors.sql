-- Seed 20 Students and 10 Supervisors across 9 departments
-- Run this after 03-seed-test-users.sql
-- All users are pre-approved and can login with password123

-- Removed columns that don't exist in schema: updated_at, specialization, approved_by
-- Fixed to only use existing columns: email, password_hash, full_name, role, department, student_id, is_approved, approval_date, created_at

-- Delete existing seeded users to avoid duplicates
DELETE FROM users WHERE email LIKE '%@student.thesis.edu' OR email LIKE '%@faculty.thesis.edu';

-- Insert 10 Supervisors (covering all 9 departments)
INSERT INTO users (email, password_hash, full_name, role, department, student_id, is_approved, approval_date, created_at) VALUES
('dr.chen@faculty.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Sarah Chen', 'supervisor', 'Computer Science', NULL, true, NOW(), NOW()),
('dr.williams@faculty.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Michael Williams', 'supervisor', 'Electrical Engineering', NULL, true, NOW(), NOW()),
('dr.kumar@faculty.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Rajesh Kumar', 'supervisor', 'Civil Engineering', NULL, true, NOW(), NOW()),
('dr.thompson@faculty.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Elizabeth Thompson', 'supervisor', 'Physics', NULL, true, NOW(), NOW()),
('dr.anderson@faculty.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. James Anderson', 'supervisor', 'Chemistry', NULL, true, NOW(), NOW()),
('dr.green@faculty.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Emily Green', 'supervisor', 'Environmental Science', NULL, true, NOW(), NOW()),
('dr.patel@faculty.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Anil Patel', 'supervisor', 'Robotics', NULL, true, NOW(), NOW()),
('dr.martinez@faculty.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Carlos Martinez', 'supervisor', 'Economics', NULL, true, NOW(), NOW()),
('dr.nakamura@faculty.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Yuki Nakamura', 'supervisor', 'Agriculture', NULL, true, NOW(), NOW()),
('dr.zhao@faculty.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Wei Zhao', 'supervisor', 'Computer Science', NULL, true, NOW(), NOW());

-- Insert 20 Students (2-3 per department for co-authorship)
INSERT INTO users (email, password_hash, full_name, role, department, student_id, is_approved, approval_date, created_at) VALUES
-- Computer Science (4 students)
('aisha.khan@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Aisha Khan', 'student', 'Computer Science', 'CSE2022001', true, NOW(), NOW()),
('john.martinez@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'John Martinez', 'student', 'Computer Science', 'CSE2022002', true, NOW(), NOW()),
('emily.wang@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Emily Wang', 'student', 'Computer Science', 'CSE2022003', true, NOW(), NOW()),
('david.chen@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'David Chen', 'student', 'Computer Science', 'CSE2022004', true, NOW(), NOW()),

-- Electrical Engineering (2 students)
('sofia.rodriguez@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Sofia Rodriguez', 'student', 'Electrical Engineering', 'EEE2022001', true, NOW(), NOW()),
('yuki.tanaka@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Yuki Tanaka', 'student', 'Electrical Engineering', 'EEE2022002', true, NOW(), NOW()),

-- Civil Engineering (2 students)
('fatima.hassan@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Fatima Hassan', 'student', 'Civil Engineering', 'CIV2022001', true, NOW(), NOW()),
('lucas.silva@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Lucas Silva', 'student', 'Civil Engineering', 'CIV2022002', true, NOW(), NOW()),

-- Physics (2 students)
('priya.patel@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Priya Patel', 'student', 'Physics', 'PHY2022001', true, NOW(), NOW()),
('james.wilson@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'James Wilson', 'student', 'Physics', 'PHY2022002', true, NOW(), NOW()),

-- Chemistry (2 students)
('maria.lopez@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Maria Lopez', 'student', 'Chemistry', 'CHE2022001', true, NOW(), NOW()),
('alex.kim@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Alex Kim', 'student', 'Chemistry', 'CHE2022002', true, NOW(), NOW()),

-- Environmental Science (2 students)
('sara.nguyen@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Sara Nguyen', 'student', 'Environmental Science', 'ENV2022001', true, NOW(), NOW()),
('omar.ali@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Omar Ali', 'student', 'Environmental Science', 'ENV2022002', true, NOW(), NOW()),

-- Robotics (2 students)
('chloe.brown@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Chloe Brown', 'student', 'Robotics', 'ROB2022001', true, NOW(), NOW()),
('ryan.lee@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Ryan Lee', 'student', 'Robotics', 'ROB2022002', true, NOW(), NOW()),

-- Economics (2 students)
('anna.petrov@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Anna Petrov', 'student', 'Economics', 'ECO2022001', true, NOW(), NOW()),
('kenji.yamamoto@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Kenji Yamamoto', 'student', 'Economics', 'ECO2022002', true, NOW(), NOW()),

-- Agriculture (2 students)
('isabel.garcia@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Isabel Garcia', 'student', 'Agriculture', 'AGR2022001', true, NOW(), NOW()),
('thomas.anderson@student.thesis.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Thomas Anderson', 'student', 'Agriculture', 'AGR2022002', true, NOW(), NOW());
