# System Context Diagram

**Purpose**: High-level view of the SUST Research Hub system showing external entities and their interactions with the system. Follows ISO/IEC 19501 and IEEE 1471 standards.

## System Context Diagram

\`\`\`mermaid
graph TB
    %% External Actors
    Student[👨‍🎓 Students<br/>Register, Login, Submit Theses,<br/>Browse Repository, Collaborate]
    Supervisor[👨‍🏫 Supervisors<br/>Register, Login, Review Theses,<br/>Verify Originality, Approve Publications]
    Admin[👨‍💼 Administrators<br/>Approve Users, Manage System,<br/>View Analytics, Configure Settings]
    Public[🌐 Public Users<br/>Browse Published Theses,<br/>Search Repository, View Research]
    
    %% The System
    System[<b>SUST Research Hub</b><br/>Thesis Repository System<br/>━━━━━━━━━━━━━━━━<br/>• User Management<br/>• Thesis Submission & Review<br/>• Repository & Search<br/>• Download Permissions<br/>• Analytics & Reporting]
    
    %% External Systems
    Database[(🗄️ PostgreSQL/Neon<br/>Database<br/>━━━━━━━━━━━━<br/>Stores users, theses,<br/>authors, files, sessions,<br/>permissions, analytics)]
    
    FileStorage[(📁 File Storage<br/>Vercel Blob<br/>━━━━━━━━━━━━<br/>Stores thesis PDFs,<br/>supporting documents,<br/>presentations, datasets)]
    
    EmailService[📧 Email Service<br/>External SMTP<br/>━━━━━━━━━━━━<br/>Registration confirmations,<br/>Review notifications,<br/>Download permissions]
    
    AuthService[🔐 Authentication<br/>Session Management<br/>━━━━━━━━━━━━<br/>JWT tokens, password<br/>hashing, session storage]
    
    %% Relationships
    Student -->|1. Register Account<br/>2. Submit Thesis<br/>3. Request Co-authors<br/>4. Grant Download Permissions| System
    System -->|Registration Status<br/>Submission Confirmations<br/>Notifications| Student
    
    Supervisor -->|1. Register Account<br/>2. Review Submissions<br/>3. Verify Research<br/>4. Approve/Reject Theses| System
    System -->|Review Requests<br/>Student Progress<br/>Analytics Reports| Supervisor
    
    Admin -->|1. Approve User Registrations<br/>2. Manage User Roles<br/>3. Publish Approved Theses<br/>4. Configure System Settings| System
    System -->|System Analytics<br/>User Statistics<br/>Repository Metrics| Admin
    
    Public -->|1. Browse Repository<br/>2. Search Theses<br/>3. View Abstracts<br/>4. Request Downloads| System
    System -->|Search Results<br/>Thesis Metadata<br/>File Access| Public
    
    System <-->|Store/Retrieve<br/>Users, Theses,<br/>Authors, Files,<br/>Permissions| Database
    
    System <-->|Upload/Download<br/>PDF Files,<br/>Presentations,<br/>Datasets| FileStorage
    
    System -->|Send Notifications<br/>Registration Approvals<br/>Review Updates<br/>Download Permissions| EmailService
    
    System <-->|Authenticate Users<br/>Manage Sessions<br/>Verify Tokens| AuthService
    
    %% Styling
    classDef systemStyle fill:#1e40af,stroke:#1e3a8a,stroke-width:4px,color:#fff
    classDef actorStyle fill:#059669,stroke:#047857,stroke-width:2px,color:#fff
    classDef externalStyle fill:#7c3aed,stroke:#6d28d9,stroke-width:2px,color:#fff
    
    class System systemStyle
    class Student,Supervisor,Admin,Public actorStyle
    class Database,FileStorage,EmailService,AuthService externalStyle
\`\`\`

## System Boundary

**Inside the System (SUST Research Hub):**
- User authentication and authorization
- Thesis submission and workspace management
- Review and approval workflows
- Repository browsing and search functionality
- Download permission management (any co-author can approve)
- Analytics and reporting
- User profile management
- Notification system

**Outside the System (External Entities):**
- Students (primary users submitting research)
- Supervisors (reviewing and approving research)
- Administrators (managing system and users)
- Public Users (accessing published repository)
- PostgreSQL/Neon Database (data persistence)
- Vercel Blob Storage (file storage)
- Email Service (notifications and communications)
- Authentication Service (security and sessions)

## Key Interactions

### 1. Student Interactions
- **Register** → System validates and sends to admin for approval
- **Submit Thesis** → System creates workspace, assigns supervisor, initiates review
- **Collaborate** → System manages co-authors, tracks contributions
- **Grant Download Permission** → Any author can enable public downloads

### 2. Supervisor Interactions
- **Review Thesis** → System presents submissions, records feedback
- **Verify Originality** → System tracks plagiarism checks, originality scores
- **Approve Publication** → System forwards to admin for final publishing

### 3. Administrator Interactions
- **Approve Users** → System activates accounts, sends email notifications
- **Publish Theses** → System moves from workspace to public repository
- **View Analytics** → System generates reports on usage, submissions, downloads

### 4. Public User Interactions
- **Browse Repository** → System displays published theses with metadata
- **Search** → System queries by title, keywords, author, department, year
- **Request Download** → System checks author permissions before allowing access

### 5. Database Interactions
- Persistent storage of all users, theses, authors, files, sessions
- Relational integrity maintained through foreign keys
- Optimized queries with composite indexes

### 6. File Storage Interactions
- Secure upload of thesis documents (PDF, DOCX)
- Support for presentations (PPTX), datasets (CSV, XLSX)
- Access control based on thesis status and author permissions

### 7. Email Service Interactions
- Registration approval/rejection notifications
- Thesis submission confirmations
- Review status updates
- Download permission grants

### 8. Authentication Service Interactions
- Secure password hashing (bcrypt)
- JWT token generation and validation
- Session management with expiry
- Role-based access control (Student, Supervisor, Admin)

## Data Flows Summary

| From | To | Data |
|------|-----|------|
| Student | System | Registration info, Thesis data, Files |
| Supervisor | System | Reviews, Approvals, Feedback |
| Admin | System | User approvals, System configs |
| Public | System | Search queries, Download requests |
| System | Database | CRUD operations on all entities |
| System | File Storage | File uploads/downloads |
| System | Email Service | Notification triggers |
| System | All Users | Responses, Notifications, Data |

## Security Boundaries

- **Authentication Boundary**: All users must authenticate before accessing protected resources
- **Authorization Boundary**: Role-based access control enforces permissions
- **Data Boundary**: Database and file storage are isolated from direct user access
- **Network Boundary**: HTTPS encryption for all communications
- **Session Boundary**: Time-limited sessions with secure token management

---

**Document Version**: 1.0  
**Last Updated**: 2025  
**Standard Compliance**: ISO/IEC 19501, IEEE 1471
