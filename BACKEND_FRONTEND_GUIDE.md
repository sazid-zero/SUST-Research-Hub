# 🎓 Next.js Backend-Frontend Connection Guide
## How Backend & Frontend Work Together in Your Thesis Repository

---

## 🤔 Your Confusion (SOLVED!)

You thought: "I can just add backend code to my page files and it works!"

**Partially correct!** But there's a structure to follow. Let me show you **3 ways** to connect backend and frontend in Next.js:

---

## ✅ METHOD 1: Server Components (Simplest!)

**Where:** Directly in your page files (`page.tsx`)
**What:** Fetch data on the server, render on the server, send HTML to client

### Example from YOUR PROJECT:

\`\`\`tsx
// app/page.tsx
export default async function Home() {
  // ✅ THIS IS BACKEND CODE running on the server!
  const user = await getCurrentUser()
  const allTheses = getAllTheses()
  
  // ✅ THIS IS FRONTEND CODE - the JSX
  return <HomeContent user={user} allTheses={allTheses} />
}
\`\`\`

**How it works:**
1. ✅ `async` function = Server Component
2. ✅ Runs on the server FIRST (backend)
3. ✅ Fetches data from database
4. ✅ Sends rendered HTML to browser (frontend)

**Limitations:**
- ❌ No `useState`, `useEffect`, `onClick` handlers
- ❌ Cannot use browser APIs (localStorage, window, etc.)

---

## ✅ METHOD 2: Server Actions (Recommended for Forms!)

**Where:** In `app/actions/` folder
**What:** Server-side functions that client components can call

### Example from YOUR PROJECT:

#### Step 1: Create the Server Action (Backend)

\`\`\`tsx
// app/actions/auth.ts
'use server' // ← THIS MAKES IT RUN ON SERVER!

export async function loginUser(email: string, password: string) {
  // ✅ THIS IS BACKEND CODE
  // Can access database, environment variables, etc.
  const user = await db.query('SELECT * FROM users WHERE email = $1', [email])
  
  if (!user) {
    return { error: 'User not found' }
  }
  
  const isValid = await bcrypt.compare(password, user.password)
  
  if (!isValid) {
    return { error: 'Invalid password' }
  }
  
  // Create session
  const session = await createSession(user.id)
  
  return { success: true, user }
}
\`\`\`

#### Step 2: Call it from Client Component (Frontend)

\`\`\`tsx
// components/login-form.tsx
'use client' // ← THIS MAKES IT RUN ON BROWSER!

import { useState } from 'react'
import { loginUser } from '@/app/actions/auth'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    
    // ✅ Call the server action (goes to backend)
    const result = await loginUser(email, password)
    
    if (result.error) {
      setError(result.error)
    } else {
      // Redirect to dashboard
      window.location.href = '/dashboard'
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  )
}
\`\`\`

**How it works:**
1. ✅ User types in form (frontend/browser)
2. ✅ Clicks submit → calls `loginUser()` (goes to backend/server)
3. ✅ Server action runs on server, accesses database
4. ✅ Returns result to frontend
5. ✅ Frontend updates UI

---

## ✅ METHOD 3: API Routes (For External Calls)

**Where:** In `app/api/` folder
**What:** Traditional REST API endpoints

### Example from YOUR PROJECT:

#### Step 1: Create API Route (Backend)

\`\`\`tsx
// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // ✅ THIS IS BACKEND CODE
  const body = await request.json()
  const { email, password, name } = body
  
  // Validate
  if (!email || !password) {
    return NextResponse.json(
      { error: 'Missing fields' },
      { status: 400 }
    )
  }
  
  // Save to database
  const user = await db.query(
    'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
    [email, hashedPassword, name]
  )
  
  return NextResponse.json({ success: true, user })
}
\`\`\`

#### Step 2: Call it from Frontend

\`\`\`tsx
// components/register-form.tsx
'use client'

export function RegisterForm() {
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    
    // ✅ Call API route (HTTP request to backend)
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    })
    
    const data = await response.json()
    
    if (data.error) {
      setError(data.error)
    } else {
      router.push('/dashboard')
    }
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
\`\`\`

**When to use API Routes:**
- ✅ External services need to call your API
- ✅ Webhooks (Stripe, GitHub, etc.)
- ✅ Mobile apps calling your backend
- ❌ **Don't use for internal calls** (use Server Actions instead!)

---

## 📊 COMPARISON: Which Method to Use?

| Feature | Server Component | Server Action | API Route |
|---------|------------------|---------------|-----------|
| **Where** | `page.tsx` | `app/actions/` | `app/api/` |
| **Runs on** | Server | Server | Server |
| **Called from** | N/A (auto runs) | Client Components | Client/External |
| **Use Case** | Initial data loading | Forms, mutations | External APIs |
| **Can use DB?** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Can use useState?** | ❌ No | ❌ No | ❌ No |
| **Best for** | Reading data | Writing data | Webhooks |

---

## 🎯 REAL EXAMPLES FROM YOUR THESIS APP

### Example 1: View Thesis Details Page

\`\`\`tsx
// app/thesis/[id]/page.tsx
export default async function ThesisPage({ params }: { params: { id: string } }) {
  // ✅ BACKEND: Fetch thesis from database
  const thesis = await getThesisById(params.id)
  const comments = await getCommentsByThesisId(params.id)
  
  // ✅ FRONTEND: Render the UI
  return (
    <div>
      <h1>{thesis.title}</h1>
      <p>{thesis.abstract}</p>
      
      {/* Client component for interactive features */}
      <CommentSection comments={comments} thesisId={thesis.id} />
    </div>
  )
}
\`\`\`

### Example 2: Submit Comment (Server Action)

\`\`\`tsx
// app/actions/comments.ts
'use server'

export async function submitComment(thesisId: string, content: string) {
  // ✅ BACKEND: Get current user
  const user = await getCurrentUser()
  
  if (!user) {
    return { error: 'Must be logged in' }
  }
  
  // ✅ BACKEND: Save to database
  const comment = await db.query(
    'INSERT INTO comments (thesis_id, user_id, content) VALUES ($1, $2, $3)',
    [thesisId, user.id, content]
  )
  
  return { success: true, comment }
}
\`\`\`

\`\`\`tsx
// components/comment-section.tsx
'use client'

export function CommentSection({ thesisId }: { thesisId: string }) {
  const [comment, setComment] = useState('')
  
  async function handleSubmit() {
    // ✅ FRONTEND calls BACKEND
    const result = await submitComment(thesisId, comment)
    
    if (result.success) {
      setComment('')
      // Refresh page to show new comment
      window.location.reload()
    }
  }
  
  return (
    <div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}
\`\`\`

### Example 3: Admin Dashboard Stats

\`\`\`tsx
// app/admin/dashboard/page.tsx
export default async function AdminDashboard() {
  // ✅ BACKEND: Fetch all stats from database
  const stats = {
    totalTheses: await getThesesCount(),
    pendingReviews: await getPendingReviewsCount(),
    totalUsers: await getUsersCount(),
    recentSubmissions: await getRecentTheses(10)
  }
  
  // ✅ FRONTEND: Render dashboard
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <StatsCards stats={stats} />
      <RecentThesesTable theses={stats.recentSubmissions} />
    </div>
  )
}
\`\`\`

---

## 🚨 COMMON MISTAKES (You were making these!)

### ❌ MISTAKE 1: Trying to use `useState` in Server Component

\`\`\`tsx
// ❌ WRONG!
export default async function Page() {
  const [count, setCount] = useState(0) // ERROR!
  return <div>{count}</div>
}

// ✅ CORRECT! Split into Server + Client Components
export default async function Page() {
  const data = await fetchData() // Server
  return <ClientCounter initialData={data} /> // Pass to client
}
\`\`\`

### ❌ MISTAKE 2: Fetching in `useEffect` when you don't need to

\`\`\`tsx
// ❌ WRONG! Unnecessary client-side fetching
'use client'
export default function Page() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData)
  }, [])
  
  return <div>{data}</div>
}

// ✅ CORRECT! Use Server Component
export default async function Page() {
  const data = await fetchData() // Runs on server
  return <div>{data}</div>
}
\`\`\`

### ❌ MISTAKE 3: Not using 'use server' in actions

\`\`\`tsx
// ❌ WRONG! This won't work
export async function saveData(data) {
  // This will try to run on client!
  await db.query('INSERT INTO...')
}

// ✅ CORRECT!
'use server'
export async function saveData(data) {
  await db.query('INSERT INTO...')
}
\`\`\`

---

## 🎓 THE COMPLETE FLOW

Let's trace a **complete user action** through your thesis app:

### Scenario: User submits a new thesis

\`\`\`
1. USER SEES PAGE (Server Component)
   app/submit-thesis/page.tsx
   ├─ async function SubmitThesisPage()
   ├─ Fetches current user from DB (backend)
   ├─ Renders <SubmitThesisForm user={user} /> (frontend)

2. USER FILLS FORM (Client Component)
   components/submit-thesis-form.tsx
   ├─ 'use client'
   ├─ useState for form fields (frontend)
   ├─ User types title, abstract, uploads PDF (frontend)

3. USER CLICKS SUBMIT (Server Action)
   app/actions/thesis.ts
   ├─ 'use server'
   ├─ async function submitThesis(formData)
   ├─ Validates data (backend)
   ├─ Uploads PDF to storage (backend)
   ├─ Saves to database (backend)
   ├─ Sends email to supervisor (backend)
   ├─ Returns { success: true } to frontend

4. FRONTEND SHOWS SUCCESS (Client Component)
   components/submit-thesis-form.tsx
   ├─ Receives result from server action
   ├─ Shows success message (frontend)
   ├─ Redirects to dashboard (frontend)
\`\`\`

---

## 📝 QUICK REFERENCE CHEAT SHEET

### When to use what:

**Use SERVER COMPONENT when:**
- ✅ You need to show data from database
- ✅ Page loads once, doesn't need interactivity
- ✅ SEO is important
- ✅ Example: Thesis details page, admin dashboard

**Use SERVER ACTION when:**
- ✅ User submits a form
- ✅ Need to create/update/delete data
- ✅ Need authentication checks
- ✅ Example: Login, register, submit thesis, approve thesis

**Use API ROUTE when:**
- ✅ External service calls your app (webhooks)
- ✅ Mobile app needs to connect
- ✅ Third-party integration
- ✅ Example: Stripe webhook, email verification callback

**Use CLIENT COMPONENT when:**
- ✅ Need useState, useEffect, event handlers
- ✅ Interactive UI (tabs, modals, dropdowns)
- ✅ Browser APIs (localStorage, geolocation)
- ✅ Example: Search bar, theme toggle, comment form

---

## 🛠️ YOUR PROJECT STRUCTURE (Recommended)

\`\`\`
thesis-repository/
├── app/
│   ├── page.tsx                    # ✅ Server Component (home page)
│   ├── login/
│   │   └── page.tsx               # ✅ Server Component (renders login form)
│   ├── thesis/
│   │   └── [id]/
│   │       └── page.tsx           # ✅ Server Component (fetches thesis data)
│   ├── actions/                   # ✅ Server Actions
│   │   ├── auth.ts                #    - loginUser(), registerUser()
│   │   ├── thesis.ts              #    - submitThesis(), approveThesis()
│   │   └── profile.ts             #    - updateProfile()
│   └── api/                       # ✅ API Routes (for external)
│       ├── webhooks/
│       │   └── stripe/route.ts
│       └── verify-email/route.ts
├── components/                    # ✅ Client Components
│   ├── login-form.tsx             #    'use client' - interactive forms
│   ├── theme-toggle.tsx           #    'use client' - UI interactions
│   └── comment-section.tsx        #    'use client' - real-time updates
└── lib/                           # ✅ Backend Utilities
    ├── db.ts                      #    Database connection
    └── auth.ts                    #    Auth helpers
\`\`\`

---

## 🎉 NOW YOU UNDERSTAND!

Next.js **is** simple, but you need to know:
1. **Server Components** run on server (can access DB directly)
2. **Client Components** run on browser (need to call server actions/APIs)
3. **Server Actions** are the bridge (call from client, run on server)

**The magic:** Next.js automatically handles the connection between them! You just need to structure your code correctly.

---

## 💡 FINAL TIPS

1. **Start with Server Components** (default in Next.js 13+)
2. **Only use 'use client' when you need** useState, onClick, etc.
3. **Use Server Actions** instead of API routes for internal calls
4. **Keep database queries on the server** (never expose credentials to client)
5. **Pass data down** from Server Components to Client Components via props

---

## 🚀 NEXT STEPS

Now go through your thesis app and identify:
- ✅ Which pages should be Server Components (most of them!)
- ✅ Which components need 'use client' (forms, interactive UI)
- ✅ What actions you need (submit thesis, login, approve, etc.)

Then structure them properly using this guide!
