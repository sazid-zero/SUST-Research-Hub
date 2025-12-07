# Entity Relationship Diagram (ERD) - ACTUAL DATABASE

This diagram shows the **actual implemented database schema** based on the migration scripts.

\`\`\`mermaid
erDiagram
    USERS ||--o{ SESSIONS : "has"
    USERS ||--o{ REGISTRATION_REQUESTS : "requests"
    USERS ||--o{ EMAIL_VERIFICATION_TOKENS : "has"
    USERS ||--o{ THESES : "supervises"
    USERS ||--o{ THESIS_AUTHORS : "authors"
    USERS }o--|| REGISTRATION_REQUESTS : "reviews"
    USERS }o--|| USERS : "approves"
    
    THESES ||--o{ THESIS_AUTHORS : "has"
    THESES ||--o{ THESIS_FILES : "contains"
    THESES }o--|| USERS : "supervised_by"
    
    THESIS_AUTHORS }o--|| USERS : "is"
    THESIS_AUTHORS }o--|| THESES : "belongs_to"

    USERS {
        serial id PK
        varchar email UK "NOT NULL"
        varchar password_hash "NOT NULL"
        varchar full_name "NOT NULL"
        varchar role "CHECK student/supervisor/admin"
        varchar student_id UK "Required for students"
        varchar department
        varchar specialization "For supervisors"
        boolean is_approved "Default FALSE"
        timestamp approval_date
        integer approved_by FK
        timestamp created_at
        timestamp updated_at
    }

    SESSIONS {
        serial id PK
        integer user_id FK "NOT NULL, CASCADE DELETE"
        varchar token UK "NOT NULL"
        timestamp expires_at "NOT NULL"
        timestamp created_at
    }

    REGISTRATION_REQUESTS {
        serial id PK
        integer user_id FK "NOT NULL, CASCADE DELETE"
        varchar status "CHECK pending/approved/rejected"
        text rejection_reason
        integer reviewed_by FK
        timestamp reviewed_at
        timestamp created_at
    }

    EMAIL_VERIFICATION_TOKENS {
        serial id PK
        integer user_id FK "NOT NULL, CASCADE DELETE"
        varchar token UK "NOT NULL"
        timestamp expires_at "NOT NULL"
        timestamp created_at
    }

    THESES {
        serial id PK
        varchar title "NOT NULL, max 500"
        text abstract "NOT NULL"
        varchar department "NOT NULL"
        varchar field
        integer year "NOT NULL"
        date submitted_date "NOT NULL"
        varchar status "CHECK approved/pending/rejected/in-review"
        text_array keywords "Default empty array"
        integer views "Default 0"
        integer downloads "Default 0"
        integer supervisor_id FK "SET NULL on delete"
        timestamp created_at
        timestamp updated_at
    }

    THESIS_AUTHORS {
        serial id PK
        integer thesis_id FK "NOT NULL, CASCADE DELETE"
        integer author_id FK "NOT NULL, CASCADE DELETE"
        integer author_order "Default 1"
        varchar role "CHECK primary_author/co_author"
        timestamp created_at
        unique thesis_id_author_id "UNIQUE(thesis_id, author_id)"
    }

    THESIS_FILES {
        serial id PK
        integer thesis_id FK "NOT NULL, CASCADE DELETE"
        varchar file_name "NOT NULL"
        varchar file_size "NOT NULL"
        varchar file_type "CHECK pdf/presentation/video/audio/supplementary"
        text file_url
        timestamp uploaded_at
    }
\`\`\`

## Implemented Tables (7 total)

### Core Tables
1. **users** - All system users (students, supervisors, admins)
2. **theses** - Published research theses
3. **thesis_authors** - Co-authorship support (many-to-many)
4. **thesis_files** - File attachments for theses

### Authentication & Authorization
5. **sessions** - User session management
6. **registration_requests** - Pending user registrations
7. **email_verification_tokens** - Email verification system

## Key Features

### Co-Authorship Support ✓
- Each thesis can have multiple authors via `thesis_authors` table
- Authors are ordered using `author_order` field
- Distinguishes between primary and co-authors via `role` field
- Enforces unique constraint (one user can't be added twice to same thesis)

### Indexes for Performance
- `idx_theses_status`, `idx_theses_department`, `idx_theses_year`
- `idx_thesis_authors_thesis`, `idx_thesis_authors_author`
- `idx_users_email`, `idx_users_student_id`, `idx_users_role`
- `idx_sessions_token` for fast authentication

## Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| User → Theses | 1:N | Supervisor relationship |
| User → Thesis Authors | 1:N | Authorship |
| Thesis → Thesis Authors | 1:N | Multiple authors per thesis |
| Thesis → Thesis Files | 1:N | Multiple files per thesis |
| User → User | 1:N | Approval workflow |

## Constraints

- Role-based constraints on users (student_id required only for students)
- Status enums for theses (approved/pending/rejected/in-review)
- File type enums (pdf/presentation/video/audio/supplementary)
- Unique constraints on email, student_id, session tokens
- Foreign key CASCADE deletes for dependent data
