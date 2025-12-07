# Use Case Diagram

System functionality from user perspectives following ISO/IEC 19501 (UML) standards.

\`\`\`mermaid
graph TB
    subgraph "Student Use Cases"
        S1[Register Account]
        S2[Login to System]
        S3[Create Workspace]
        S4[Invite Collaborators]
        S5[Upload Draft Files]
        S6[Request Supervisor]
        S7[Submit Thesis]
        S8[View Submission Status]
        S9[Download Published Theses]
    end

    subgraph "Supervisor Use Cases"
        SU1[Review Workspace Requests]
        SU2[Provide Feedback]
        SU3[Review Submitted Theses]
        SU4[Approve/Reject Thesis]
        SU5[Track Student Progress]
        SU6[Manage Supervised Theses]
    end

    subgraph "Admin Use Cases"
        A1[Manage Users]
        A2[Approve Registrations]
        A3[Publish Theses]
        A4[Manage Departments]
        A5[View Analytics]
        A6[Generate Reports]
        A7[System Configuration]
    end

    subgraph "Public User Use Cases"
        P1[Browse Theses Repository]
        P2[Search Theses]
        P3[Filter by Field/Department]
        P4[View Thesis Details]
        P5[Download Thesis Files]
    end

    Student((Student)) --> S1
    Student --> S2
    Student --> S3
    Student --> S4
    Student --> S5
    Student --> S6
    Student --> S7
    Student --> S8
    Student --> S9

    Supervisor((Supervisor)) --> S2
    Supervisor --> SU1
    Supervisor --> SU2
    Supervisor --> SU3
    Supervisor --> SU4
    Supervisor --> SU5
    Supervisor --> SU6

    Admin((Administrator)) --> S2
    Admin --> A1
    Admin --> A2
    Admin --> A3
    Admin --> A4
    Admin --> A5
    Admin --> A6
    Admin --> A7

    Public((Public User)) --> P1
    Public --> P2
    Public --> P3
    Public --> P4
    Public --> P5

    S7 -.includes.-> S5
    S7 -.requires.-> S6
    SU3 -.extends.-> SU4
    A3 -.requires.-> SU4

    style Student fill:#e1f5ff
    style Supervisor fill:#ffe1f5
    style Admin fill:#f5ffe1
    style Public fill:#f5f5f5
\`\`\`

## Use Case Descriptions

### Student Actor

| Use Case | Description | Preconditions |
|----------|-------------|---------------|
| Register Account | Student creates new account with email and student ID | None |
| Create Workspace | Start new thesis project workspace | Authenticated |
| Invite Collaborators | Add co-authors to workspace | Workspace exists |
| Submit Thesis | Submit workspace for review | Supervisor assigned |

### Supervisor Actor

| Use Case | Description | Preconditions |
|----------|-------------|---------------|
| Review Workspace Requests | Accept/decline supervision requests | Authenticated as supervisor |
| Review Submitted Theses | Evaluate thesis for approval | Thesis submitted |
| Approve/Reject Thesis | Make final decision on submission | Review completed |

### Administrator Actor

| Use Case | Description | Preconditions |
|----------|-------------|---------------|
| Approve Registrations | Verify and approve new user accounts | Pending registrations exist |
| Publish Theses | Make approved theses publicly available | Thesis approved by supervisor |
| View Analytics | Monitor system usage and metrics | Authenticated as admin |
