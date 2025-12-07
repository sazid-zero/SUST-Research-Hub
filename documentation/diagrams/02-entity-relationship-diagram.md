# Entity Relationship Diagram (ERD)

Database schema following ISO/IEC 11179 standards for metadata registry.

\`\`\`mermaid
erDiagram
    USERS ||--o{ SESSIONS : has
    USERS ||--o{ THESES : supervises
    USERS ||--o{ WORKSPACES : creates
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ MESSAGES : sends
    USERS ||--o{ ACTIVITY_LOGS : generates
    
    THESES ||--o{ THESIS_AUTHORS : has
    THESES ||--o{ THESIS_FILES : contains
    THESES ||--o{ THESIS_REVIEWS : receives
    THESES ||--o{ THESIS_VIEWS : tracked_by
    THESES }o--|| WORKSPACES : published_from
    THESES }o--|| USERS : supervised_by
    
    THESIS_AUTHORS }o--|| USERS : authored_by
    THESIS_FILES ||--o{ FILE_VERSIONS : has
    THESIS_REVIEWS ||--o{ REVIEW_COMMENTS : contains
    THESIS_REVIEWS }o--|| USERS : reviewed_by
    
    WORKSPACES ||--o{ WORKSPACE_MEMBERS : has
    WORKSPACES ||--o{ WORKSPACE_FILES : contains
    WORKSPACES ||--o{ WORKSPACE_COMMENTS : has
    WORKSPACES ||--o{ WORKSPACE_INVITATIONS : sends
    WORKSPACES }o--|| USERS : supervised_by_request
    
    WORKSPACE_MEMBERS }o--|| USERS : is
    WORKSPACE_INVITATIONS }o--|| USERS : invited
    WORKSPACE_COMMENTS }o--|| USERS : written_by
    
    MESSAGES }o--|| USERS : sent_to
    NOTIFICATIONS }o--|| USERS : for_user

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string full_name
        string student_id UK
        enum role
        string department
        string profile_picture
        timestamp created_at
        timestamp updated_at
    }

    SESSIONS {
        uuid id PK
        uuid user_id FK
        string session_token UK
        timestamp expires_at
        timestamp created_at
    }

    THESES {
        uuid id PK
        string title
        text abstract
        uuid supervisor_id FK
        string department
        string field
        text keywords
        enum status
        integer year
        integer views
        integer downloads
        uuid workspace_id FK
        timestamp submitted_date
        timestamp published_date
        timestamp created_at
        timestamp updated_at
    }

    THESIS_AUTHORS {
        uuid id PK
        uuid thesis_id FK
        uuid author_id FK
        integer author_order
        timestamp created_at
    }

    THESIS_FILES {
        uuid id PK
        uuid thesis_id FK
        string filename
        string file_type
        integer file_size
        string storage_url
        integer version
        timestamp uploaded_at
    }

    THESIS_REVIEWS {
        uuid id PK
        uuid thesis_id FK
        uuid reviewer_id FK
        enum status
        integer rating
        text feedback
        timestamp reviewed_at
        timestamp created_at
    }

    WORKSPACES {
        uuid id PK
        string title
        text description
        uuid creator_id FK
        uuid supervisor_id FK
        enum status
        timestamp created_at
        timestamp updated_at
    }

    WORKSPACE_MEMBERS {
        uuid id PK
        uuid workspace_id FK
        uuid user_id FK
        enum role
        timestamp joined_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        enum type
        string title
        text message
        json metadata
        boolean is_read
        timestamp created_at
    }

    MESSAGES {
        uuid id PK
        uuid sender_id FK
        uuid recipient_id FK
        text content
        boolean is_read
        timestamp sent_at
    }

    ACTIVITY_LOGS {
        uuid id PK
        uuid user_id FK
        string action
        string entity_type
        uuid entity_id
        json metadata
        timestamp created_at
    }
\`\`\`

## Key Relationships

1. **Users → Theses**: One-to-many (supervisor relationship)
2. **Theses → Thesis_Authors**: Many-to-many (co-authorship)
3. **Workspaces → Theses**: One-to-one (workspace becomes published thesis)
4. **Users → Workspaces**: Many-to-many through workspace_members (collaboration)
5. **Theses → Thesis_Reviews**: One-to-many (review process)

## Referential Integrity

- All foreign keys enforce CASCADE on delete where appropriate
- Composite unique constraints on (thesis_id, author_id) and (workspace_id, user_id)
- Check constraints on enums and positive integers
