-- Add username column to users table for supervisors
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE;

-- Add username index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Update existing supervisors with usernames based on their names
UPDATE users 
SET username = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(full_name, '[^a-zA-Z0-9 ]', '', 'g'), ' +', '.', 'g'))
WHERE role = 'supervisor' AND username IS NULL;

-- Ensure all supervisors have unique usernames
DO $$
DECLARE
    supervisor_record RECORD;
    base_username TEXT;
    counter INTEGER;
    new_username TEXT;
BEGIN
    FOR supervisor_record IN 
        SELECT id, full_name 
        FROM users 
        WHERE role = 'supervisor' AND username IS NULL
    LOOP
        base_username := LOWER(REGEXP_REPLACE(REGEXP_REPLACE(supervisor_record.full_name, '[^a-zA-Z0-9 ]', '', 'g'), ' +', '.', 'g'));
        counter := 1;
        new_username := base_username;
        
        WHILE EXISTS (SELECT 1 FROM users WHERE username = new_username) LOOP
            new_username := base_username || counter;
            counter := counter + 1;
        END LOOP;
        
        UPDATE users SET username = new_username WHERE id = supervisor_record.id;
    END LOOP;
END $$;
