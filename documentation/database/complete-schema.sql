-- =====================================================
-- THESIS REPOSITORY - COMPLETE DATABASE SCHEMA
-- For Documentation & ER Diagram Generation
-- =====================================================

-- =====================================================
-- 1. CORE USER MANAGEMENT
-- =====================================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'supervisor', 'admin')),
    department VARCHAR(255),
    profile_picture TEXT,
    bio TEXT,
    research_interests TEXT[],
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT
);

CREATE TABLE registration_requests (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    student_id VARCHAR(50),
    department VARCHAR(255),
    requested_role VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by INTEGER REFERENCES users(id),
    reason TEXT
);

CREATE TABLE email_verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used BOOLEAN DEFAULT false
);

-- =====================================================
-- 2. THESIS MANAGEMENT
-- =====================================================

CREATE TABLE theses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    abstract TEXT NOT NULL,
    department VARCHAR(255) NOT NULL,
    field VARCHAR(255) NOT NULL,
    keywords TEXT[] NOT NULL,
    year INTEGER NOT NULL,
    supervisor_id INTEGER NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'published')),
    submitted_date TIMESTAMP,
    approved_date TIMESTAMP,
    published_date TIMESTAMP,
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE thesis_authors (
    id SERIAL PRIMARY KEY,
    thesis_id INTEGER NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    author_order INTEGER NOT NULL,
    role VARCHAR(50) DEFAULT 'author' CHECK (role IN ('primary_author', 'co_author')),
    contribution_percentage INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(thesis_id, author_id),
    UNIQUE(thesis_id, author_order)
);

CREATE TABLE thesis_files (
    id SERIAL PRIMARY KEY,
    thesis_id INTEGER NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    file_url TEXT NOT NULL,
    upload_order INTEGER DEFAULT 1,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INTEGER REFERENCES users(id)
);

-- =====================================================
-- 3. DOWNLOAD PERMISSION SYSTEM
-- =====================================================

CREATE TABLE download_permissions (
    id SERIAL PRIMARY KEY,
    thesis_id INTEGER NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_status VARCHAR(20) DEFAULT 'pending' CHECK (permission_status IN ('pending', 'granted', 'denied')),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    notes TEXT,
    UNIQUE(thesis_id, author_id)
);

-- View to check if thesis is downloadable (ANY author has granted permission)
CREATE VIEW downloadable_theses AS
SELECT DISTINCT
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
    COUNT(CASE WHEN dp.permission_status = 'granted' THEN 1 END) as authors_granted,
    COUNT(CASE WHEN dp.permission_status = 'denied' THEN 1 END) as authors_denied,
    COUNT(CASE WHEN dp.permission_status = 'pending' THEN 1 END) as authors_pending
FROM theses t
LEFT JOIN download_permissions dp ON t.id = dp.thesis_id
GROUP BY t.id, t.title;

-- =====================================================
-- 4. REVIEWS & FEEDBACK
-- =====================================================

CREATE TABLE thesis_reviews (
    id SERIAL PRIMARY KEY,
    thesis_id INTEGER NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
    reviewer_id INTEGER NOT NULL REFERENCES users(id),
    review_type VARCHAR(50) CHECK (review_type IN ('supervisor_review', 'peer_review', 'admin_review')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'revision_required')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE thesis_comments (
    id SERIAL PRIMARY KEY,
    thesis_id INTEGER NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    parent_comment_id INTEGER REFERENCES thesis_comments(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. NOTIFICATIONS
-- =====================================================

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'thesis_submitted', 'thesis_approved', 'thesis_rejected',
        'review_requested', 'review_completed', 'comment_added',
        'download_permission_requested', 'download_permission_granted', 'download_permission_denied',
        'collaboration_invite', 'mention', 'system_announcement'
    )),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_thesis_id INTEGER REFERENCES theses(id) ON DELETE CASCADE,
    related_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. ACTIVITY LOGS & ANALYTICS
-- =====================================================

CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE thesis_views (
    id SERIAL PRIMARY KEY,
    thesis_id INTEGER NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
    viewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE thesis_downloads (
    id SERIAL PRIMARY KEY,
    thesis_id INTEGER NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
    downloader_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    file_id INTEGER REFERENCES thesis_files(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 7. COLLABORATION & WORKSPACES (Future Implementation)
-- =====================================================

CREATE TABLE workspaces (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    creator_id INTEGER NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'submitted')),
    submitted_as_thesis_id INTEGER REFERENCES theses(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workspace_members (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'editor', 'viewer')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workspace_id, user_id)
);

-- =====================================================
-- 8. INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department);

-- Session indexes
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- Thesis indexes
CREATE INDEX idx_theses_supervisor ON theses(supervisor_id);
CREATE INDEX idx_theses_status ON theses(status);
CREATE INDEX idx_theses_department ON theses(department);
CREATE INDEX idx_theses_field ON theses(field);
CREATE INDEX idx_theses_year ON theses(year);
CREATE INDEX idx_theses_published ON theses(published_date);

-- Thesis authors indexes
CREATE INDEX idx_thesis_authors_thesis ON thesis_authors(thesis_id);
CREATE INDEX idx_thesis_authors_author ON thesis_authors(author_id);
CREATE INDEX idx_thesis_authors_order ON thesis_authors(thesis_id, author_order);

-- Thesis files indexes
CREATE INDEX idx_thesis_files_thesis ON thesis_files(thesis_id);

-- Download permissions indexes
CREATE INDEX idx_download_permissions_thesis ON download_permissions(thesis_id);
CREATE INDEX idx_download_permissions_author ON download_permissions(author_id);
CREATE INDEX idx_download_permissions_status ON download_permissions(permission_status);
CREATE INDEX idx_download_permissions_composite ON download_permissions(thesis_id, permission_status);

-- Review indexes
CREATE INDEX idx_reviews_thesis ON thesis_reviews(thesis_id);
CREATE INDEX idx_reviews_reviewer ON thesis_reviews(reviewer_id);
CREATE INDEX idx_reviews_status ON thesis_reviews(status);

-- Comment indexes
CREATE INDEX idx_comments_thesis ON thesis_comments(thesis_id);
CREATE INDEX idx_comments_user ON thesis_comments(user_id);
CREATE INDEX idx_comments_parent ON thesis_comments(parent_comment_id);

-- Notification indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Activity log indexes
CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_type ON activity_logs(action_type);
CREATE INDEX idx_activity_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_created ON activity_logs(created_at DESC);

-- Analytics indexes
CREATE INDEX idx_thesis_views_thesis ON thesis_views(thesis_id);
CREATE INDEX idx_thesis_views_viewer ON thesis_views(viewer_id);
CREATE INDEX idx_thesis_downloads_thesis ON thesis_downloads(thesis_id);
CREATE INDEX idx_thesis_downloads_downloader ON thesis_downloads(downloader_id);

-- =====================================================
-- 9. TRIGGERS FOR AUTO-UPDATE
-- =====================================================

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_theses_updated_at BEFORE UPDATE ON theses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON thesis_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON thesis_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-increment view count
CREATE OR REPLACE FUNCTION increment_thesis_views()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE theses SET views = views + 1 WHERE id = NEW.thesis_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER thesis_view_increment AFTER INSERT ON thesis_views
    FOR EACH ROW EXECUTE FUNCTION increment_thesis_views();

-- Auto-increment download count
CREATE OR REPLACE FUNCTION increment_thesis_downloads()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE theses SET downloads = downloads + 1 WHERE id = NEW.thesis_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER thesis_download_increment AFTER INSERT ON thesis_downloads
    FOR EACH ROW EXECUTE FUNCTION increment_thesis_downloads();

-- =====================================================
-- 10. USEFUL VIEWS FOR COMPLEX QUERIES
-- =====================================================

-- Complete thesis with all authors
CREATE VIEW theses_with_authors AS
SELECT 
    t.*,
    json_agg(
        json_build_object(
            'id', u.id,
            'full_name', u.full_name,
            'email', u.email,
            'student_id', u.student_id,
            'author_order', ta.author_order,
            'role', ta.role
        ) ORDER BY ta.author_order
    ) as authors
FROM theses t
LEFT JOIN thesis_authors ta ON t.id = ta.thesis_id
LEFT JOIN users u ON ta.author_id = u.id
GROUP BY t.id;

-- Thesis statistics per department
CREATE VIEW department_statistics AS
SELECT 
    department,
    COUNT(*) as total_theses,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published_theses,
    SUM(views) as total_views,
    SUM(downloads) as total_downloads,
    AVG(views) as avg_views
FROM theses
GROUP BY department;

-- User statistics
CREATE VIEW user_statistics AS
SELECT 
    u.id,
    u.full_name,
    u.role,
    COUNT(CASE WHEN ta.role = 'primary_author' THEN 1 END) as primary_author_count,
    COUNT(CASE WHEN ta.role = 'co_author' THEN 1 END) as co_author_count,
    COUNT(DISTINCT t.id) as total_theses
FROM users u
LEFT JOIN thesis_authors ta ON u.id = ta.author_id
LEFT JOIN theses t ON ta.thesis_id = t.id
WHERE u.role = 'student'
GROUP BY u.id, u.full_name, u.role;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
