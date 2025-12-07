-- ============================================================================
-- COMPLETE DATABASE SCHEMA FOR THESIS REPOSITORY SYSTEM
-- ============================================================================
-- This schema includes all tables, relationships, and constraints needed for:
-- - User management (Students, Supervisors, Admins)
-- - Authentication & Authorization
-- - Thesis management & Publishing
-- - Workspaces & Collaborations
-- - Submissions & Reviews
-- - Notifications & Messages
-- - Analytics & Activity Tracking
-- ============================================================================

-- Drop existing tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS workspace_comments CASCADE;
DROP TABLE IF EXISTS workspace_activity CASCADE;
DROP TABLE IF EXISTS workspace_files CASCADE;
DROP TABLE IF EXISTS workspace_invitations CASCADE;
DROP TABLE IF EXISTS workspace_members CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;
DROP TABLE IF EXISTS thesis_reviews CASCADE;
DROP TABLE IF EXISTS thesis_review_comments CASCADE;
DROP TABLE IF EXISTS thesis_files CASCADE;
DROP TABLE IF EXISTS thesis_authors CASCADE;
DROP TABLE IF EXISTS theses CASCADE;
DROP TABLE IF EXISTS supervisor_requests CASCADE;
DROP TABLE IF EXISTS email_verification_tokens CASCADE;
DROP TABLE IF EXISTS registration_requests CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- 1. USERS & AUTHENTICATION
-- ============================================================================

-- Main users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'supervisor', 'admin')),
    
    -- Student specific fields
    student_id VARCHAR(50) UNIQUE,
    department VARCHAR(255),
    year_of_study INTEGER,
    program VARCHAR(255),
    
    -- Supervisor specific fields
    specialization VARCHAR(255),
    bio TEXT,
    research_interests TEXT[],
    
    -- Profile fields (common)
    phone VARCHAR(50),
    avatar_url TEXT,
    
    -- Registration & approval
    is_approved BOOLEAN DEFAULT FALSE,
    approval_date TIMESTAMP,
    approved_by INTEGER REFERENCES users(id),
    
    -- Account status
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    
    -- Constraints
    CONSTRAINT student_id_required CHECK (
        (role = 'student' AND student_id IS NOT NULL) OR 
        (role != 'student')
    )
);

-- User profiles (extended information)
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Additional student fields
    gpa DECIMAL(3,2),
    expected_graduation DATE,
    
    -- Additional supervisor fields
    office_location VARCHAR(255),
    office_hours TEXT,
    max_students INTEGER DEFAULT 10,
    current_student_count INTEGER DEFAULT 0,
    
    -- Social links
    linkedin_url TEXT,
    google_scholar_url TEXT,
    researchgate_url TEXT,
    personal_website TEXT,
    
    -- Settings
    notification_preferences JSONB DEFAULT '{"email": true, "browser": true, "frequency": "immediate"}'::jsonb,
    privacy_settings JSONB DEFAULT '{"show_email": false, "show_phone": false}'::jsonb,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions for authentication
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registration requests (pending approvals)
CREATE TABLE registration_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    additional_info TEXT,
    rejection_reason TEXT,
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email verification tokens
CREATE TABLE email_verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. WORKSPACES & COLLABORATIONS (Projects before submission)
-- ============================================================================

-- Workspaces (pre-submission collaborative projects)
CREATE TABLE workspaces (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    abstract TEXT,
    department VARCHAR(200),
    field VARCHAR(200),
    keywords TEXT[] DEFAULT '{}',
    
    -- Status tracking
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft',                    -- Initial creation
        'draft_pending_team',       -- Waiting for team members
        'active_no_supervisor',     -- Active but no supervisor yet
        'pending_supervisor',       -- Supervisor request sent
        'in_progress',              -- Active with supervisor
        'ready_for_submission',     -- Ready to submit as thesis
        'submitted',                -- Converted to thesis submission
        'archived'                  -- Archived/cancelled
    )),
    
    -- Ownership & supervision
    created_by INTEGER NOT NULL REFERENCES users(id),
    supervisor_id INTEGER REFERENCES users(id),
    supervisor_assigned_at TIMESTAMP,
    
    -- Submission tracking
    submitted_as_thesis_id INTEGER,  -- Links to theses table after submission
    submitted_at TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workspace members (collaborators)
CREATE TABLE workspace_members (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('primary_author', 'co_author', 'contributor')),
    author_order INTEGER DEFAULT 1,
    invitation_status VARCHAR(50) NOT NULL DEFAULT 'accepted' CHECK (invitation_status IN ('pending', 'accepted', 'declined', 'removed')),
    invited_by INTEGER REFERENCES users(id),
    invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    permissions JSONB DEFAULT '{"can_edit": true, "can_invite": false, "can_delete": false}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workspace_id, user_id)
);

-- Workspace invitations (team collaboration invites)
CREATE TABLE workspace_invitations (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    invited_email VARCHAR(255) NOT NULL,
    invited_user_id INTEGER REFERENCES users(id),
    invited_by INTEGER NOT NULL REFERENCES users(id),
    role VARCHAR(50) NOT NULL,
    message TEXT,
    token VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    expires_at TIMESTAMP NOT NULL,
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workspace files (drafts, research materials)
CREATE TABLE workspace_files (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    uploaded_by INTEGER NOT NULL REFERENCES users(id),
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_url TEXT NOT NULL,
    file_category VARCHAR(50) CHECK (file_category IN ('draft', 'research_material', 'data', 'presentation', 'reference', 'other')),
    version INTEGER DEFAULT 1,
    description TEXT,
    is_latest BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workspace activity feed
CREATE TABLE workspace_activity (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    activity_type VARCHAR(100) NOT NULL CHECK (activity_type IN (
        'created', 'updated', 'member_added', 'member_removed', 
        'file_uploaded', 'file_deleted', 'comment_added', 
        'status_changed', 'supervisor_requested', 'supervisor_assigned',
        'submitted_for_review'
    )),
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workspace comments (team discussion)
CREATE TABLE workspace_comments (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    comment_text TEXT NOT NULL,
    parent_comment_id INTEGER REFERENCES workspace_comments(id),
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Supervisor requests (students requesting supervision)
CREATE TABLE supervisor_requests (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES users(id),
    supervisor_id INTEGER NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'withdrawn')),
    response_message TEXT,
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workspace_id, supervisor_id, status)
);

-- ============================================================================
-- 3. THESES & PUBLICATIONS (Final submitted & published work)
-- ============================================================================

-- Theses table (published repository)
CREATE TABLE theses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    abstract TEXT NOT NULL,
    department VARCHAR(200) NOT NULL,
    field VARCHAR(200),
    year INTEGER NOT NULL,
    keywords TEXT[] NOT NULL DEFAULT '{}',
    
    -- Origin tracking
    workspace_id INTEGER REFERENCES workspaces(id),  -- Links back to original workspace
    
    -- Submission & review
    submitted_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-review', 'approved', 'rejected', 'changes_requested')),
    
    -- Supervision
    supervisor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    -- Publication metrics
    views INTEGER NOT NULL DEFAULT 0,
    downloads INTEGER NOT NULL DEFAULT 0,
    
    -- Publication info
    published_at TIMESTAMP,
    doi VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thesis authors (co-authorship)
CREATE TABLE thesis_authors (
    id SERIAL PRIMARY KEY,
    thesis_id INTEGER NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    author_order INTEGER NOT NULL DEFAULT 1,
    role VARCHAR(50) NOT NULL DEFAULT 'co_author' CHECK (role IN ('primary_author', 'co_author')),
    contribution_statement TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(thesis_id, author_id)
);

-- Thesis files (final documents)
CREATE TABLE thesis_files (
    id SERIAL PRIMARY KEY,
    thesis_id INTEGER NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('pdf', 'presentation', 'video', 'audio', 'supplementary', 'dataset', 'code')),
    file_url TEXT NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thesis reviews (supervisor review process)
CREATE TABLE thesis_reviews (
    id SERIAL PRIMARY KEY,
    thesis_id INTEGER NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
    reviewer_id INTEGER NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected', 'changes_requested')),
    overall_comment TEXT,
    decision VARCHAR(50) CHECK (decision IN ('approve', 'reject', 'request_changes')),
    decided_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thesis review comments (detailed feedback)
CREATE TABLE thesis_review_comments (
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL REFERENCES thesis_reviews(id) ON DELETE CASCADE,
    section VARCHAR(100),  -- e.g., 'introduction', 'methodology', 'results'
    comment_text TEXT NOT NULL,
    comment_type VARCHAR(50) CHECK (comment_type IN ('strength', 'weakness', 'suggestion', 'question', 'required_change')),
    line_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. COMMUNICATION & NOTIFICATIONS
-- ============================================================================

-- Messages (direct messaging between users)
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    recipient_id INTEGER NOT NULL REFERENCES users(id),
    subject VARCHAR(255),
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    parent_message_id INTEGER REFERENCES messages(id),  -- For threading
    related_workspace_id INTEGER REFERENCES workspaces(id),
    related_thesis_id INTEGER REFERENCES theses(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL CHECK (type IN (
        'thesis_submitted', 'thesis_approved', 'thesis_rejected', 'changes_requested',
        'review_assigned', 'comment_added', 'mention',
        'workspace_invitation', 'member_joined', 'supervisor_request',
        'supervisor_accepted', 'supervisor_declined',
        'message_received', 'file_uploaded',
        'system_update', 'announcement'
    )),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Links to related entities
    related_user_id INTEGER REFERENCES users(id),
    related_workspace_id INTEGER REFERENCES workspaces(id),
    related_thesis_id INTEGER REFERENCES theses(id),
    related_review_id INTEGER REFERENCES thesis_reviews(id),
    
    -- Action link
    action_url TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 5. SYSTEM & ANALYTICS
-- ============================================================================

-- Activity logs (system-wide audit trail)
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),  -- 'user', 'workspace', 'thesis', 'review', etc.
    entity_id INTEGER,
    description TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_is_approved ON users(is_approved);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Sessions indexes
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Workspaces indexes
CREATE INDEX idx_workspaces_created_by ON workspaces(created_by);
CREATE INDEX idx_workspaces_supervisor_id ON workspaces(supervisor_id);
CREATE INDEX idx_workspaces_status ON workspaces(status);
CREATE INDEX idx_workspaces_department ON workspaces(department);
CREATE INDEX idx_workspaces_created_at ON workspaces(created_at);

-- Workspace members indexes
CREATE INDEX idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_invitation_status ON workspace_members(invitation_status);

-- Theses indexes
CREATE INDEX idx_theses_status ON theses(status);
CREATE INDEX idx_theses_department ON theses(department);
CREATE INDEX idx_theses_field ON theses(field);
CREATE INDEX idx_theses_year ON theses(year);
CREATE INDEX idx_theses_supervisor_id ON theses(supervisor_id);
CREATE INDEX idx_theses_workspace_id ON theses(workspace_id);
CREATE INDEX idx_theses_published_at ON theses(published_at);
CREATE INDEX idx_theses_keywords ON theses USING GIN(keywords);

-- Thesis authors indexes
CREATE INDEX idx_thesis_authors_thesis_id ON thesis_authors(thesis_id);
CREATE INDEX idx_thesis_authors_author_id ON thesis_authors(author_id);
CREATE INDEX idx_thesis_authors_order ON thesis_authors(thesis_id, author_order);

-- Thesis files indexes
CREATE INDEX idx_thesis_files_thesis_id ON thesis_files(thesis_id);
CREATE INDEX idx_thesis_files_file_type ON thesis_files(file_type);

-- Reviews indexes
CREATE INDEX idx_thesis_reviews_thesis_id ON thesis_reviews(thesis_id);
CREATE INDEX idx_thesis_reviews_reviewer_id ON thesis_reviews(reviewer_id);
CREATE INDEX idx_thesis_reviews_status ON thesis_reviews(status);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Messages indexes
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Activity indexes
CREATE INDEX idx_workspace_activity_workspace_id ON workspace_activity(workspace_id);
CREATE INDEX idx_workspace_activity_user_id ON workspace_activity(user_id);
CREATE INDEX idx_workspace_activity_created_at ON workspace_activity(created_at);

-- Composite indexes for common queries
CREATE INDEX idx_theses_status_department ON theses(status, department);
CREATE INDEX idx_theses_status_year ON theses(status, year);
CREATE INDEX idx_workspaces_created_by_status ON workspaces(created_by, status);
CREATE INDEX idx_workspace_members_user_status ON workspace_members(user_id, invitation_status);

-- ============================================================================
-- 7. TRIGGERS FOR AUTO-UPDATES
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_theses_updated_at BEFORE UPDATE ON theses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_thesis_reviews_updated_at BEFORE UPDATE ON thesis_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Complete thesis information with authors and supervisor
CREATE OR REPLACE VIEW v_theses_complete AS
SELECT 
    t.*,
    u.full_name as supervisor_name,
    u.email as supervisor_email,
    json_agg(
        json_build_object(
            'id', ta.id,
            'author_id', ta.author_id,
            'full_name', ua.full_name,
            'student_id', ua.student_id,
            'email', ua.email,
            'author_order', ta.author_order,
            'role', ta.role
        ) ORDER BY ta.author_order
    ) as authors,
    (SELECT COUNT(*) FROM thesis_files WHERE thesis_id = t.id) as file_count
FROM theses t
LEFT JOIN users u ON t.supervisor_id = u.id
LEFT JOIN thesis_authors ta ON t.id = ta.thesis_id
LEFT JOIN users ua ON ta.author_id = ua.id
GROUP BY t.id, u.full_name, u.email;

-- View: Workspace with members and status
CREATE OR REPLACE VIEW v_workspaces_complete AS
SELECT 
    w.*,
    u.full_name as creator_name,
    us.full_name as supervisor_name,
    json_agg(
        DISTINCT json_build_object(
            'user_id', wm.user_id,
            'full_name', um.full_name,
            'email', um.email,
            'role', wm.role,
            'author_order', wm.author_order,
            'invitation_status', wm.invitation_status
        )
    ) FILTER (WHERE wm.user_id IS NOT NULL) as members,
    (SELECT COUNT(*) FROM workspace_files WHERE workspace_id = w.id) as file_count,
    (SELECT COUNT(*) FROM workspace_comments WHERE workspace_id = w.id) as comment_count
FROM workspaces w
LEFT JOIN users u ON w.created_by = u.id
LEFT JOIN users us ON w.supervisor_id = us.id
LEFT JOIN workspace_members wm ON w.id = wm.workspace_id
LEFT JOIN users um ON wm.user_id = um.id
GROUP BY w.id, u.full_name, us.full_name;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Insert initial admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, role, is_approved, is_email_verified, is_active)
VALUES ('admin@sust.edu', '$2a$10$rQZ4JK5h5h5h5h5h5h5h5eMxN5h5h5h5h5h5h5h5h5h5h5h5h5h5h', 'System Administrator', 'admin', TRUE, TRUE, TRUE)
ON CONFLICT (email) DO NOTHING;
