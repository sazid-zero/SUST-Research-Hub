# Database Setup Guide

## Overview
This guide explains how to set up the thesis repository database with real data including 20 students, 10 supervisors, and published theses with co-authors.

## Database Structure

### New Tables Created

1. **theses** - Main thesis information
   - id, title, abstract, department, year, status, keywords, views, downloads
   - supervisor_id (foreign key to users table)

2. **thesis_authors** - Co-authorship relationship
   - Links multiple students to a single thesis
   - Tracks primary author vs co-authors
   - Author order for proper citation

3. **thesis_files** - Thesis attachments
   - PDF documents, presentations, videos, audio files
   - File metadata (name, size, type)

## Running the Scripts

Execute the SQL scripts in order:

\`\`\`bash
# 1. Create thesis tables
Execute: scripts/03-create-thesis-tables.sql

# 2. Add 20 students and 10 supervisors
Execute: scripts/04-seed-students-supervisors.sql

# 3. Add published theses with co-authors
Execute: scripts/05-seed-theses-data.sql
\`\`\`

## Data Summary

### Students (20 total)
- Various departments: CSE, EEE, Civil, Physics, Chemistry, etc.
- Mix of BSc and MSc students
- All pre-approved and ready to use

### Supervisors (10 total)
- Professors and Associate Professors
- Specialized in different research areas
- Distributed across all departments

### Theses (10+ published)
- Each thesis has **2 co-authors** from the 20 students
- Each thesis has **1 supervisor** from the 10 supervisors
- All are **published** status (approved)
- Real research topics with abstracts, keywords, files

## Next Steps

After running these scripts, we need to:

1. **Create database query functions** - Replace mock data functions with real database queries
2. **Update pages** - Modify home, browse, and dashboard pages to fetch from database
3. **Add Server Actions** - Create actions for thesis operations (view, download, search)

## Example Queries

\`\`\`sql
-- Get all published theses with authors and supervisor
SELECT 
    t.*,
    json_agg(DISTINCT jsonb_build_object(
        'id', u.id,
        'name', u.full_name,
        'role', ta.role,
        'order', ta.author_order
    )) as authors,
    s.full_name as supervisor_name
FROM theses t
LEFT JOIN thesis_authors ta ON t.id = ta.thesis_id
LEFT JOIN users u ON ta.author_id = u.id
LEFT JOIN users s ON t.supervisor_id = s.id
WHERE t.status = 'approved'
GROUP BY t.id, s.full_name;

-- Get theses by department
SELECT * FROM theses 
WHERE department = 'Computer Science & Engineering' 
AND status = 'approved'
ORDER BY year DESC, submitted_date DESC;

-- Search theses
SELECT * FROM theses 
WHERE status = 'approved'
AND (
    title ILIKE '%machine learning%' OR
    abstract ILIKE '%machine learning%' OR
    'Machine Learning' = ANY(keywords)
);
\`\`\`

## Notes

- The seed script includes 10 representative theses
- You can add the remaining 27 theses from the mock data by following the same pattern
- All passwords are hashed (mock hash for development)
- Student IDs follow the format: YYYYDDDNNN (year + department + number)
