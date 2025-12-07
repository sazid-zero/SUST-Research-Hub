# Data Flow Diagram (DFD)

Level 0 and Level 1 DFDs following IEEE Std 1016 guidelines.

## Level 0: Context Diagram

\`\`\`mermaid
graph LR
    Student[Student]
    Supervisor[Supervisor]
    Admin[Administrator]
    Public[Public User]
    
    System[Thesis Repository System]
    
    DB[(Database)]
    Storage[(File Storage)]
    Email[Email System]

    Student -->|Registration, Thesis Submission| System
    System -->|Confirmation, Status| Student
    
    Supervisor -->|Reviews, Approvals| System
    System -->|Notifications, Reports| Supervisor
    
    Admin -->|User Management, Configuration| System
    System -->|Analytics, Reports| Admin
    
    Public -->|Browse, Search, Download| System
    System -->|Thesis Data, Files| Public
    
    System -->|Store Data| DB
    DB -->|Retrieve Data| System
    
    System -->|Upload Files| Storage
    Storage -->|Serve Files| System
    
    System -->|Send Notifications| Email
\`\`\`

## Level 1: Main Processes

\`\`\`mermaid
graph TB
    subgraph Inputs
        I1[User Credentials]
        I2[Thesis Data]
        I3[File Uploads]
        I4[Review Feedback]
        I5[Search Queries]
    end

    subgraph "Process 1: Authentication"
        P1[1.0 User Authentication]
        P1A[1.1 Verify Credentials]
        P1B[1.2 Generate Session]
        P1C[1.3 Manage Tokens]
    end

    subgraph "Process 2: Workspace Management"
        P2[2.0 Workspace Management]
        P2A[2.1 Create Workspace]
        P2B[2.2 Collaborate]
        P2C[2.3 Manage Files]
    end

    subgraph "Process 3: Thesis Processing"
        P3[3.0 Thesis Processing]
        P3A[3.1 Submit Thesis]
        P3B[3.2 Review Process]
        P3C[3.3 Publish Thesis]
    end

    subgraph "Process 4: Repository Access"
        P4[4.0 Repository Access]
        P4A[4.1 Search Theses]
        P4B[4.2 Browse Repository]
        P4C[4.3 Download Files]
    end

    subgraph "Process 5: Administration"
        P5[5.0 Administration]
        P5A[5.1 User Management]
        P5B[5.2 Analytics]
        P5C[5.3 System Config]
    end

    subgraph Data Stores
        D1[(Users DB)]
        D2[(Theses DB)]
        D3[(Workspaces DB)]
        D4[(Sessions DB)]
        D5[(Files Storage)]
    end

    subgraph Outputs
        O1[Session Token]
        O2[Workspace Created]
        O3[Thesis Published]
        O4[Search Results]
        O5[Analytics Reports]
    end

    I1 --> P1
    P1 --> P1A
    P1A --> P1B
    P1B --> P1C
    P1C --> D4
    P1C --> O1

    I2 --> P2
    I3 --> P2
    P2 --> P2A
    P2A --> P2B
    P2B --> P2C
    P2C --> D3
    P2C --> D5
    P2 --> O2

    P2 --> P3
    I4 --> P3
    P3 --> P3A
    P3A --> P3B
    P3B --> P3C
    P3C --> D2
    P3 --> O3

    I5 --> P4
    P4 --> P4A
    P4A --> P4B
    P4B --> P4C
    D2 --> P4
    D5 --> P4C
    P4 --> O4

    D1 --> P5
    D2 --> P5
    P5 --> P5A
    P5A --> P5B
    P5B --> P5C
    P5 --> O5

    style P1 fill:#e1f5ff
    style P2 fill:#ffe1f5
    style P3 fill:#f5ffe1
    style P4 fill:#fff5e1
    style P5 fill:#f5e1ff
\`\`\`

## Data Dictionary

| Data Flow | Description | Composition |
|-----------|-------------|-------------|
| User Credentials | Login information | email + password_hash |
| Thesis Data | Complete thesis information | title + abstract + keywords + files + authors |
| Session Token | Authentication token | JWT token with user_id + role + expiry |
| Search Queries | Repository search parameters | keywords + filters + pagination |
| Review Feedback | Supervisor evaluation | rating + comments + status |

## Process Specifications

### 1.0 User Authentication
**Input**: User Credentials  
**Output**: Session Token  
**Logic**: Verify email/password against database, generate JWT token, store session  
**Error Handling**: Invalid credentials return error, max 5 attempts before lockout

### 2.0 Workspace Management
**Input**: Thesis Data, File Uploads  
**Output**: Workspace Created  
**Logic**: Create workspace record, link collaborators, store files in blob storage  
**Error Handling**: Validate file types and sizes, limit 100MB per file

### 3.0 Thesis Processing
**Input**: Workspace Data, Review Feedback  
**Output**: Thesis Published  
**Logic**: Submit for review → supervisor approval → admin publishing  
**Error Handling**: Rejection returns to draft state with feedback
