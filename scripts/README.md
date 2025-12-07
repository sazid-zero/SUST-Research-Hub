# Database Setup Scripts

Run these scripts in order in your Neon database:

## Required Scripts (Run in Order)

1. **01-init-schema.sql** - Creates all database tables and indexes
2. **02-add-indexes.sql** - Adds performance indexes
3. **02-seed-admin-user.sql** - Creates admin user
4. **03-create-thesis-tables.sql** - Creates thesis, thesis_authors, and thesis_files tables
5. **04-seed-students.sql** - Creates 20 students across 9 departments
6. **05-seed-supervisors.sql** - Creates 10 supervisors across 9 departments
7. **06-seed-published-theses.sql** - Seeds 10 published theses with 2 co-authors each

## Login Credentials

All users use the same password:
- **Password**: `password123`
- **Password Hash**: `$2a$12$VwtU1ir2B/OorQwmMiVPquw2SaJdiTDQEeyZfxUxNIbQU3NaSMaiK`

**Admin:**
- Email: `admin@thesis.com`
- Password: `password123`

**Students (Sample):**
- `ahmed.khan@student.edu` - Ahmed Khan (CSE, Student ID: 2020331001)
- `karim.hassan@student.edu` - Karim Hassan (CSE, Student ID: 2020331078)
- `fatima.begum@student.edu` - Fatima Begum (EEE, Student ID: 2020331045)
- `noor.alam@student.edu` - Noor Alam (Civil, Student ID: 2020331092)
- (see scripts/04-seed-students.sql for complete list)

**Supervisors:**
- `hassan.ahmed@supervisor.edu` - Dr. Hassan Ahmed (CSE)
- `fatima.khan@supervisor.edu` - Dr. Fatima Khan (EEE)
- `noor.alam2@supervisor.edu` - Dr. Noor Alam (Civil)
- `kamal.ahmed@supervisor.edu` - Dr. Kamal Ahmed (Physics)
- (see scripts/05-seed-supervisors.sql for complete list)

## What's Included

- 1 admin user
- 20 students across 9 departments (CSE, EEE, Civil, Physics, Chemistry, Mathematics, Biochemistry, Environmental Science, Robotics, Economics)
- 10 supervisors covering all departments
- 10 published theses with 2 co-authors each
- All users are pre-approved (`is_approved = true`)
- All theses are approved and ready to display on home/browse pages

## Database Structure

- **users** - All users (admin, students, supervisors)
- **theses** - All thesis records with title, abstract, department, category, supervisor_id, status, etc.
- **thesis_authors** - Co-authorship relationships (exactly 2 authors per thesis)
- **thesis_files** - PDF and other file attachments
- **sessions** - User authentication sessions
- **registration_requests** - Pending registration approvals

## Next Steps

After running all scripts:
1. Login with any user using `password123`
2. Browse page will show all 10 published theses
3. Home page will display featured theses
4. Student dashboard shows theses where logged-in user is a co-author
5. Supervisor dashboard shows theses they supervise

To add more theses, follow the pattern in `06-seed-published-theses.sql` with 2 co-authors per thesis.
