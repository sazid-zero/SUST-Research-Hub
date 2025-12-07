# SUST THESIS REPOSITORY - DATABASE MODEL & DESIGN DOCUMENT

## 1. SYSTEM OVERVIEW

The SUST Thesis Repository is a role-based thesis management system with the following workflow:

### Workflow Steps:
1. **User Registration Request**: Students/Supervisors register → Request sent to Admin
2. **Admin Approval**: Admin reviews and approves/rejects registration
3. **User Account Creation**: Upon approval, user account is created
4. **Supervisor Assignment**: Admin assigns approved supervisors to students
5. **Thesis Submission**: Student selects approved supervisor and submits thesis
6. **Review Process**: Supervisor reviews thesis and provides feedback
7. **Final Status**: Thesis is approved or rejected
8. **Repository Access**: All approved theses appear in browse/search functionality

---

## 2. CORE ENTITIES & RELATIONSHIPS

### Entity-Relationship Overview:

```
┌─────────────────────────────────────────────────────────────┐
│                      USERS (All Roles)                       │
│  id | email | role | department_id | is_approved | ...       │
├──────────────┬──────────────┬───────────────┬────────────────┤
│              │              │               │                │
│         ┌────▼──┐      ┌────▼────┐    ┌────▼─────┐     ┌────▼─────┐
│         │STUDENTS│      │SUPERVISORS│   │ADMIN     │     │DEPT_HEAD │
│         └────────┘      └──────────┘    └──────────┘     └──────────┘
│
├─ DEPARTMENTS (id, name, code, head_id)
│
├─ SUPERVISOR_STUDENTS (Junction Table)
│  ├─ supervisor_id (FK → users)
│  ├─ student_id (FK → users)
│  └─ Many supervisors can teach many students
│
├─ REGISTRATION_REQUESTS (Pending approvals)
│  ├─ email
│  ├─ requested_role
│  ├─ status (pending/approved/rejected)
│  └─ admin_id (who reviewed)
│
├─ THESES (Main entity)
│  ├─ student_id (FK → users)
│  ├─ supervisor_id (FK → users)
│  ├─ department_id (FK → departments)
│  ├─ status (draft/submitted/in-review/approved/rejected)
│  ├─ title, abstract, year
│  └─ submitted_date, approval_date
│
├─ THESIS_FILES (Support documents)
│  ├─ thesis_id (FK → theses)
│  ├─ file_type (pdf/presentation/video/audio/document/data)
│  ├─ file_url (cloud storage path)
│  └─ uploaded_by_id
│
├─ THESIS_KEYWORDS (Searchability)
│  ├─ thesis_id (FK → theses)
│  └─ keyword
│
├─ REVIEWS (Supervisor feedback)
│  ├─ thesis_id (FK → theses)
│  ├─ reviewer_id (FK → users) [supervisor]
│  ├─ feedback_text
│  ├─ rating
│  └─ review_status (pending/in-progress/completed)
│
├─ NOTIFICATIONS (System alerts)
│  ├─ user_id (FK → users)
│  ├─ related_thesis_id
│  └─ notification_type
│
└─ AUDIT_LOG (System tracking)
   ├─ user_id (who made action)
   ├─ action (what happened)
   └─ entity_id (what was affected)
```

---

## 3. DETAILED TABLE SCHEMA

### 3.1 USERS TABLE
**Purpose**: Store all user data across all roles (Student, Supervisor, Admin)

```sql
Column              | Type     | Constraints           | Notes
────────────────────┼──────────┼──────────────────────┼─────────────────────
id                  | UUID     | PRIMARY KEY           | Unique identifier
email               | VARCHAR  | UNIQUE NOT NULL       | Login credential
password_hash       | VARCHAR  | NOT NULL              | Bcrypt hashed
full_name           | VARCHAR  | NOT NULL              | Display name
role                | ENUM     | NOT NULL, DEFAULT     | student/supervisor/admin
department_id       | UUID     | FK → departments      | Home department
phone               | VARCHAR  | NULLABLE              | Contact number
profile_image_url   | TEXT     | NULLABLE              | Avatar URL
is_approved         | BOOLEAN  | DEFAULT FALSE         | Admin approval status
approval_date       | TIMESTAMP| NULLABLE              | When approved
approved_by_admin_id| UUID     | FK → users(id)        | Which admin approved
created_at          | TIMESTAMP| DEFAULT NOW           | Registration timestamp
updated_at          | TIMESTAMP| DEFAULT NOW           | Last modification
is_active           | BOOLEAN  | DEFAULT TRUE          | Account status

KEY RELATIONSHIPS:
- (supervisor_id) in supervisor_students table
- (student_id) in supervisor_students table
- (author_id) in theses table (when thesis submitted by student)
- (supervisor_id) in theses table (thesis assigned supervisor)
```

**Role-Based Access**:
- **Student**: Can submit theses, view results, download approved theses
- **Supervisor**: Can review assigned student theses, provide feedback
- **Admin**: Full system access, approves users, manages all records

---

### 3.2 DEPARTMENTS TABLE
**Purpose**: Academic departments at SUST

```sql
Column          | Type      | Constraints      | Notes
────────────────┼───────────┼──────────────────┼──────────────────────
id              | UUID      | PRIMARY KEY      | Unique identifier
name            | VARCHAR   | UNIQUE NOT NULL  | Department name
code            | VARCHAR   | UNIQUE NOT NULL  | Short code (CSE, EEE, etc.)
description     | TEXT      | NULLABLE         | Department details
head_id         | UUID      | FK → users       | Department head
created_at      | TIMESTAMP | DEFAULT NOW      | Created timestamp
updated_at      | TIMESTAMP | DEFAULT NOW      | Last modified

DEPARTMENTS IN SYSTEM:
- Computer Science & Engineering (CSE)
- Electrical & Electronic Engineering (EEE)
- Civil Engineering (CE)
- Mechanical Engineering (ME)
- Chemistry (CHM)
- Physics (PHY)
- Mathematics (MTH)
- Biochemistry (BCH)
- Environmental Science (EVS)
- Robotics & Automation (ROB)
- Economics (ECO)
- Agriculture & Food Technology (AFT)
```

---

### 3.3 SUPERVISOR_STUDENTS TABLE (Junction Table)
**Purpose**: Many-to-many relationship between supervisors and students

```sql
Column          | Type      | Constraints           | Notes
────────────────┼───────────┼──────────────────────┼──────────────────
id              | UUID      | PRIMARY KEY           | Record ID
supervisor_id   | UUID      | FK → users(id)        | Supervisor user
student_id      | UUID      | FK → users(id)        | Student user
assigned_date   | TIMESTAMP | DEFAULT NOW           | Assignment date
is_active       | BOOLEAN   | DEFAULT TRUE          | Current assignment
created_at      | TIMESTAMP | DEFAULT NOW           | Record created

CONSTRAINTS:
- UNIQUE(supervisor_id, student_id): Each pair once per time period
- Supervisor role verified at application level
- Student role verified at application level

QUERY EXAMPLES:
-- Find all students of a supervisor
SELECT * FROM supervisor_students 
WHERE supervisor_id = ? AND is_active = TRUE

-- Find all supervisors of a student
SELECT * FROM supervisor_students 
WHERE student_id = ? AND is_active = TRUE

-- Assign supervisor to student
INSERT INTO supervisor_students (supervisor_id, student_id) 
VALUES (?, ?)
```

---

### 3.4 REGISTRATION_REQUESTS TABLE
**Purpose**: Track pending user registration requests awaiting admin approval

```sql
Column              | Type      | Constraints     | Notes
────────────────────┼───────────┼─────────────────┼──────────────────
id                  | UUID      | PRIMARY KEY     | Request ID
email               | VARCHAR   | UNIQUE NOT NULL | User's email
full_name           | VARCHAR   | NOT NULL        | User's name
requested_role      | ENUM      | NOT NULL        | student/supervisor
department_id       | UUID      | FK → departments| Their department
phone               | VARCHAR   | NULLABLE        | Contact
purpose_statement   | TEXT      | NULLABLE        | Why they want access
status              | ENUM      | DEFAULT pending | pending/approved/rejected
admin_notes         | TEXT      | NULLABLE        | Admin comments
admin_id            | UUID      | FK → users      | Which admin reviewed
requested_at        | TIMESTAMP | DEFAULT NOW     | Request time
reviewed_at         | TIMESTAMP | NULLABLE        | Review timestamp

WORKFLOW:
1. User fills registration form → Record in registration_requests (status='pending')
2. Email notification sent to admin
3. Admin reviews → Updates status and admin_notes
4. If approved: New user record created, status='approved'
5. If rejected: Status='rejected', user notified with reason
6. Approved user can now log in
```

---

### 3.5 THESES TABLE
**Purpose**: Core thesis/research project data

```sql
Column              | Type      | Constraints       | Notes
────────────────────┼───────────┼───────────────────┼──────────────────
id                  | UUID      | PRIMARY KEY       | Thesis ID
title               | VARCHAR   | NOT NULL          | Thesis title
student_id          | UUID      | FK → users        | Author (student)
supervisor_id       | UUID      | FK → users        | Assigned supervisor
department_id       | UUID      | FK → departments  | Academic dept
abstract            | TEXT      | NULLABLE          | Research summary
year                | INT       | NOT NULL          | Submission year
submitted_date      | TIMESTAMP | DEFAULT NOW       | When submitted
status              | ENUM      | NOT NULL          | See below
approval_date       | TIMESTAMP | NULLABLE          | Admin approval time
rejection_reason    | TEXT      | NULLABLE          | If rejected
views               | INT       | DEFAULT 0         | View counter
downloads           | INT       | DEFAULT 0         | Download counter
created_at          | TIMESTAMP | DEFAULT NOW       | Record created
updated_at          | TIMESTAMP | DEFAULT NOW       | Last modified

STATUS FLOW:
draft 
  ↓ (student saves)
submitted 
  ↓ (student submits for review)
in-review 
  ↓ (supervisor reviewing)
approved OR rejected
  ↓ (final state)

KEY RELATIONSHIPS:
- student_id: Must have role='student'
- supervisor_id: Must have role='supervisor'
- supervisor and student must be linked in supervisor_students table
- department_id: Derived from student's or selected by student
```

---

### 3.6 THESIS_FILES TABLE
**Purpose**: Store file metadata for thesis documents

```sql
Column          | Type      | Constraints    | Notes
────────────────┼───────────┼────────────────┼────────────────────
id              | UUID      | PRIMARY KEY    | File ID
thesis_id       | UUID      | FK → theses    | Parent thesis
file_name       | VARCHAR   | NOT NULL       | Original file name
file_type       | ENUM      | NOT NULL       | pdf/presentation/video/audio/document
file_size       | BIGINT    | NOT NULL       | Size in bytes
file_url        | TEXT      | NOT NULL       | Cloud storage URL
storage_path    | VARCHAR   | NOT NULL       | Internal path
uploaded_by_id  | UUID      | FK → users     | Who uploaded
uploaded_at     | TIMESTAMP | DEFAULT NOW    | Upload time
is_primary      | BOOLEAN   | DEFAULT FALSE  | Main PDF?

FILE TYPES SUPPORTED:
- pdf: Thesis document (primary)
- presentation: PowerPoint slides
- video: Demonstration video
- audio: Audio presentation
- document: Supplementary docs
- data: Research data/datasets

CONSTRAINTS:
- Each thesis should have ≥1 pdf (primary)
- File size limits: PDF (50MB), Video (500MB), Others (100MB)
```

---

### 3.7 THESIS_KEYWORDS TABLE
**Purpose**: Searchable keywords for theses

```sql
Column          | Type      | Constraints             | Notes
────────────────┼───────────┼───────────────────────┼──────────
id              | UUID      | PRIMARY KEY            | Record ID
thesis_id       | UUID      | FK → theses           | Parent thesis
keyword         | VARCHAR   | NOT NULL              | Search term
created_at      | TIMESTAMP | DEFAULT NOW           | Added time

CONSTRAINTS:
- UNIQUE(thesis_id, keyword): No duplicate keywords per thesis
- Max 10 keywords per thesis (enforced at app level)

SEARCH OPTIMIZATION:
- Indexed on keyword column
- Used for full-text search functionality
- Populated at thesis submission time
```

---

### 3.8 REVIEWS TABLE
**Purpose**: Track supervisor reviews and feedback

```sql
Column              | Type      | Constraints      | Notes
────────────────────┼───────────┼──────────────────┼──────────
id                  | UUID      | PRIMARY KEY      | Review ID
thesis_id           | UUID      | FK → theses      | Reviewed thesis
reviewer_id         | UUID      | FK → users       | Supervisor
review_status       | ENUM      | DEFAULT pending  | pending/in-progress/completed
feedback_text       | TEXT      | NULLABLE         | Detailed feedback
rating              | INT       | 1-5 scale        | Quality rating
suggested_changes   | TEXT      | NULLABLE         | Improvement suggestions
created_at          | TIMESTAMP | DEFAULT NOW      | Review started
updated_at          | TIMESTAMP | DEFAULT NOW      | Last update
completed_at        | TIMESTAMP | NULLABLE         | Completion time

REVIEW STATUS FLOW:
pending (thesis submitted)
  ↓
in-progress (supervisor reading)
  ↓
completed (feedback provided)

WORKFLOW:
1. Thesis submitted → Review record created (status='pending')
2. Supervisor opens thesis → Status changes to 'in-progress'
3. Supervisor provides feedback → Status='completed', completed_at=NOW()
4. Student notified of feedback
```

---

### 3.9 NOTIFICATIONS TABLE
**Purpose**: System notifications for users

```sql
Column              | Type      | Constraints        | Notes
────────────────────┼───────────┼───────────────────┼──────────
id                  | UUID      | PRIMARY KEY       | Notification ID
user_id             | UUID      | FK → users        | Recipient
notification_type   | VARCHAR   | NOT NULL          | See below
title               | VARCHAR   | NOT NULL          | Brief title
message             | TEXT      | NULLABLE          | Full message
related_thesis_id   | UUID      | FK → theses       | Related thesis
is_read             | BOOLEAN   | DEFAULT FALSE     | Read status
read_at             | TIMESTAMP | NULLABLE          | When read
created_at          | TIMESTAMP | DEFAULT NOW       | Sent time

NOTIFICATION TYPES:
- registration_approved: Account approved
- registration_rejected: Account rejected
- thesis_submitted: Thesis submitted by student
- review_started: Supervisor started review
- review_completed: Feedback received
- thesis_approved: Thesis approved
- thesis_rejected: Thesis rejected
- supervisor_assigned: Supervisor assigned to student
- new_thesis_in_field: Related research published
```

---

### 3.10 AUDIT_LOG TABLE
**Purpose**: Track all system actions for compliance and debugging

```sql
Column              | Type      | Constraints      | Notes
────────────────────┼───────────┼──────────────────┼──────────
id                  | UUID      | PRIMARY KEY      | Log ID
user_id             | UUID      | FK → users       | Who did it
action              | VARCHAR   | NOT NULL         | Action type
entity_type         | VARCHAR   | NOT NULL         | What type
entity_id           | UUID      | NULLABLE         | Which record
description         | TEXT      | NULLABLE         | Details
old_values          | JSON      | NULLABLE         | Before state
new_values          | JSON      | NULLABLE         | After state
ip_address          | VARCHAR   | NULLABLE         | IP making request
created_at          | TIMESTAMP | DEFAULT NOW      | When happened

TRACKED ACTIONS:
- USER_REGISTERED: New registration request
- USER_APPROVED: Account approved
- USER_REJECTED: Account rejected
- THESIS_SUBMITTED: Thesis submitted
- THESIS_APPROVED: Thesis approved
- THESIS_REJECTED: Thesis rejected
- REVIEW_STARTED: Supervisor began review
- REVIEW_COMPLETED: Supervisor completed review
- SUPERVISOR_ASSIGNED: Supervisor assigned to student
```

---

## 4. RELATIONSHIPS & CONSTRAINTS

### 4.1 One-to-Many Relationships

```
DEPARTMENTS (1) ──────────────► USERS (Many)
   - One department has many users
   - Each user belongs to one department
   - Query: SELECT users.* FROM users WHERE department_id = ?

USERS [role=admin] (1) ──────► REGISTRATION_REQUESTS (Many)
   - One admin reviews many registration requests
   - Each request reviewed by one admin

USERS [role=student] (1) ──────► THESES (Many)
   - One student can submit multiple theses
   - Each thesis authored by one student

USERS [role=supervisor] (1) ──────► THESES (Many)
   - One supervisor can review many student theses
   - Each thesis assigned to one supervisor

THESES (1) ──────────────────► THESIS_FILES (Many)
   - One thesis has multiple supporting files
   - Each file belongs to one thesis

THESES (1) ──────────────────► THESIS_KEYWORDS (Many)
   - One thesis has multiple keywords
   - Each keyword belongs to one thesis

THESES (1) ──────────────────► REVIEWS (Many)
   - One thesis may have multiple reviews
   - Each review evaluates one thesis
```

### 4.2 Many-to-Many Relationships

```
USERS [supervisors] (Many) ◄─────────► USERS [students] (Many)
   │
   └─ JUNCTION TABLE: supervisor_students
      - Connects supervisors to their assigned students
      - Tracks assignment date and active status
      - Query:
        -- Get all supervisors of a student
        SELECT u.* FROM users u
        INNER JOIN supervisor_students ss ON u.id = ss.supervisor_id
        WHERE ss.student_id = ? AND ss.is_active = TRUE
        
        -- Get all students of a supervisor
        SELECT u.* FROM users u
        INNER JOIN supervisor_students ss ON u.id = ss.student_id
        WHERE ss.supervisor_id = ? AND ss.is_active = TRUE
```

---

## 5. COMPLETE APPLICATION WORKFLOW

### 5.1 User Registration & Approval Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: User Initiates Registration                             │
├─────────────────────────────────────────────────────────────────┤
│ 1. User visits /register page                                   │
│ 2. Fills form: name, email, role (student/supervisor),          │
│    department, phone, purpose                                   │
│ 3. Submits form                                                 │
│                                                                  │
│ ACTION:                                                          │
│ - INSERT INTO registration_requests                             │
│   (email, full_name, requested_role, department_id,             │
│    purpose_statement, status='pending')                         │
│ - INSERT INTO notifications (admin users)                       │
│   "New registration request from [name]"                        │
│ - SEND EMAIL to admin: New request needs approval               │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Admin Reviews Registration                              │
├─────────────────────────────────────────────────────────────────┤
│ 1. Admin views registration_requests (status='pending')         │
│ 2. Admin reviews application                                    │
│ 3. Admin can APPROVE or REJECT                                  │
│                                                                  │
│ IF APPROVED:                                                    │
│ - UPDATE registration_requests SET status='approved',           │
│   admin_id=?, reviewed_at=NOW()                                 │
│ - Trigger: CREATE NEW USER ACCOUNT                              │
│   INSERT INTO users (email, full_name, role,                    │
│     department_id, password_hash, is_approved=TRUE,             │
│     approved_by_admin_id=?, approval_date=NOW())                │
│ - INSERT INTO notifications for user:                           │
│   "Your registration has been approved!"                        │
│ - SEND EMAIL with login credentials                             │
│                                                                  │
│ IF REJECTED:                                                    │
│ - UPDATE registration_requests SET status='rejected',           │
│   admin_id=?, reviewed_at=NOW(), admin_notes=?                  │
│ - INSERT INTO notifications:                                    │
│   "Your registration was rejected"                              │
│ - SEND EMAIL with rejection reason                              │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: User Account Active                                     │
├─────────────────────────────────────────────────────────────────┤
│ 1. User can now login with email/password                       │
│ 2. User profile created based on role                           │
│ 3. User can view dashboard appropriate to role                  │
│                                                                  │
│ ADMIN NEXT STEP:                                                │
│ If Supervisor: Admin can assign students                        │
│ If Student: Wait for thesis submission                          │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Supervisor Assignment Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Admin Assigns Supervisor to Students                    │
├─────────────────────────────────────────────────────────────────┤
│ 1. Admin goes to /admin/assignments                             │
│ 2. Selects supervisor (role='supervisor')                       │
│ 3. Selects one or more students (role='student')                │
│ 4. Clicks "Assign"                                              │
│                                                                  │
│ ACTION:                                                          │
│ - For each student:                                             │
│   INSERT INTO supervisor_students                               │
│   (supervisor_id, student_id, assigned_date=NOW(),              │
│    is_active=TRUE)                                              │
│ - INSERT INTO notifications (supervisor):                       │
│   "You have been assigned [N] students"                         │
│ - INSERT INTO notifications (students):                         │
│   "You have been assigned supervisor: [name]"                   │
│ - INSERT INTO audit_log (action='SUPERVISOR_ASSIGNED')          │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Relationship Active                                     │
├─────────────────────────────────────────────────────────────────┤
│ - Supervisor can see assigned students in dashboard             │
│ - Student can see assigned supervisor                           │
│ - System now allows thesis submission by this pair              │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Thesis Submission Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Student Starts Thesis Submission                        │
├─────────────────────────────────────────────────────────────────┤
│ 1. Student goes to /student/submit                              │
│ 2. Fills thesis information:                                    │
│    - Title, Abstract, Department                                │
│    - Selects from assigned supervisors                          │
│    - Keywords (up to 10)                                        │
│ 3. Uploads files:                                               │
│    - PDF (thesis document) - REQUIRED                           │
│    - Optional: Presentation, Video, Audio, Data                 │
│ 4. Saves as DRAFT or SUBMITS FOR REVIEW                         │
│                                                                  │
│ ACTION (SAVE AS DRAFT):                                         │
│ - INSERT INTO theses                                            │
│   (title, abstract, student_id, supervisor_id,                  │
│    department_id, status='draft', submitted_date=NOW())         │
│ - INSERT INTO thesis_files for each uploaded file               │
│ - INSERT INTO thesis_keywords for each keyword                  │
│ - INSERT INTO notifications (student):                          │
│   "Thesis draft saved"                                          │
│ - Thesis stored, student can edit later                         │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Student Submits for Review                              │
├─────────────────────────────────────────────────────────────────┤
│ 1. Student clicks "Submit for Review"                           │
│ 2. System validates:                                            │
│    - Title filled                                               │
│    - Abstract filled                                            │
│    - Supervisor selected                                        │
│    - At least 1 PDF uploaded                                    │
│                                                                  │
│ ACTION (IF VALIDATION PASSES):                                  │
│ - UPDATE theses SET status='submitted'                          │
│ - INSERT INTO reviews                                           │
│   (thesis_id, reviewer_id=supervisor_id,                        │
│    review_status='pending', created_at=NOW())                   │
│ - INSERT INTO notifications (supervisor):                       │
│   "New thesis submitted for review: [title]"                    │
│ - SEND EMAIL to supervisor                                      │
│ - INSERT INTO audit_log (action='THESIS_SUBMITTED')             │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: Supervisor Reviews Thesis                               │
├─────────────────────────────────────────────────────────────────┤
│ 1. Supervisor views /supervisor/reviews                         │
│ 2. Clicks on thesis to review                                   │
│ 3. Downloads PDF, views files                                   │
│ 4. Changes review status to 'in-progress'                       │
│ 5. Provides feedback:                                           │
│    - Feedback text (concerns, questions)                        │
│    - Rating (1-5)                                               │
│    - Suggested changes                                          │
│ 6. Submits review                                               │
│                                                                  │
│ ACTION:                                                          │
│ - UPDATE reviews SET                                            │
│   review_status='completed', feedback_text=?,                   │
│   rating=?, suggested_changes=?, completed_at=NOW()             │
│ - UPDATE theses SET status='in-review'                          │
│ - INSERT INTO notifications (student):                          │
│   "Your thesis feedback is ready"                               │
│ - SEND EMAIL to student with link to review                     │
│ - INSERT INTO audit_log (action='REVIEW_COMPLETED')             │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: Admin Final Approval                                    │
├─────────────────────────────────────────────────────────────────┤
│ 1. Admin views pending theses for final approval                │
│ 2. Reads supervisor feedback                                    │
│ 3. Makes FINAL DECISION: APPROVE or REJECT                      │
│                                                                  │
│ ACTION (IF APPROVED):                                           │
│ - UPDATE theses SET status='approved',                          │
│   approval_date=NOW()                                           │
│ - Thesis NOW VISIBLE in:                                        │
│   * /browse - all users can see                                 │
│   * Search/filters                                              │
│   * Download statistics start tracking                          │
│ - INSERT INTO notifications:                                    │
│   - Student: "Your thesis has been approved!"                   │
│   - Supervisor: "Thesis approved"                               │
│ - SEND EMAILS to both                                           │
│ - INSERT INTO audit_log (action='THESIS_APPROVED')              │
│                                                                  │
│ ACTION (IF REJECTED):                                           │
│ - UPDATE theses SET status='rejected',                          │
│   rejection_reason=?                                            │
│ - INSERT INTO notifications:                                    │
│   - Student: "Revisions needed"                                 │
│   - Supervisor: "Thesis rejected"                               │
│ - SEND EMAILS with reason                                       │
│ - Student can resubmit after revisions                          │
│ - INSERT INTO audit_log (action='THESIS_REJECTED')              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. DASHBOARD DATA FLOW

### 6.1 Admin Dashboard
**Query**: Show overview of system activity

```sql
-- Total approved theses
SELECT COUNT(*) as total_theses 
FROM theses WHERE status = 'approved'

-- Pending approvals
SELECT COUNT(*) as pending_theses 
FROM theses WHERE status = 'submitted' OR status = 'in-review'

-- Pending registrations
SELECT * FROM registration_requests 
WHERE status = 'pending' ORDER BY requested_at DESC

-- Active users by role
SELECT role, COUNT(*) as count 
FROM users WHERE is_active = TRUE 
GROUP BY role

-- Monthly submissions
SELECT MONTH(submitted_date) as month, COUNT(*) as count
FROM theses 
WHERE YEAR(submitted_date) = YEAR(NOW())
GROUP BY MONTH(submitted_date)
```

### 6.2 Supervisor Dashboard
**Query**: Show supervisor's assigned students and their theses

```sql
-- My assigned students
SELECT u.id, u.full_name, u.email 
FROM users u
INNER JOIN supervisor_students ss ON u.id = ss.student_id
WHERE ss.supervisor_id = ? AND ss.is_active = TRUE

-- Theses to review
SELECT t.*, r.review_status, r.created_at
FROM theses t
INNER JOIN reviews r ON t.id = r.thesis_id
WHERE t.supervisor_id = ? 
ORDER BY r.created_at DESC

-- By status
SELECT COUNT(*), status 
FROM theses 
WHERE supervisor_id = ? 
GROUP BY status
```

### 6.3 Student Dashboard
**Query**: Show student's thesis status and submissions

```sql
-- My supervisor
SELECT u.id, u.full_name, u.email
FROM users u
INNER JOIN supervisor_students ss ON u.id = ss.supervisor_id
WHERE ss.student_id = ? AND ss.is_active = TRUE

-- My theses
SELECT t.*, r.review_status, r.feedback_text
FROM theses t
LEFT JOIN reviews r ON t.id = r.thesis_id
WHERE t.student_id = ?
ORDER BY t.submitted_date DESC

-- Latest feedback
SELECT feedback_text, rating, completed_at
FROM reviews r
INNER JOIN theses t ON r.thesis_id = t.id
WHERE t.student_id = ? AND r.review_status = 'completed'
ORDER BY r.completed_at DESC LIMIT 1
```

### 6.4 Public Browse View
**Query**: Show approved theses to all users

```sql
-- All approved theses
SELECT t.*, u.full_name, d.name as department_name
FROM theses t
INNER JOIN users u ON t.student_id = u.id
INNER JOIN departments d ON t.department_id = d.id
WHERE t.status = 'approved'
ORDER BY t.submitted_date DESC

-- Filter by department
SELECT * FROM theses 
WHERE status = 'approved' AND department_id = ?

-- Search by keyword
SELECT DISTINCT t.* FROM theses t
INNER JOIN thesis_keywords tk ON t.id = tk.thesis_id
WHERE t.status = 'approved' 
  AND tk.keyword LIKE CONCAT('%', ?, '%')

-- Search by title/author
SELECT t.* FROM theses t
INNER JOIN users u ON t.student_id = u.id
WHERE t.status = 'approved'
  AND (t.title LIKE CONCAT('%', ?, '%')
       OR u.full_name LIKE CONCAT('%', ?, '%'))
```

---

## 7. DATA INTEGRITY & CONSTRAINTS

### 7.1 Foreign Key Constraints
```sql
-- Ensure data consistency across tables
ALTER TABLE users ADD CONSTRAINT fk_user_department
  FOREIGN KEY (department_id) REFERENCES departments(id);

ALTER TABLE theses ADD CONSTRAINT fk_thesis_student
  FOREIGN KEY (student_id) REFERENCES users(id);

ALTER TABLE theses ADD CONSTRAINT fk_thesis_supervisor
  FOREIGN KEY (supervisor_id) REFERENCES users(id);

ALTER TABLE supervisor_students ADD CONSTRAINT fk_ss_supervisor
  FOREIGN KEY (supervisor_id) REFERENCES users(id);

ALTER TABLE supervisor_students ADD CONSTRAINT fk_ss_student
  FOREIGN KEY (student_id) REFERENCES users(id);
```

### 7.2 Unique Constraints
```sql
-- No duplicate emails
ALTER TABLE users ADD UNIQUE KEY uk_email (email);

-- No duplicate supervisor-student pairs
ALTER TABLE supervisor_students ADD UNIQUE KEY uk_ss_pair 
  (supervisor_id, student_id);

-- No duplicate keywords per thesis
ALTER TABLE thesis_keywords ADD UNIQUE KEY uk_thesis_keyword 
  (thesis_id, keyword);
```

### 7.3 Check Constraints
```sql
-- Valid enum values
ALTER TABLE users ADD CONSTRAINT chk_user_role 
  CHECK (role IN ('student', 'supervisor', 'admin'));

ALTER TABLE theses ADD CONSTRAINT chk_thesis_status 
  CHECK (status IN ('draft', 'submitted', 'in-review', 'approved', 'rejected'));

ALTER TABLE reviews ADD CONSTRAINT chk_review_rating 
  CHECK (rating >= 1 AND rating <= 5);
```

---

## 8. PERFORMANCE CONSIDERATIONS

### 8.1 Indexes for Fast Queries

```sql
-- Frequently searched columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_theses_status ON theses(status);
CREATE INDEX idx_theses_student_id ON theses(student_id);
CREATE INDEX idx_theses_supervisor_id ON theses(supervisor_id);
CREATE INDEX idx_theses_department_id ON theses(department_id);

-- Composite indexes for common queries
CREATE INDEX idx_theses_status_department 
  ON theses(status, department_id);

CREATE INDEX idx_supervisor_students_active 
  ON supervisor_students(supervisor_id, is_active);

-- Full-text search optimization
CREATE FULLTEXT INDEX idx_thesis_search 
  ON theses(title, abstract);
```

### 8.2 Query Optimization Tips

```sql
-- Use EXPLAIN to analyze query performance
EXPLAIN SELECT * FROM theses 
WHERE status = 'approved' AND department_id = ?

-- Use JOINs instead of subqueries
SELECT t.*, u.full_name FROM theses t
INNER JOIN users u ON t.student_id = u.id

-- Paginate large result sets
SELECT * FROM theses 
WHERE status = 'approved' 
LIMIT ? OFFSET ?

-- Use appropriate data types
-- UUID for IDs instead of VARCHAR
-- ENUM instead of VARCHAR for fixed values
-- INT for year instead of VARCHAR
```

---

## 9. BACKUP & RECOVERY

### 9.1 Backup Strategy
```sql
-- Daily full backup
mysqldump -u root -p thesis_db > backup_$(date +%Y%m%d).sql

-- Weekly incremental backup
mysqldump -u root -p --incremental thesis_db > incremental_$(date +%Y%m%d).sql

-- Test backup integrity
mysql -u root -p thesis_db < backup_20250101.sql (on test server)
```

### 9.2 Disaster Recovery
```sql
-- Restore from backup
mysql -u root -p thesis_db < backup_20250101.sql

-- Check data integrity
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM theses;
SELECT COUNT(*) FROM supervisor_students;

-- Verify relationships
SELECT t.id FROM theses t
WHERE t.student_id NOT IN (SELECT id FROM users)
   OR t.supervisor_id NOT IN (SELECT id FROM users);
```

---

## 10. SECURITY CONSIDERATIONS

### 10.1 Data Protection
- Passwords stored as bcrypt hashes (never plain text)
- Email verification for registrations
- Role-based access control (RBAC) at application level
- Audit logging for all sensitive operations

### 10.2 Audit Trail
Every critical action recorded in audit_log table:
```sql
INSERT INTO audit_log (user_id, action, entity_type, entity_id, 
  old_values, new_values) 
VALUES (?, 'THESIS_STATUS_CHANGE', 'thesis', ?, 
  JSON_OBJECT('status', 'draft'),
  JSON_OBJECT('status', 'approved'));
```

### 10.3 Row-Level Security
- Students can only see/modify their own theses
- Supervisors can only see assigned students' theses
- Admins can see all records
- Public can only see approved theses

---

## 11. MIGRATION PATH FROM FRONTEND-ONLY STATE

### Current State (v44)
- All data in JavaScript arrays (lib/data/theses.ts)
- No user management
- No approval workflow
- No permission system

### Step 1: Create Database Schema
1. Run database-schema.sql
2. Create development database
3. Test all relationships

### Step 2: Migrate Existing Theses Data
```sql
-- Convert frontend thesis data to database theses
INSERT INTO users (email, full_name, role, is_approved) VALUES
  ('admin@sust.edu.bd', 'System Admin', 'admin', TRUE);

INSERT INTO departments (name, code) VALUES
  ('Computer Science & Engineering', 'CSE'),
  ('Electrical & Electronic Engineering', 'EEE'),
  -- ... etc

INSERT INTO theses (title, student_id, supervisor_id, department_id, 
  abstract, year, status, submitted_date) VALUES
  -- Migrate from thesesDatabase array
```

### Step 3: Implement Application Layer
1. Create API endpoints for each operation
2. Implement authentication/authorization
3. Add registration approval workflow
4. Connect frontend to backend

### Step 4: Data Validation
1. Verify all theses migrated correctly
2. Check foreign key relationships
3. Test all dashboard queries
4. Validate permission system

---

## APPENDIX: SQL QUERY REFERENCE

### User Management
```sql
-- Create admin user (initially)
INSERT INTO users (email, full_name, role, is_approved, approval_date)
VALUES ('admin@sust.edu.bd', 'System Admin', 'admin', TRUE, NOW());

-- Get all pending registrations
SELECT * FROM registration_requests 
WHERE status = 'pending' ORDER BY requested_at DESC;

-- Approve registration
UPDATE registration_requests 
SET status = 'approved', admin_id = ?, reviewed_at = NOW()
WHERE id = ?;
```

### Thesis Management
```sql
-- Get thesis with all details
SELECT t.*, u.full_name, d.name, 
  GROUP_CONCAT(tk.keyword) as keywords
FROM theses t
INNER JOIN users u ON t.student_id = u.id
INNER JOIN departments d ON t.department_id = d.id
LEFT JOIN thesis_keywords tk ON t.id = tk.thesis_id
WHERE t.id = ?
GROUP BY t.id;

-- Get supervisor's review queue
SELECT t.*, r.review_status, r.created_at
FROM theses t
INNER JOIN reviews r ON t.id = r.thesis_id
WHERE t.supervisor_id = ? AND r.review_status IN ('pending', 'in-progress')
ORDER BY r.created_at ASC;
```

---

## CONCLUSION

This database model provides a complete, scalable solution for the SUST Thesis Repository system. It supports:

✅ Role-based access control (Student, Supervisor, Admin)
✅ Complete approval workflow (Registration → Assignment → Submission → Review → Approval)
✅ Audit trail for compliance
✅ Search and discovery functionality
✅ Performance optimization through proper indexing
✅ Data integrity through constraints and relationships
✅ Extensibility for future features

The model is production-ready and can be implemented incrementally starting from the current frontend-only state.
