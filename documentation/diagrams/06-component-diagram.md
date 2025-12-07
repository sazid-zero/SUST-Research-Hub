# Component Diagram

Software components and dependencies following ISO/IEC 19501 (UML) standards.

\`\`\`mermaid
graph TB
    subgraph "Frontend Components"
        UI1[Page Components]
        UI2[UI Components Library]
        UI3[Form Components]
        UI4[Card Components]
        UI5[Layout Components]
    end

    subgraph "Client-Side Logic"
        C1[Client Components]
        C2[State Management]
        C3[Form Validation]
        C4[Client Utilities]
    end

    subgraph "Server Components"
        S1[Page Server Components]
        S2[Data Fetching]
        S3[Authentication Check]
        S4[Server Utilities]
    end

    subgraph "API Layer"
        A1[Server Actions]
        A2[API Routes]
        A3[Middleware/Proxy]
    end

    subgraph "Business Logic"
        B1[Authentication Service]
        B2[Thesis Management]
        B3[User Management]
        B4[File Management]
        B5[Notification Service]
    end

    subgraph "Data Access Layer"
        D1[Database Queries]
        D2[Data Transformations]
        D3[Cache Layer]
    end

    subgraph "External Integrations"
        E1[PostgreSQL Driver]
        E2[Blob Storage Client]
        E3[Email Client]
    end

    UI1 --> UI2
    UI1 --> UI3
    UI1 --> UI4
    UI1 --> UI5
    UI1 --> C1

    C1 --> C2
    C1 --> C3
    C1 --> C4
    C1 --> A1

    S1 --> S2
    S1 --> S3
    S1 --> S4
    S2 --> B1
    S2 --> B2

    A1 --> B1
    A1 --> B2
    A1 --> B3
    A1 --> B4
    A1 --> B5

    A2 --> B1
    A2 --> B2

    A3 --> B1

    B1 --> D1
    B2 --> D1
    B3 --> D1
    B4 --> D1
    B5 --> D1

    D1 --> D3
    D2 --> D3

    D3 --> E1
    B4 --> E2
    B5 --> E3

    style UI1 fill:#e1f5ff
    style A1 fill:#ffe1f5
    style B1 fill:#f5ffe1
    style D1 fill:#fff5e1
    style E1 fill:#ffe1e1
\`\`\`

## Component Descriptions

### Frontend Layer

| Component | Responsibility | Dependencies |
|-----------|---------------|--------------|
| Page Components | Top-level route components | UI Components, Client Components |
| UI Components Library | Reusable shadcn/ui components | Tailwind CSS, Radix UI |
| Form Components | Input handling and validation | React Hook Form, Zod |
| Card Components | Data display cards | UI Components |
| Layout Components | App shell, navigation | UI Components |

### Business Logic Layer

| Component | Responsibility | Key Functions |
|-----------|---------------|---------------|
| Authentication Service | User auth, session management | login(), register(), verifySession() |
| Thesis Management | CRUD operations for theses | submitThesis(), approvThesis(), publishThesis() |
| User Management | User CRUD operations | createUser(), updateUser(), deleteUser() |
| File Management | File upload/download | uploadFile(), getFileUrl(), deleteFile() |
| Notification Service | User notifications | sendNotification(), markAsRead() |

### Data Access Layer

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| Database Queries | SQL query execution | @neondatabase/serverless |
| Data Transformations | Map DB results to DTOs | TypeScript |
| Cache Layer | Request-level caching | React cache() |

## Dependencies

\`\`\`mermaid
graph LR
    A[Next.js 16] --> B[React 19.2]
    A --> C[TypeScript]
    A --> D[Tailwind CSS v4]
    
    E[shadcn/ui] --> B
    E --> F[Radix UI]
    
    G[@neondatabase/serverless] --> H[PostgreSQL]
    
    I[bcrypt] --> J[Password Hashing]
    K[JWT] --> L[Session Management]
    
    M[Vercel Blob] --> N[File Storage]
\`\`\`

## Interface Contracts

### IAuthenticationService
\`\`\`typescript
interface IAuthenticationService {
  login(email: string, password: string): Promise<SessionToken>
  register(userData: UserRegistration): Promise<User>
  verifySession(token: string): Promise<User | null>
  logout(sessionId: string): Promise<void>
}
\`\`\`

### IThesisService
\`\`\`typescript
interface IThesisService {
  submitThesis(data: ThesisSubmission): Promise<Thesis>
  approveThesis(thesisId: string, feedback: string): Promise<void>
  publishThesis(thesisId: string): Promise<void>
  getThesiById(id: string): Promise<Thesis>
  getAllPublishedTheses(): Promise<Thesis[]>
}
