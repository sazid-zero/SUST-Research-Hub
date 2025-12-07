# Entity Relationship Diagram - Complete Database Schema

This ER diagram shows the complete database structure for the Thesis Repository System, including the download permission workflow.

\`\`\`mermaid
erDiagram
    %% ============================================
    %% CORE USER MANAGEMENT
    %% ============================================
    
    users ||--o{ sessions : "has many"
    users ||--o{ thesis_authors : "authors"
    users ||--o{ theses : "supervises"
    users ||--o{ thesis_reviews : "reviews"
    users ||--o{ thesis_comments : "comments on"
    users ||--o{ notifications : "receives"
    users ||--o{ activity_logs : "performs"
    users ||--o{ download_permissions : "grants/denies"
    users ||--o{ workspaces : "creates"
    users ||--o{ workspace_members : "member of"
    
    users {
        int id PK
        string email UK "UNIQUE NOT NULL"
        string password_hash "NOT NULL"
        string full_name "NOT NULL"
        string student_id UK "UNIQUE"
        enum role "student|supervisor|admin"
        string department
        text profile_picture
        text bio
        text[] research_interests
        string phone
        timestamp created_at
        timestamp updated_at
        timestamp last_login
        boolean is_active
        boolean is_verified
    }
    
    sessions {
        int id PK
        int user_id FK
        string session_token UK "UNIQUE"
        timestamp expires_at
        timestamp created_at
        string ip_address
        text user_agent
    }
    
    registration_requests {
        int id PK
        string email UK "UNIQUE"
        string full_name
        string student_id
        string department
        enum requested_role
        enum status "pending|approved|rejected"
        timestamp requested_at
        timestamp reviewed_at
        int reviewed_by FK
        text reason
    }
    
    email_verification_tokens {
        int id PK
        int user_id FK
        string token UK "UNIQUE"
        timestamp expires_at
        timestamp created_at
        boolean used
    }
    
    %% ============================================
    %% THESIS MANAGEMENT
    %% ============================================
    
    theses ||--o{ thesis_authors : "has many"
    theses ||--o{ thesis_files : "has many"
    theses ||--o{ thesis_reviews : "has many"
    theses ||--o{ thesis_comments : "has many"
    theses ||--o{ download_permissions : "requires permission for"
    theses ||--o{ thesis_views : "tracked by"
    theses ||--o{ thesis_downloads : "tracked by"
    
    theses {
        int id PK
        string title "NOT NULL"
        text abstract "NOT NULL"
        string department "NOT NULL"
        string field "NOT NULL"
        text[] keywords "NOT NULL"
        int year "NOT NULL"
        int supervisor_id FK
        enum status "draft|submitted|under_review|approved|rejected|published"
        timestamp submitted_date
        timestamp approved_date
        timestamp published_date
        int views "DEFAULT 0"
        int downloads "DEFAULT 0"
        timestamp created_at
        timestamp updated_at
    }
    
    thesis_authors {
        int id PK
        int thesis_id FK
        int author_id FK
        int author_order "NOT NULL"
        enum role "primary_author|co_author"
        int contribution_percentage
        timestamp created_at
    }
    
    thesis_files {
        int id PK
        int thesis_id FK
        string file_name
        string file_type
        bigint file_size
        text file_url
        int upload_order
        timestamp uploaded_at
        int uploaded_by FK
    }
    
    %% ============================================
    %% DOWNLOAD PERMISSION SYSTEM
    %% ============================================
    
    download_permissions {
        int id PK
        int thesis_id FK "UNIQUE(thesis_id, author_id)"
        int author_id FK "UNIQUE(thesis_id, author_id)"
        enum permission_status "pending|granted|denied"
        timestamp requested_at
        timestamp responded_at
        text notes
    }
    
    %% ============================================
    %% REVIEWS & FEEDBACK
    %% ============================================
    
    thesis_reviews {
        int id PK
        int thesis_id FK
        int reviewer_id FK
        enum review_type "supervisor_review|peer_review|admin_review"
        int rating "1-5"
        text comments
        enum status "pending|approved|rejected|revision_required"
        timestamp created_at
        timestamp updated_at
    }
    
    thesis_comments ||--o{ thesis_comments : "has replies"
    
    thesis_comments {
        int id PK
        int thesis_id FK
        int user_id FK
        int parent_comment_id FK "nullable for replies"
        text comment "NOT NULL"
        boolean is_public
        timestamp created_at
        timestamp updated_at
    }
    
    %% ============================================
    %% NOTIFICATIONS
    %% ============================================
    
    notifications {
        int id PK
        int user_id FK
        enum type "thesis_submitted|download_permission_requested|etc"
        string title
        text message
        int related_thesis_id FK
        int related_user_id FK
        boolean is_read
        text action_url
        timestamp created_at
    }
    
    %% ============================================
    %% ANALYTICS
    %% ============================================
    
    activity_logs {
        int id PK
        int user_id FK
        string action_type
        string entity_type
        int entity_id
        text description
        string ip_address
        text user_agent
        timestamp created_at
    }
    
    thesis_views {
        int id PK
        int thesis_id FK
        int viewer_id FK
        string ip_address
        timestamp viewed_at
    }
    
    thesis_downloads {
        int id PK
        int thesis_id FK
        int downloader_id FK
        int file_id FK
        string ip_address
        timestamp downloaded_at
    }
    
    %% ============================================
    %% COLLABORATION (Future)
    %% ============================================
    
    workspaces ||--o{ workspace_members : "has members"
    workspaces ||--o| theses : "submitted as"
    
    workspaces {
        int id PK
        string title
        text description
        int creator_id FK
        enum status "active|archived|submitted"
        int submitted_as_thesis_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    workspace_members {
        int id PK
        int workspace_id FK
        int user_id FK
        enum role "owner|editor|viewer"
        timestamp joined_at
    }
\`\`\`

## Key Relationships

### Download Permission System
- **One thesis** can have **many download_permissions** (one per author)
- **One author** can grant/deny permission for **many theses** they co-authored
- A thesis becomes **downloadable if ANY author grants permission**
- Permission status: `pending` → `granted` or `denied`

### Co-Authorship
- **Many-to-many** relationship between `users` and `theses` through `thesis_authors`
- Each author has an `author_order` to maintain sequence
- Roles: `primary_author` or `co_author`
- Multiple authors can collaborate on one thesis

### Supervision
- **One supervisor** can oversee **many theses** (one-to-many)
- Each thesis has exactly one supervisor

### Reviews & Feedback
- **One thesis** can have **many reviews** from different reviewers
- **One thesis** can have **many comments** (threaded via `parent_comment_id`)
- Review types: supervisor, peer, or admin review

### Analytics
- Views and downloads are tracked separately with timestamps
- Activity logs capture all user actions for audit trail
- Triggers automatically increment view/download counters

## Download Permission Workflow

1. User requests to download a thesis
2. System checks `download_permissions` table
3. If **any author** has `permission_status = 'granted'`, download is allowed
4. If all permissions are `pending` or `denied`, download is blocked
5. Authors are notified via `notifications` table
6. Download is logged in `thesis_downloads` table

This design ensures proper access control while allowing collaborative decision-making among co-authors.
