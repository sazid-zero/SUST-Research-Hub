-- Seed Test Users (4 users: 2 students, 2 supervisors)
-- Run this after 02-seed-admin-user.sql

-- Delete existing test users to avoid duplicates
DELETE FROM users WHERE email IN (
  'student1@university.edu',
  'student2@university.edu',
  'supervisor1@university.edu',
  'supervisor2@university.edu'
);

-- Insert test students
INSERT INTO users (email, password_hash, full_name, role, department, student_id, is_approved, approval_date, created_at) VALUES
('student1@university.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Alice Johnson', 'student', 'Computer Science', 'CSE2021001', true, NOW(), NOW()),
('student2@university.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Bob Smith', 'student', 'Electrical Engineering', 'EEE2021002', true, NOW(), NOW());

-- Insert test supervisors
INSERT INTO users (email, password_hash, full_name, role, department, student_id, is_approved, approval_date, created_at) VALUES
('supervisor1@university.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Sarah Chen', 'supervisor', 'Computer Science', NULL, true, NOW(), NOW()),
('supervisor2@university.edu', '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK', 'Dr. Michael Brown', 'supervisor', 'Electrical Engineering', NULL, true, NOW(), NOW());
