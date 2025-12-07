-- Create theses table
CREATE TABLE IF NOT EXISTS theses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    abstract TEXT NOT NULL,
    department VARCHAR(200) NOT NULL,
    field VARCHAR(200),
    year INTEGER NOT NULL,
    submitted_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('approved', 'pending', 'rejected', 'in-review')),
    keywords TEXT[] NOT NULL DEFAULT '{}',
    views INTEGER NOT NULL DEFAULT 0,
    downloads INTEGER NOT NULL DEFAULT 0,
    supervisor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create thesis authors table (for co-authorship)
CREATE TABLE IF NOT EXISTS thesis_authors (
    id SERIAL PRIMARY KEY,
    thesis_id INTEGER NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    author_order INTEGER NOT NULL DEFAULT 1,
    role VARCHAR(50) NOT NULL DEFAULT 'co_author' CHECK (role IN ('primary_author', 'co_author')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(thesis_id, author_id)
);

-- Create thesis files table
CREATE TABLE IF NOT EXISTS thesis_files (
    id SERIAL PRIMARY KEY,
    thesis_id INTEGER NOT NULL REFERENCES theses(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size VARCHAR(50) NOT NULL,
    file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('pdf', 'presentation', 'video', 'audio', 'supplementary')),
    file_url TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_theses_status ON theses(status);
CREATE INDEX IF NOT EXISTS idx_theses_department ON theses(department);
CREATE INDEX IF NOT EXISTS idx_theses_year ON theses(year);
CREATE INDEX IF NOT EXISTS idx_theses_supervisor ON theses(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_thesis_authors_thesis ON thesis_authors(thesis_id);
CREATE INDEX IF NOT EXISTS idx_thesis_authors_author ON thesis_authors(author_id);
CREATE INDEX IF NOT EXISTS idx_thesis_files_thesis ON thesis_files(thesis_id);
