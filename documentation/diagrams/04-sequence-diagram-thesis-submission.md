# Sequence Diagram: Thesis Submission Workflow

This diagram shows the complete thesis submission process following ISO/IEC 19501 standards.

\`\`\`mermaid
sequenceDiagram
    actor Student
    participant UI as Web Interface
    participant Auth as Authentication Service
    participant WS as Workspace Service
    participant TS as Thesis Service
    participant NS as Notification Service
    participant DB as Database
    participant Storage as File Storage

    Note over Student,Storage: Phase 1: Workspace Creation

    Student->>UI: Create New Workspace
    UI->>Auth: Verify Session
    Auth->>DB: Check User Token
    DB-->>Auth: User Authenticated
    Auth-->>UI: Authorized
    UI->>WS: Create Workspace
    WS->>DB: INSERT INTO workspaces
    DB-->>WS: Workspace Created (ID: W123)
    WS-->>UI: Success
    UI-->>Student: Workspace Created

    Note over Student,Storage: Phase 2: Collaboration

    Student->>UI: Invite Co-Author
    UI->>WS: Send Invitation
    WS->>DB: INSERT INTO workspace_invitations
    WS->>NS: Create Notification
    NS->>DB: INSERT INTO notifications
    DB-->>NS: Notification Sent
    NS-->>WS: Success
    WS-->>Student: Invitation Sent

    Note over Student,Storage: Phase 3: File Upload

    Student->>UI: Upload Draft Files
    UI->>Storage: Upload to Blob Storage
    Storage-->>UI: File URL
    UI->>WS: Save File Metadata
    WS->>DB: INSERT INTO workspace_files
    DB-->>WS: Success
    WS-->>Student: Files Uploaded

    Note over Student,Storage: Phase 4: Supervisor Request

    Student->>UI: Request Supervisor
    UI->>WS: Update Workspace
    WS->>DB: UPDATE workspaces SET supervisor_id
    WS->>NS: Notify Supervisor
    NS->>DB: INSERT INTO notifications
    DB-->>NS: Notification Created
    NS-->>WS: Supervisor Notified
    WS-->>Student: Request Sent

    Note over Student,Storage: Phase 5: Submission

    Student->>UI: Submit for Review
    UI->>TS: Create Thesis Submission
    TS->>DB: INSERT INTO theses
    DB-->>TS: Thesis Created (ID: T456)
    TS->>DB: INSERT INTO thesis_authors
    TS->>DB: INSERT INTO thesis_files
    TS->>NS: Notify Supervisor
    NS->>DB: INSERT INTO notifications
    TS-->>Student: Thesis Submitted

    Note over Student,Storage: Phase 6: Review & Approval

    Student->>UI: Check Status
    UI->>TS: Get Thesis Status
    TS->>DB: SELECT FROM theses WHERE id=T456
    DB-->>TS: Status: "pending"
    TS-->>UI: Pending Review
    UI-->>Student: Show Status
\`\`\`

## Workflow States

| State | Description | Next States |
|-------|-------------|-------------|
| workspace_created | Initial workspace created | draft |
| draft | Work in progress | submitted |
| submitted | Sent for supervisor review | under_review, revision_requested |
| under_review | Being evaluated by supervisor | approved, rejected, revision_requested |
| revision_requested | Changes needed | submitted |
| approved | Supervisor approved | published |
| rejected | Not approved | archived |
| published | Public in repository | - |

## Business Rules

1. Workspace must have at least 1 file before submission
2. Supervisor must be assigned before submission
3. Only supervisor can approve/reject thesis
4. Only admin can publish approved thesis
5. Students receive notifications at each state change
