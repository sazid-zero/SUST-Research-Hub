import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
    try {
        console.log('[v0] Starting database migration...')

        // Add department column to publications if missing
        try {
            await sql`
                ALTER TABLE publications
                ADD COLUMN IF NOT EXISTS department VARCHAR(255)
            `
            console.log('[v0] Added department column to publications')
        } catch (err: any) {
            console.log('[v0] Department column might already exist in publications:', err.message)
        }

        // Create coauthor_requests table if missing
        try {
            await sql`
                CREATE TABLE IF NOT EXISTS public.coauthor_requests (
                    id SERIAL PRIMARY KEY,
                    publication_id INTEGER NOT NULL REFERENCES public.publications(id) ON DELETE CASCADE,
                    invited_by INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
                    invited_user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
                    author_order INTEGER DEFAULT 0,
                    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
                    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    responded_at TIMESTAMP WITHOUT TIME ZONE,
                    UNIQUE(publication_id, invited_user_id)
                )
            `
            console.log('[v0] Created coauthor_requests table')
        } catch (err: any) {
            console.log('[v0] Coauthor requests table might already exist:', err.message)
        }

        // Add indexes to coauthor_requests
        try {
            await sql`CREATE INDEX IF NOT EXISTS idx_coauthor_requests_status ON public.coauthor_requests(status)`
            await sql`CREATE INDEX IF NOT EXISTS idx_coauthor_requests_publication_id ON public.coauthor_requests(publication_id)`
            await sql`CREATE INDEX IF NOT EXISTS idx_coauthor_requests_invited_user ON public.coauthor_requests(invited_user_id)`
            console.log('[v0] Created indexes for coauthor_requests')
        } catch (err: any) {
            console.log('[v0] Indexes might already exist:', err.message)
        }

        // Create paper_review_requests table if missing
        try {
            await sql`
                CREATE TABLE IF NOT EXISTS public.paper_review_requests (
                    id SERIAL PRIMARY KEY,
                    publication_id INTEGER NOT NULL REFERENCES public.publications(id) ON DELETE CASCADE,
                    student_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
                    submitted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
                    reviewed_by INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
                    reviewed_at TIMESTAMP WITHOUT TIME ZONE,
                    admin_feedback TEXT,
                    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            `
            console.log('[v0] Created paper_review_requests table')
        } catch (err: any) {
            console.log('[v0] Paper review requests table might already exist:', err.message)
        }

        // Add indexes to paper_review_requests
        try {
            await sql`CREATE INDEX IF NOT EXISTS idx_paper_review_status ON public.paper_review_requests(status)`
            await sql`CREATE INDEX IF NOT EXISTS idx_paper_review_publication_id ON public.paper_review_requests(publication_id)`
            await sql`CREATE INDEX IF NOT EXISTS idx_paper_review_student_id ON public.paper_review_requests(student_id)`
            console.log('[v0] Created indexes for paper_review_requests')
        } catch (err: any) {
            console.log('[v0] Indexes might already exist:', err.message)
        }

        return NextResponse.json({
            success: true,
            message: 'Database migration completed successfully',
            timestamp: new Date().toISOString()
        })
    } catch (error: any) {
        console.error('[v0] Migration error:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Migration failed',
                error: error.message
            },
            { status: 500 }
        )
    }
}
