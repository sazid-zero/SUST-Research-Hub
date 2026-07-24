# SUST Research Hub

> A centralized digital platform for managing, discovering, and collaborating on academic research at Shahjalal University of Science and Technology (SUST).

![Status](https://img.shields.io/badge/status-Academic%20Project-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-18%2B-green.svg)

---

## What is SUST Research Hub?

SUST Research Hub replaces the traditional, paper-based process of storing and accessing university theses and research projects with a searchable, role-based digital repository. It was built as an undergraduate project for the Department of Computer Science and Engineering, SUST, under the supervision of Dr. Md. Forhad Rabbi.

### Who it's for

- **Students** — submit theses/projects, browse prior research, collaborate with co-authors
- **Supervisors** — review submissions, give feedback, approve/reject publication
- **Administrators** — approve user registrations, manage users and departments
- **Public visitors** — browse and search published research without an account

---

## Table of Contents

1. [Core Features](#core-features)
2. [Content Types](#content-types)
3. [User Workflows](#user-workflows)
4. [Technology Stack](#technology-stack)
5. [System Architecture](#system-architecture)
6. [Database Schema](#database-schema)
7. [Project Structure](#project-structure)
8. [Development Setup](#development-setup)
9. [Known Limitations](#known-limitations)
10. [Roadmap](#roadmap)
11. [Contributing](#contributing)
12. [License](#license)

---

## Core Features

These are implemented and demoable in the current build:

### Theses & Research

- Role-based registration with admin approval
- Secure login (hashed passwords via bcrypt)
- Thesis submission with co-author support
- Supervisor review and feedback workflow
- Search and filter by title, department, supervisor, and year
- View/download tracking per thesis

### Publications

- Publication records linked to theses
- Metadata: DOI, ISSN, venue
- Multi-author support

### Research Projects

- Team-based project workspaces
- Project status tracking
- Links between projects, theses, and datasets/models

### Datasets & Models Repository

- Dataset entries with type/domain filtering
- ML model entries with framework/task filtering
- File metadata fields

### Collaboration & Notifications

- Multi-author / team workspaces with invitations
- In-app notifications for registration, review, and workflow events
- Email notifications (via Resend) for registration and approval events

### Admin Tools

- Registration approval queue with notes
- User and department management
- Basic analytics dashboard (submissions, approvals, department distribution)


---

## Content Types

| Type             | Description                                               |
| ---------------- | --------------------------------------------------------- |
| **Theses**       | Student thesis/project submissions with supervisor review |
| **Publications** | Published papers linked to theses, with citation metadata |
| **Projects**     | Active, team-based research projects                      |
| **Datasets**     | Uploaded research datasets with type/domain tags          |
| **Models**       | ML/AI models with framework and task metadata             |

---

## User Workflows

### Student thesis submission

```mermaid
graph TD
    A["Student Registers"] --> B["Admin Approval"]
    B --> C["Account Activated"]
    C --> D["Create/Draft Thesis"]
    D --> E["Add Co-Authors"]
    E --> F["Upload Files"]
    F --> G["Submit for Review"]
    G --> H["Supervisor Reviews"]
    H --> I{"Approved?"}
    I -->|Revisions Needed| J["Feedback Given"]
    J --> D
    I -->|Yes| K["Published to Repository"]
```

### Supervisor review

```mermaid
graph TD
    A["Notified of Submission"] --> B["Open Dashboard"]
    B --> C["Review Document"]
    C --> D["Write Feedback"]
    D --> E{"Decision"}
    E -->|Request Changes| F["Student Notified"]
    E -->|Approve| G["Publish"]
```

### Admin approval

```mermaid
graph TD
    A["Admin Login"] --> B["View Pending Registrations"]
    B --> C{"Approve?"}
    C -->|Yes| D["User Activated + Email Sent"]
    C -->|No| E["Rejection + Notes + Email Sent"]
```

---

## Technology Stack

### Frontend

| Tech                    | Purpose                    |
| ----------------------- | -------------------------- |
| Next.js 16 (App Router) | Full-stack React framework |
| React 19                | UI components              |
| TypeScript              | Type safety                |
| Tailwind CSS            | Styling                    |
| shadcn/ui               | Component library          |

### Backend

| Tech                   | Purpose                                                        |
| ---------------------- | -------------------------------------------------------------- |
| Next.js Server Actions | Server-side logic, no separate API layer needed for most flows |
| bcrypt                 | Password hashing                                               |
| Stateful DB sessions   | See [Authentication](#authentication) below — no JWT           |

### Data & Services

| Tech                         | Purpose                                                   |
| ---------------------------- | --------------------------------------------------------- |
| PostgreSQL (Neon, free tier) | Primary database                                          |
| Resend                       | Transactional email (registration/approval notifications) |
| Cloudinary                   | File uploads (thesis files, images)                       |
| Vercel                       | Hosting/deployment                                        |

---

## System Architecture

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER               │
│  React Components + Next.js UI           │
└──────────────────┬──────────────────────┘
                    ▼
┌─────────────────────────────────────────┐
│         APPLICATION LAYER                │
│  Server Components / Server Actions      │
│  Authentication & Authorization          │
└──────────────────┬──────────────────────┘
                    ▼
┌─────────────────────────────────────────┐
│         BUSINESS LOGIC LAYER             │
│  Thesis / Project / Dataset / Model      │
│  Management, Reviews, Notifications      │
└──────────────────┬──────────────────────┘
                    ▼
┌─────────────────────────────────────────┐
│         DATA ACCESS LAYER                │
│  Database queries, caching (React cache) │
└──────────────────┬──────────────────────┘
                    ▼
┌─────────────────────────────────────────┐
│         PERSISTENCE LAYER                │
│  PostgreSQL (Neon)                       │
└─────────────────────────────────────────┘
```

---

## Database Schema

Actual table groups implemented in the schema:

```
Core:
  users, departments, registration_requests, sessions

Research Content:
  theses, thesis_files, thesis_authors, thesis_keywords
  publications, publication_authors
  projects, project_collaborators
  datasets, dataset_files
  models, model_files
  content_popularity, content_contributors

Workflow:
  submissions, reviews, feedback_items, revision_requests
  teams, team_members

System:
  notifications, audit_logs, settings
```


---

## Authentication

Session-based, not JWT. Implementation lives in `lib/auth.ts` and `app/actions/auth.ts`:

1. **Token generation** — on login, a 32-byte cryptographically secure random string is generated as the session token.
2. **Database storage** — the token is stored in the `sessions` table, mapped to the user's ID, with a 7-day expiration.
3. **Cookie storage** — the token is sent to the client in an HTTP-only cookie (`session_token`).
4. **Validation** — on each authenticated request, the server reads `session_token` and validates it with a DB lookup (`JOIN sessions s ON u.id = s.user_id`), checking existence and expiration, then loads the user record.

This is deliberately stateful (revocable server-side, no token-refresh complexity) rather than stateless JWT — worth noting explicitly in the defense report since it's a real design decision, not a limitation.

---

## Project Structure

```
SUST_Research_Hub/
├── app/                 # Next.js App Router pages
│   ├── theses/
│   ├── projects/
│   ├── datasets/
│   ├── models/
│   ├── papers/
│   ├── admin/
│   ├── student/
│   ├── supervisor/
│   └── login/
├── components/          # React components (incl. shadcn/ui)
├── lib/
│   ├── db/               # Database query functions
│   └── auth.ts
├── hooks/
├── styles/
└── public/
```

---

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm (or npm)
- A PostgreSQL database (Neon free tier works)

### Install & Run

```bash
git clone https://github.com/sazid-zero/SUST-Research-Hub.git
cd SUST-Research-Hub
pnpm install
```

Create `.env.local`:

```env
DATABASE_URL="postgresql://user:pass@host/db"
# add other required env vars (email provider, etc.) as used in lib/
```

```bash
pnpm dev
# open http://localhost:3000
```

---

## Known Limitations

- Running on Neon's **free tier** — limited storage/compute.
- Email delivery via **Resend free tier** — can only send to a verified address without a paid/owned domain.
- No formal security audit, load testing, or accessibility audit has been performed. Treat any performance/uptime numbers as informal dev-environment observations, not guarantees.
- Datasets/Models/Projects modules are newer than the Theses module and may be less complete.

---

## Roadmap

**Near-term**

- File storage/versioning for thesis and dataset uploads
- Full notification system polish
- Analytics dashboard improvements

**Longer-term / exploratory**

- Smarter search (beyond keyword/filter matching)
- Plagiarism/duplicate-topic detection
- Citation export (BibTeX)

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes and test locally
4. Open a Pull Request with a clear description

```bash
git checkout -b feature/my-feature
pnpm dev
pnpm lint
pnpm build
git commit -m "feat: add my feature"
git push origin feature/my-feature
```

---

## Acknowledgements

- Supervisor: Dr. Md. Forhad Rabbi, Department of CSE, SUST
- Built with Next.js, React, Tailwind CSS, and PostgreSQL

---

## License

MIT License — see [LICENSE](./LICENSE).

---

**Authors & Maintainers:**
- A S M Sharif Mahmud Sazid ([@sazid-zero](https://github.com/sazid-zero))
- Sharmin Akther
