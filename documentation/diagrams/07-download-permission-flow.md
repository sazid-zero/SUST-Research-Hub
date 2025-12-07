# Download Permission Workflow

This sequence diagram shows the complete download permission workflow where any author can grant permission for thesis downloads.

\`\`\`mermaid
sequenceDiagram
    actor User
    participant UI as Frontend
    participant API as Backend API
    participant DB as Database
    participant Auth as Auth Service
    participant Notify as Notification Service
    
    User->>UI: Click "Download Thesis"
    UI->>API: GET /api/thesis/{id}/download-permission
    API->>DB: Check download_permissions table
    
    alt Any author has granted permission
        DB-->>API: permission_status = 'granted' found
        API-->>UI: { allowed: true }
        UI->>API: GET /api/thesis/{id}/download
        API->>DB: INSERT into thesis_downloads
        API->>DB: Increment downloads count
        DB-->>API: Download URL
        API-->>UI: File download starts
        UI-->>User: File downloaded successfully
    else No permissions granted
        DB-->>API: No 'granted' permissions
        API-->>UI: { allowed: false, reason: "Permission required" }
        UI->>User: Show "Request Download Permission"
        
        User->>UI: Click "Request Permission"
        UI->>API: POST /api/thesis/{id}/request-permission
        API->>Auth: Verify user authentication
        Auth-->>API: User verified
        
        API->>DB: Query thesis_authors for all authors
        DB-->>API: List of author_ids
        
        loop For each author
            API->>DB: INSERT/UPDATE download_permissions<br/>(thesis_id, author_id, status='pending')
            API->>Notify: Create notification for author
            Notify->>DB: INSERT into notifications<br/>(type='download_permission_requested')
        end
        
        API-->>UI: Request sent to all authors
        UI-->>User: "Permission request sent to authors"
    end
    
    Note over User,Notify: Author receives notification and responds
    
    actor Author
    participant AuthorUI as Author Dashboard
    
    Notify->>Author: Email/Push: "Download permission requested"
    Author->>AuthorUI: Open notifications
    AuthorUI->>API: GET /api/notifications
    API->>DB: SELECT notifications<br/>WHERE user_id = author_id
    DB-->>API: Pending permission requests
    API-->>AuthorUI: Display permission requests
    
    AuthorUI->>Author: Show thesis details and requester
    Author->>AuthorUI: Click "Grant Permission" or "Deny"
    
    alt Author grants permission
        AuthorUI->>API: POST /api/permissions/{id}/grant
        API->>DB: UPDATE download_permissions<br/>SET permission_status = 'granted'<br/>WHERE thesis_id AND author_id
        DB-->>API: Permission granted
        
        API->>Notify: Notify original requester
        Notify->>DB: INSERT notification<br/>(type='download_permission_granted')
        
        API->>Notify: Notify other authors (FYI)
        
        API-->>AuthorUI: Success
        AuthorUI-->>Author: "Permission granted"
        
        Note over User: User can now download immediately<br/>(Any ONE author granting is sufficient)
        
    else Author denies permission
        AuthorUI->>API: POST /api/permissions/{id}/deny
        API->>DB: UPDATE download_permissions<br/>SET permission_status = 'denied'<br/>WHERE thesis_id AND author_id
        DB-->>API: Permission denied
        
        API->>DB: Check if other authors granted
        
        alt Other author already granted
            DB-->>API: Another author has 'granted' status
            API->>Notify: Notify requester<br/>"Download still available<br/>(other author granted)"
        else No other grants
            DB-->>API: No 'granted' permissions exist
            API->>Notify: Notify requester<br/>"Permission denied by author"
        end
        
        API-->>AuthorUI: Success
        AuthorUI-->>Author: "Permission denied"
    end
    
    Note over DB: Permission Logic:<br/>Download allowed if<br/>ANY author has granted permission
\`\`\`

## Permission States

\`\`\`mermaid
stateDiagram-v2
    [*] --> NoPermissionRecord: Thesis published
    NoPermissionRecord --> PendingAll: User requests download
    PendingAll --> PartialGrant: Any author grants
    PendingAll --> PartialDeny: Any author denies
    PartialGrant --> [*]: Download allowed ✓
    PartialDeny --> PartialGrant: Another author grants
    PartialDeny --> AllDenied: All authors deny
    AllDenied --> PendingAll: New request
    
    note right of PartialGrant
        Download is ALLOWED
        if ANY author grants
        (even if others deny)
    end note
    
    note right of AllDenied
        Download is BLOCKED
        only if ALL authors deny
        and NONE grant
    end note
\`\`\`

## Database Query Logic

\`\`\`sql
-- Check if thesis is downloadable
SELECT 
    t.id,
    t.title,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM download_permissions dp 
            WHERE dp.thesis_id = t.id 
            AND dp.permission_status = 'granted'
        ) THEN true
        ELSE false
    END as is_downloadable,
    json_agg(
        json_build_object(
            'author_id', dp.author_id,
            'author_name', u.full_name,
            'status', dp.permission_status,
            'responded_at', dp.responded_at
        )
    ) as permission_details
FROM theses t
LEFT JOIN download_permissions dp ON t.id = dp.thesis_id
LEFT JOIN users u ON dp.author_id = u.id
WHERE t.id = :thesis_id
GROUP BY t.id;
\`\`\`

## Key Features

1. **Democratic Access**: Any single author can grant download permission
2. **Transparent**: All authors see who granted/denied
3. **Auditable**: All permission changes are logged
4. **Notification-Driven**: Authors are notified immediately
5. **Flexible**: Authors can change their decision
6. **Fair**: Respects intellectual property while enabling access
