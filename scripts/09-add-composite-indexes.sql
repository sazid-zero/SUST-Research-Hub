-- Add composite indexes for better JOIN performance and query optimization

-- Composite index for thesis_authors lookups (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_thesis_authors_thesis_order ON thesis_authors(thesis_id, author_order);

-- Removed NOW() function from WHERE clause as it's not IMMUTABLE
-- Index for sessions by token and expiration (queries will still filter by expires_at)
CREATE INDEX IF NOT EXISTS idx_sessions_token_expires ON sessions(token, expires_at);

-- Removed WHERE clause with comparison - partial indexes need immutable predicates
-- Composite index for theses by status and date (for recent approved theses)
CREATE INDEX IF NOT EXISTS idx_theses_status_created ON theses(status, created_at DESC);

-- Composite index for user lookups by email and approval status
CREATE INDEX IF NOT EXISTS idx_users_email_approved ON users(email, is_approved);

-- Index on created_at for ordering recent theses
CREATE INDEX IF NOT EXISTS idx_theses_created_at ON theses(created_at DESC);

-- GIN index for keyword array searches (for filtering by keywords)
CREATE INDEX IF NOT EXISTS idx_theses_keywords ON theses USING GIN(keywords);
