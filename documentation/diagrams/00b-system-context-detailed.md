# System Context Diagram - Detailed Description

## Purpose
This diagram provides a comprehensive view of the SUST Research Hub system boundaries, external entities, and their interactions. It establishes the scope of the system and identifies all external interfaces.

## System Overview
**SUST Research Hub** is a centralized web-based platform for managing, publishing, and accessing academic research theses from Shahjalal University of Science and Technology (SUST). The system provides role-based access control and facilitates research discovery, collaboration, and download management with author permissions.

---

## External Actors

### 1. **Students (Primary Users)**
**Role:** Research authors and consumers
**Interactions:**
- Browse and search published theses without authentication
- Register for accounts (pending admin approval)
- Submit thesis metadata and files for publication
- Collaborate with co-authors on research submissions
- Manage download permissions for their published works
- View thesis analytics (views, downloads)
- Receive email notifications about submission status

### 2. **Supervisors (Academic Faculty)**
**Role:** Research mentors and reviewers
**Interactions:**
- Browse and search published theses
- Register for supervisor accounts (pending admin approval)
- Review student thesis submissions
- Verify research originality and quality
- Approve or request revisions for theses
- Supervise multiple student projects
- Download theses for review purposes
- Receive email notifications about new submissions

### 3. **Administrators (System Managers)**
**Role:** System governance and user management
**Interactions:**
- Approve or reject user registration requests
- Manage user accounts (activate, deactivate, update roles)
- Moderate published content
- Manage system settings and configurations
- View system analytics and usage statistics
- Monitor thesis submissions and approvals
- Handle reported issues and content flags
- Receive email notifications about pending registrations

### 4. **Public Users (Anonymous Visitors)**
**Role:** Research consumers without accounts
**Interactions:**
- Browse thesis repository by field, department, year
- Search theses by keywords, authors, titles
- View thesis details (title, abstract, authors, keywords)
- View download statistics
- Cannot download files (requires author permission and account)
- Access public pages (home, browse, about, help)

---

## External Systems

### 5. **Neon PostgreSQL Database**
**Type:** Cloud-hosted relational database
**Purpose:** Persistent data storage
**Data Stored:**
- User accounts and authentication credentials (bcrypt hashed passwords)
- Session tokens and email verification tokens
- Registration requests and approval status
- Thesis metadata (title, abstract, keywords, department, year)
- Thesis authorship relationships (co-authors with ordering)
- Thesis file metadata and storage references
- Download permission records (per author, per thesis)
- Thesis analytics (view counts, download counts)

**Interactions:**
- System reads/writes all persistent data
- Enforces data integrity via foreign keys and constraints
- Provides indexed queries for fast search and filtering
- Maintains transaction logs for audit trail

### 6. **Resend Email Service**
**Type:** External transactional email API
**Purpose:** Automated email notifications
**Email Types Sent:**
- **Registration Confirmation:** Sent to users after successful registration
- **Account Approval:** Notify users when admin approves their account
- **Account Rejection:** Notify users if registration is rejected with reason
- **Email Verification:** Verify email ownership during registration
- **Submission Confirmation:** Confirm thesis submission received
- **Review Notification:** Notify authors when supervisor reviews thesis
- **Approval Notification:** Notify authors when thesis is approved and published
- **Download Request:** Notify authors when someone requests download permission
- **Permission Granted:** Notify requester when download is approved

**Authentication:** API key stored in environment variables

---

## System Boundaries

### Inside System Boundary
- User authentication and authorization logic
- Thesis submission and approval workflows
- Search and filtering algorithms
- Download permission management
- File upload handling and validation
- Analytics calculation and aggregation
- Email notification triggers
- UI rendering and user interactions

### Outside System Boundary
- Email delivery infrastructure (Resend)
- Database infrastructure and backups (Neon)
- User's web browsers and devices
- File storage infrastructure (Vercel Blob/local filesystem)
- Network infrastructure and DNS
- SSL certificate management

---

## Primary Data Flows

### 1. **User Registration Flow**
\`\`\`
Student/Supervisor → System: Submit registration form (name, email, password, role)
System → Database: Store registration request with pending status
System → Email Service: Send verification email
User → System: Click verification link
System → Database: Mark email as verified
Admin → System: Review registration request
System → Database: Update registration status (approved/rejected)
System → Email Service: Send approval/rejection notification
User → System: Login with approved credentials
\`\`\`

### 2. **Thesis Submission Flow**
\`\`\`
Student → System: Login and access submission form
Student → System: Upload thesis files and enter metadata
System → Database: Store thesis with "draft" status
System → File Storage: Store PDF and supplementary files
System → Database: Link thesis to author(s) via thesis_authors table
System → Email Service: Notify supervisor about new submission
Supervisor → System: Review thesis submission
Supervisor → System: Approve or request revisions
System → Database: Update thesis status to "published" (if approved)
System → Email Service: Notify author(s) about approval
\`\`\`

### 3. **Thesis Browse and Search Flow**
\`\`\`
Public User → System: Access browse page
System → Database: Query published theses with filters
Database → System: Return thesis metadata with author names
System → User: Display thesis cards with title, authors, abstract
User → System: Click search with keywords
System → Database: Full-text search on title, abstract, keywords
Database → System: Return matching theses
System → User: Display search results with relevance ranking
\`\`\`

### 4. **Download Permission Flow**
\`\`\`
Registered User → System: Request thesis download
System → Database: Check user's download permission for thesis
System → Database: Check if any author has granted permission
Database → System: Return permission status
IF permission NOT granted:
  System → Database: Create download request record
  System → Email Service: Notify all authors about download request
  Author → System: Login and view download requests
  Author → System: Grant or deny permission
  System → Database: Update download_permissions table
  System → Email Service: Notify requester about decision
IF permission granted (by ANY author):
  System → File Storage: Retrieve thesis PDF
  System → User: Stream file download
  System → Database: Increment download count
\`\`\`

### 5. **Analytics Tracking Flow**
\`\`\`
User → System: View thesis detail page
System → Database: Increment view_count for thesis
User → System: Download thesis file
System → Database: Increment download_count for thesis
Admin → System: Access analytics dashboard
System → Database: Aggregate statistics (total theses, by department, by year)
Database → System: Return aggregated metrics
System → Admin: Display charts and statistics
\`\`\`

---

## Security Boundaries

### Authentication
- Session-based authentication using HTTP-only cookies
- Passwords hashed with bcrypt (10 rounds)
- Email verification required for registration
- Session expiry after 7 days of inactivity

### Authorization
- Role-based access control (Student, Supervisor, Admin)
- Page-level authorization checks
- API endpoint protection with role verification
- Download permissions enforced at file access level

### Data Protection
- HTTPS encryption for all communications
- SQL injection prevention via parameterized queries
- XSS prevention via React's built-in escaping
- CSRF protection via same-origin policy

---

## Technology Stack

### Frontend
- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **UI Library:** React 19.2
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui

### Backend
- **Runtime:** Node.js (serverless)
- **API:** Next.js Route Handlers
- **Server Actions:** React Server Actions

### Database
- **Database:** PostgreSQL (Neon)
- **ORM:** Direct SQL via @vercel/postgres
- **Caching:** React cache() for request deduplication

### External Services
- **Email:** Resend API
- **Hosting:** Vercel
- **File Storage:** Vercel Blob or local filesystem

---

## Diagram Representation

\`\`\`mermaid
graph TB
    subgraph "External Actors"
        S[Students]
        SV[Supervisors]
        A[Administrators]
        PU[Public Users]
    end
    
    subgraph "SUST Research Hub System"
        WEB[Web Application<br/>Next.js + React]
        AUTH[Authentication<br/>Module]
        THESIS[Thesis Management<br/>Module]
        PERM[Download Permission<br/>Module]
        ANAL[Analytics<br/>Module]
        NOTIF[Notification<br/>Module]
    end
    
    subgraph "External Systems"
        DB[(Neon PostgreSQL<br/>Database)]
        EMAIL[Resend Email<br/>Service]
        STORE[File Storage<br/>Vercel Blob]
    end
    
    S -->|Register, Submit, Browse| WEB
    SV -->|Register, Review, Browse| WEB
    A -->|Approve Users, Manage| WEB
    PU -->|Browse, Search| WEB
    
    WEB --> AUTH
    WEB --> THESIS
    WEB --> PERM
    WEB --> ANAL
    WEB --> NOTIF
    
    AUTH -->|User Data| DB
    THESIS -->|Thesis Data| DB
    PERM -->|Permissions| DB
    ANAL -->|Analytics| DB
    
    THESIS -->|Store Files| STORE
    NOTIF -->|Send Emails| EMAIL
    
    DB -->|Query Results| AUTH
    DB -->|Query Results| THESIS
    DB -->|Query Results| PERM
    DB -->|Query Results| ANAL
    
    EMAIL -->|Delivery Status| NOTIF
    STORE -->|File Access| THESIS
\`\`\`

---

## Data Flow Summary

| From | To | Data Type | Protocol |
|------|-----|-----------|----------|
| Users | System | HTTP Requests | HTTPS |
| System | Database | SQL Queries | PostgreSQL Wire Protocol |
| System | Email Service | API Requests | HTTPS REST API |
| System | File Storage | File Operations | HTTPS API |
| Email Service | Users | Email Notifications | SMTP |
| Database | System | Query Results | PostgreSQL Wire Protocol |

---

## Notes
- All user passwords are hashed and never stored in plain text
- Email verification is mandatory for all new registrations
- Download permissions require at least one author's approval
- Public users can browse but not download without account
- System maintains audit logs for all critical operations
- Database backups are managed by Neon infrastructure
