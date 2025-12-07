# System Workflows - Complete User Journeys

## 1. Student Thesis Submission Workflow

\`\`\`mermaid
graph TD
    Start([Student Logs In]) --> CreateWorkspace[Create Workspace/Project]
    CreateWorkspace --> AddCoAuthors[Invite Co-Authors]
    AddCoAuthors --> CollaborateWork[Collaborate on Research]
    CollaborateWork --> UploadDraft[Upload Draft Files]
    UploadDraft --> RequestSupervisor[Request Supervisor Assignment]
    
    RequestSupervisor --> WaitApproval{Supervisor<br/>Accepts?}
    WaitApproval -->|No| RequestSupervisor
    WaitApproval -->|Yes| SupervisorAssigned[Supervisor Assigned]
    
    SupervisorAssigned --> FinalizeThesis[Finalize Thesis Content]
    FinalizeThesis --> SubmitThesis[Submit for Review]
    
    SubmitThesis --> SupervisorReview{Supervisor<br/>Review}
    SupervisorReview -->|Revisions Required| ReviseThesis[Make Revisions]
    ReviseThesis --> SubmitThesis
    SupervisorReview -->|Approved| AdminReview{Admin<br/>Review}
    
    AdminReview -->|Rejected| ReviseThesis
    AdminReview -->|Approved| PublishThesis[Publish to Repository]
    
    PublishThesis --> SetPermissions[Set Download Permissions]
    SetPermissions --> NotifyCoAuthors[Notify All Co-Authors]
    NotifyCoAuthors --> End([Thesis Published])
    
    style Start fill:#4CAF50
    style End fill:#2196F3
    style PublishThesis fill:#FF9800
    style SetPermissions fill:#9C27B0
\`\`\`

## 2. Download Permission Workflow

\`\`\`mermaid
graph TD
    UserView([User Views Thesis]) --> CheckPermission{Download<br/>Permission<br/>Exists?}
    
    CheckPermission -->|Any author granted| DirectDownload[Download Immediately]
    DirectDownload --> LogDownload[Log Download Event]
    LogDownload --> DownloadComplete([Download Complete])
    
    CheckPermission -->|No permission| RequestAccess[Request Download Permission]
    RequestAccess --> NotifyAuthors[Notify ALL Authors]
    
    NotifyAuthors --> Author1Response{Author 1<br/>Response}
    NotifyAuthors --> Author2Response{Author 2<br/>Response}
    NotifyAuthors --> AuthorNResponse{Author N<br/>Response}
    
    Author1Response -->|Grant| PermissionGranted[Permission Granted]
    Author2Response -->|Grant| PermissionGranted
    AuthorNResponse -->|Grant| PermissionGranted
    
    Author1Response -->|Deny| CheckOthers{Any Other<br/>Author<br/>Granted?}
    Author2Response -->|Deny| CheckOthers
    AuthorNResponse -->|Deny| CheckOthers
    
    CheckOthers -->|Yes| PermissionGranted
    CheckOthers -->|No| WaitMoreResponses{All Authors<br/>Responded?}
    
    WaitMoreResponses -->|No| Waiting[Waiting for Responses]
    WaitMoreResponses -->|Yes - All Denied| AccessDenied[Access Denied]
    
    PermissionGranted --> NotifyUser[Notify Requesting User]
    NotifyUser --> DirectDownload
    
    AccessDenied --> NotifyUserDenied[Notify User - Denied]
    NotifyUserDenied --> End([Request Complete])
    
    style UserView fill:#4CAF50
    style PermissionGranted fill:#2196F3
    style AccessDenied fill:#F44336
    style DirectDownload fill:#FF9800
\`\`\`

## 3. Supervisor Workflow

\`\`\`mermaid
graph TD
    SupervisorLogin([Supervisor Logs In]) --> ViewDashboard[View Dashboard]
    ViewDashboard --> CheckRequests{New<br/>Requests?}
    
    CheckRequests -->|Yes| ReviewRequest[Review Supervision Request]
    ReviewRequest --> AcceptDecline{Accept or<br/>Decline?}
    AcceptDecline -->|Accept| AssignAsSuper[Assigned as Supervisor]
    AcceptDecline -->|Decline| NotifyStudent[Notify Student]
    NotifyStudent --> ViewDashboard
    
    CheckRequests -->|No| ViewSupervised[View Supervised Theses]
    AssignAsSuper --> ViewSupervised
    
    ViewSupervised --> SelectThesis[Select Thesis to Review]
    SelectThesis --> ReviewThesis[Review Thesis Content]
    ReviewThesis --> ProvideEeedback[Provide Feedback/Comments]
    ProvideEeedback --> MakeDecision{Decision}
    
    MakeDecision -->|Approve| ApproveThesis[Approve for Publication]
    MakeDecision -->|Revisions| RequestRevisions[Request Revisions]
    MakeDecision -->|Reject| RejectThesis[Reject Submission]
    
    ApproveThesis --> ToAdmin[Forward to Admin Review]
    RequestRevisions --> NotifyStudentRevise[Notify Student]
    RejectThesis --> NotifyStudentReject[Notify Student]
    
    ToAdmin --> End([Complete])
    NotifyStudentRevise --> End
    NotifyStudentReject --> End
    
    style SupervisorLogin fill:#4CAF50
    style ApproveThesis fill:#2196F3
    style RejectThesis fill:#F44336
\`\`\`

## 4. Admin Workflow

\`\`\`mermaid
graph TD
    AdminLogin([Admin Logs In]) --> ViewAdmin[Admin Dashboard]
    ViewAdmin --> SelectTask{Select Task}
    
    SelectTask -->|User Management| ManageUsers[Manage Users]
    SelectTask -->|Review Requests| ReviewRequests[Review Registration]
    SelectTask -->|Thesis Review| ReviewTheses[Review Theses]
    SelectTask -->|Analytics| ViewAnalytics[View Analytics]
    SelectTask -->|Settings| SystemSettings[System Settings]
    
    ManageUsers --> UserActions{Action}
    UserActions -->|Approve| ApproveUser[Approve New User]
    UserActions -->|Deactivate| DeactivateUser[Deactivate User]
    UserActions -->|Edit Role| EditRole[Edit User Role]
    
    ReviewRequests --> CheckRequest{Valid<br/>Request?}
    CheckRequest -->|Yes| ApproveRegistration[Approve Registration]
    CheckRequest -->|No| RejectRegistration[Reject Registration]
    
    ReviewTheses --> SelectThesisReview[Select Thesis]
    SelectThesisReview --> FinalReview{Final<br/>Decision}
    FinalReview -->|Approve| PublishToRepo[Publish to Repository]
    FinalReview -->|Reject| RejectThesisAdmin[Reject & Notify]
    
    ViewAnalytics --> GenerateReports[Generate Reports]
    GenerateReports --> ExportData[Export Data]
    
    SystemSettings --> ConfigureSystem[Configure System]
    ConfigureSystem --> SaveSettings[Save Settings]
    
    ApproveUser --> End([Complete])
    DeactivateUser --> End
    EditRole --> End
    ApproveRegistration --> End
    RejectRegistration --> End
    PublishToRepo --> End
    RejectThesisAdmin --> End
    ExportData --> End
    SaveSettings --> End
    
    style AdminLogin fill:#4CAF50
    style PublishToRepo fill:#2196F3
    style RejectThesisAdmin fill:#F44336
\`\`\`

## 5. Collaboration Workflow (Co-Authors)

\`\`\`mermaid
graph TD
    PrimaryAuthor([Primary Author]) --> CreateProject[Create Workspace]
    CreateProject --> InviteCoAuthors[Send Invitations to Co-Authors]
    
    InviteCoAuthors --> CoAuthor1[Co-Author 1 Invited]
    InviteCoAuthors --> CoAuthor2[Co-Author 2 Invited]
    InviteCoAuthors --> CoAuthorN[Co-Author N Invited]
    
    CoAuthor1 --> Accept1{Accept?}
    CoAuthor2 --> Accept2{Accept?}
    CoAuthorN --> AcceptN{Accept?}
    
    Accept1 -->|Yes| JoinWorkspace[Join Workspace]
    Accept2 -->|Yes| JoinWorkspace
    AcceptN -->|Yes| JoinWorkspace
    
    Accept1 -->|No| Declined
    Accept2 -->|No| Declined
    AcceptN -->|No| Declined
    
    JoinWorkspace --> CollabWork[Collaborate on Research]
    CollabWork --> Upload[Upload Content]
    CollabWork --> Comment[Add Comments]
    CollabWork --> Review[Review Changes]
    
    Upload --> TrackActivity[Activity Logged]
    Comment --> TrackActivity
    Review --> TrackActivity
    
    TrackActivity --> ReadySubmit{Ready to<br/>Submit?}
    ReadySubmit -->|No| CollabWork
    ReadySubmit -->|Yes| AllAgree{All Authors<br/>Agree?}
    
    AllAgree -->|No| Discuss[Discuss Changes]
    Discuss --> CollabWork
    AllAgree -->|Yes| SubmitTogether[Submit as Co-Authors]
    
    SubmitTogether --> ThesisSubmitted[Thesis Submitted]
    ThesisSubmitted --> SetIndividualPerms[Each Author Sets<br/>Download Permissions]
    SetIndividualPerms --> Complete([Collaboration Complete])
    
    Declined --> NotifyPrimary[Notify Primary Author]
    NotifyPrimary --> InviteReplacement[Invite Replacement]
    
    style PrimaryAuthor fill:#4CAF50
    style Complete fill:#2196F3
    style SubmitTogether fill:#FF9800
\`\`\`

## Workflow Summary

| Workflow | Key Actors | Duration | Critical Points |
|----------|------------|----------|-----------------|
| **Thesis Submission** | Student, Co-Authors, Supervisor, Admin | 2-4 weeks | Supervisor approval, Admin review |
| **Download Permission** | User, All Authors | 1-7 days | Any author can grant access |
| **Supervisor Review** | Supervisor, Students | 3-10 days | Feedback quality, revision cycles |
| **Admin Management** | Admin | Ongoing | User approvals, thesis publishing |
| **Collaboration** | Multiple Authors | Varies | Agreement among all co-authors |

All workflows include automatic notifications and activity logging for transparency and accountability.
