# System Architecture Diagram

This diagram illustrates the overall system architecture following IEEE Std 1016 guidelines.

\`\`\`mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        A1[React Components]
        A2[Next.js Client]
    end

    subgraph "Application Layer - Next.js 16"
        B[Server Components]
        C[API Routes]
        D[Server Actions]
        E[Middleware/Proxy]
    end

    subgraph "Business Logic Layer"
        F[Authentication Service]
        G[Thesis Management]
        H[User Management]
        I[File Management]
        J[Notification Service]
    end

    subgraph "Data Access Layer"
        K[Database Queries - lib/db]
        L[Data Transformations - lib/data]
        M[Cache Layer - React cache]
    end

    subgraph "External Services"
        N[(PostgreSQL Database)]
        O[Vercel Blob Storage]
        P[Email Service]
    end

    A --> A1
    A1 --> A2
    A2 --> B
    A2 --> C
    A2 --> D
    
    B --> F
    B --> G
    C --> H
    D --> I
    E --> F
    
    F --> K
    G --> K
    H --> K
    I --> K
    J --> K
    
    K --> M
    L --> M
    M --> N
    
    I --> O
    J --> P

    style A fill:#e1f5ff
    style N fill:#ffe1e1
    style O fill:#ffe1e1
    style P fill:#ffe1e1
\`\`\`

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19.2, Next.js 16, TypeScript, Tailwind CSS v4 |
| Backend | Next.js Server Components, Server Actions, API Routes |
| Database | PostgreSQL (Neon/Supabase) |
| Storage | Vercel Blob Storage |
| Authentication | Custom JWT-based with bcrypt |
| Caching | React cache(), Next.js Data Cache |

## Architecture Patterns

- **Server-Side Rendering (SSR)**: Pages are rendered on the server for optimal performance
- **API Routes**: RESTful endpoints for external integrations
- **Server Actions**: Direct server function calls for mutations
- **React Cache**: Request-level memoization to prevent duplicate queries
- **Parallel Data Fetching**: Using Promise.all() for independent queries
