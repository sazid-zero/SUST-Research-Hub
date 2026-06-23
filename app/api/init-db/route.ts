import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const sql = neon(process.env.DATABASE_URL!)
        
        await sql`
        CREATE TABLE IF NOT EXISTS public.authorship_claims (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
            workspace_type VARCHAR(50) NOT NULL CHECK (workspace_type IN ('thesis', 'publication')),
            workspace_id INTEGER NOT NULL,
            author_name_matched VARCHAR(255) NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            resolved_at TIMESTAMP WITHOUT TIME ZONE,
            resolved_by INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
            notes TEXT
        );
        `
        
        await sql`CREATE INDEX IF NOT EXISTS idx_authorship_claims_status ON public.authorship_claims(status);`
        await sql`CREATE INDEX IF NOT EXISTS idx_authorship_claims_user_id ON public.authorship_claims(user_id);`
        
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
        );
        `
        
        await sql`CREATE INDEX IF NOT EXISTS idx_paper_review_status ON public.paper_review_requests(status);`
        await sql`CREATE INDEX IF NOT EXISTS idx_paper_review_publication_id ON public.paper_review_requests(publication_id);`
        await sql`CREATE INDEX IF NOT EXISTS idx_paper_review_student_id ON public.paper_review_requests(student_id);`
        
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
        );
        `
        
        await sql`CREATE INDEX IF NOT EXISTS idx_coauthor_requests_status ON public.coauthor_requests(status);`
        await sql`CREATE INDEX IF NOT EXISTS idx_coauthor_requests_publication_id ON public.coauthor_requests(publication_id);`
        await sql`CREATE INDEX IF NOT EXISTS idx_coauthor_requests_invited_user ON public.coauthor_requests(invited_user_id);`
        
        return NextResponse.json({ success: true, message: "Table created" })
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message })
    }
}
