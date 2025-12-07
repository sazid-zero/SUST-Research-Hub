-- Seed Admin User (admin@thesis.edu / password123)
-- Run this after 01-init-schema.sql

-- Delete existing admin if exists to avoid duplicates
DELETE FROM users WHERE email = 'admin@thesis.edu';

-- Insert admin user
INSERT INTO users (
  email, 
  password_hash, 
  full_name, 
  role, 
  department,
  student_id,
  is_approved,
  approval_date,
  created_at
) VALUES (
  'admin@thesis.edu',
  '$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK',
  'System Administrator',
  'admin',
  'Administration',
  NULL,
  true,
  NOW(),
  NOW()
);
