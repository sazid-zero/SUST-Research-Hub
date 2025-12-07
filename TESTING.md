# Testing Guide - Research Portal

## Test Scenarios

### 1. Registration & Approval Flow

**Setup:**
- Fresh database
- Admin account created

**Test Steps:**
1. Go to `/auth/register`
2. Create student account:
   - Name: Test Student
   - Email: student@test.com
   - Student ID: 123456
   - Department: Computer Science
   - Password: TestPass123
3. Submit registration
4. Verify success message
5. Try to login (should show "pending approval")
6. Log in as admin (admin@university.edu / admin123)
7. Go to Admin → Registrations → Pending
8. Find "Test Student" registration
9. Click "Approve"
10. Check console for email log
11. Verify student can now login

**Expected Results:**
- Registration creates user in database
- User shown as pending approval
- Admin can see pending registrations
- Approval sends email and unlocks login

### 2. Supervisor Registration

**Test Steps:**
1. Go to `/auth/register`
2. Select role: Supervisor
3. Fill in:
   - Name: Dr. John Smith
   - Email: dr.smith@university.edu
   - Department: Computer Science
   - Specialization: Machine Learning
   - Password: TestPass123
4. Submit and verify same flow as student

**Expected Results:**
- Supervisor role accepted
- Specialization field shown in admin approval
- Profile page shows supervisor fields

### 3. Profile Pages

**Student Profile:**
1. Log in as approved student
2. Go to Settings → Profile
3. Verify data displays correctly
4. Click Edit Profile
5. Change department
6. Click Save
7. Verify changes persist

**Supervisor Profile:**
1. Same as student but with specialization field

**Admin Profile:**
1. Log in as admin
2. Go to Admin → Settings → Profile
3. Verify read-only display (no edit button)

### 4. Session Management

**Test Steps:**
1. Log in as student
2. Open app in two browser tabs
3. Verify session works in both tabs
4. Log out in one tab
5. Refresh other tab
6. Should redirect to login

**Expected Results:**
- Session persists across tabs
- Logout clears all sessions

### 5. Database Portability

**Test Steps:**
1. Deploy to Vercel with Neon
2. Create test account
3. Change DATABASE_URL in Vercel env vars to different PostgreSQL instance
4. Trigger redeployment
5. Verify app works with new database

**Expected Results:**
- App connects to new database without code changes
- All existing data accessible

## Performance Testing

### Load Testing Checklist
- [ ] Can handle 10 concurrent registrations
- [ ] Profile pages load in < 1 second
- [ ] Admin approval page loads pending registrations < 2 seconds

## Security Testing

### Auth Security
- [ ] Can't access admin routes without admin role
- [ ] Can't modify other users' profiles
- [ ] Session tokens expire properly
- [ ] CSRF protection on forms

### Input Validation
- [ ] SQL injection attempts blocked
- [ ] XSS attempts blocked
- [ ] Email validation works
- [ ] Password requirements enforced

### Database Security
- [ ] Passwords are hashed (bcrypt)
- [ ] Session tokens are randomized
- [ ] No sensitive data in logs
- [ ] Connection uses HTTPS/SSL

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@university.edu | admin123 |
| Student (test) | student@test.com | TestPass123 |
| Supervisor (test) | dr.smith@university.edu | TestPass123 |

## Regression Testing

Before each release:

1. Test registration flow (student + supervisor)
2. Test admin approval workflow
3. Test all profile pages
4. Test logout/session clearing
5. Verify email sending (if configured)
6. Test database switching
7. Check for console errors
8. Verify responsive design on mobile

## Bug Report Template

\`\`\`
Title: [Brief description]
Environment: [local/staging/production]
Browser: [Chrome/Firefox/Safari]
Steps to Reproduce:
1. 
2. 
3. 
Expected Result:
Actual Result:
Screenshots:
Database State: [if relevant]
