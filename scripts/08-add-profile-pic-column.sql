-- Add profile_pic column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_pic TEXT;

-- Add index for profile_pic lookups (optional, for faster queries)
CREATE INDEX IF NOT EXISTS idx_users_profile_pic ON users(profile_pic) WHERE profile_pic IS NOT NULL;
