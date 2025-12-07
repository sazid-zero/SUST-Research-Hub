export type ProjectStatus = 
  | 'draft_pending_team' 
  | 'active_no_supervisor' 
  | 'pending_supervisor'
  | 'in_progress' 
  | 'pending_review' 
  | 'changes_requested'
  | 'published'

export type CollaboratorRole = 'primary_author' | 'co_author'
export type InvitationStatus = 'pending' | 'accepted' | 'declined'

export interface ProjectCollaborator {
  id: string
  userId: string
  userName: string
  userEmail: string
  role: CollaboratorRole
  invitationStatus: InvitationStatus
  invitedAt: string
  acceptedAt?: string
}

export interface Project {
  id: string
  title: string
  abstract: string
  field: string
  department: string
  keywords: string[]
  status: ProjectStatus
  createdBy: string
  createdByName: string
  supervisorId?: string
  supervisorName?: string
  collaborators: ProjectCollaborator[]
  files: ProjectFile[]
  createdAt: string
  updatedAt: string
  submittedAt?: string
  publishedAt?: string
  supervisorFeedback?: string
}

export interface ProjectFile {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  uploadedBy: string
  uploadedAt: string
}

export interface SupervisorRequest {
  id: string
  projectId: string
  supervisorId: string
  supervisorName: string
  status: 'pending' | 'accepted' | 'declined'
  requestMessage: string
  responseMessage?: string
  requestedAt: string
  respondedAt?: string
}

export interface Notification {
  id: string
  userId: string
  type: 'project_invitation' | 'invitation_accepted' | 'invitation_declined' | 'supervisor_request' | 'supervisor_accepted' | 'supervisor_declined' | 'review_request' | 'review_completed' | 'changes_requested' | 'project_published'
  title: string
  message: string
  read: boolean
  actionUrl?: string
  actionLabel?: string
  createdAt: string
}

// Mock data
let mockProjects: Project[] = [
  {
    id: '1',
    title: 'Machine Learning Based Crop Disease Detection',
    abstract: 'This thesis develops a lightweight, mobile-deployable machine learning model for early detection of crop diseases using smartphone images. Trained on a diverse real-field datasets, the proposed CropGuard-Net achieves 96.8% accuracy while running efficiently on low-end devices. The system effectively handles complex backgrounds, varying lighting, and multiple crop types (rice, maize, potato, tomato, wheat). Field trials with farmers showed high diagnostic accuracy and significant reduction in unnecessary pesticide use. The complete solution, including models and Android app, is open-sourced for real-world agricultural impact.',
    field: 'Computer Science',
    department: 'Computer Science & Engineering',
    keywords: ['Machine Learning', 'Agriculture', 'Computer Vision'],
    status: 'in_progress',
    createdBy: 'student1',
    createdByName: 'Sharif Mahmud',
    supervisorId: 'supervisor1',
    supervisorName: 'Dr. Ahmed Hassan',
    collaborators: [
      {
        id: '1',
        userId: 'student1',
        userName: 'Sharif Mahmud',
        userEmail: 'sharif@example.com',
        role: 'primary_author',
        invitationStatus: 'accepted',
        invitedAt: '2024-01-15T10:00:00Z',
        acceptedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        userId: 'student2',
        userName: 'Sharmin Akther',
        userEmail: 'sharmin@example.com',
        role: 'co_author',
        invitationStatus: 'accepted',
        invitedAt: '2024-01-15T10:05:00Z',
        acceptedAt: '2024-01-15T11:00:00Z',
      },
    ],
    files: [],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    title: 'IoT Based Smart Home Automation System',
    abstract: 'An innovative smart home system using IoT sensors and cloud computing...',
    field: 'Computer Science',
    department: 'Computer Science & Engineering',
    keywords: ['IoT', 'Smart Home', 'Cloud Computing'],
    status: 'draft_pending_team',
    createdBy: 'student1',
    createdByName: 'Sharif Mahmud',
    collaborators: [
      {
        id: '3',
        userId: 'student1',
        userName: 'Sharif Mahmud',
        userEmail: 'sharif@example.com',
        role: 'primary_author',
        invitationStatus: 'accepted',
        invitedAt: '2024-02-01T09:00:00Z',
        acceptedAt: '2024-02-01T09:00:00Z',
      },
      {
        id: '4',
        userId: 'student3',
        userName: 'Juthi',
        userEmail: 'juthi@example.com',
        role: 'co_author',
        invitationStatus: 'pending',
        invitedAt: '2024-02-01T09:05:00Z',
      },
    ],
    files: [],
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:05:00Z',
  },
  {
    id: '3',
    title: 'Blockchain Based Supply Chain Management',
    abstract: 'A decentralized supply chain tracking system using blockchain technology...',
    field: 'Computer Science',
    department: 'Computer Science & Engineering',
    keywords: ['Blockchain', 'Supply Chain', 'Smart Contracts'],
    status: 'active_no_supervisor',
    createdBy: 'student4',
    createdByName: 'Sarah Ahmed',
    collaborators: [
      {
        id: '5',
        userId: 'student4',
        userName: 'Sarah Ahmed',
        userEmail: 'sarah@example.com',
        role: 'primary_author',
        invitationStatus: 'accepted',
        invitedAt: '2024-02-10T10:00:00Z',
        acceptedAt: '2024-02-10T10:00:00Z',
      },
    ],
    files: [],
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z',
  },
  {
    id: '4',
    title: 'AI-Powered Medical Diagnosis System',
    abstract: 'Using artificial intelligence to assist doctors in diagnosing diseases...',
    field: 'Computer Science',
    department: 'Computer Science & Engineering',
    keywords: ['AI', 'Healthcare', 'Diagnosis'],
    status: 'pending_review',
    createdBy: 'student5',
    createdByName: 'Michael Chen',
    supervisorId: 'supervisor1',
    supervisorName: 'Dr. Ahmed Hassan',
    collaborators: [
      {
        id: '6',
        userId: 'student5',
        userName: 'Michael Chen',
        userEmail: 'michael@example.com',
        role: 'primary_author',
        invitationStatus: 'accepted',
        invitedAt: '2024-01-20T10:00:00Z',
        acceptedAt: '2024-01-20T10:00:00Z',
      },
    ],
    files: [],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-02-15T14:00:00Z',
    submittedAt: '2024-02-15T14:00:00Z',
  },
  {
    id: '5',
    title: 'Renewable Energy Optimization Using ML',
    abstract: 'Machine learning algorithms for optimizing renewable energy consumption...',
    field: 'Computer Science',
    department: 'Computer Science & Engineering',
    keywords: ['Machine Learning', 'Energy', 'Optimization'],
    status: 'published',
    createdBy: 'student6',
    createdByName: 'Emma Wilson',
    supervisorId: 'supervisor1',
    supervisorName: 'Dr. Ahmed Hassan',
    collaborators: [
      {
        id: '7',
        userId: 'student6',
        userName: 'Emma Wilson',
        userEmail: 'emma@example.com',
        role: 'primary_author',
        invitationStatus: 'accepted',
        invitedAt: '2023-12-01T10:00:00Z',
        acceptedAt: '2023-12-01T10:00:00Z',
      },
    ],
    files: [],
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    submittedAt: '2024-01-05T10:00:00Z',
    publishedAt: '2024-01-10T10:00:00Z',
  },
]

let mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'student1',
    type: 'invitation_accepted',
    title: 'Collaboration Accepted',
    message: 'Jane Smith accepted your invitation to collaborate on "Machine Learning Based Crop Disease Detection"',
    read: false,
    actionUrl: '/student/projects/1',
    actionLabel: 'View Project',
    createdAt: '2024-01-15T11:00:00Z',
  },
  {
    id: '2',
    userId: 'student2',
    type: 'project_invitation',
    title: 'Project Invitation',
    message: 'John Doe invited you to collaborate on "Machine Learning Based Crop Disease Detection"',
    read: true,
    actionUrl: '/student/projects/1',
    actionLabel: 'View Invitation',
    createdAt: '2024-01-15T10:05:00Z',
  },
]

let mockSupervisorRequests: SupervisorRequest[] = []

// Helper functions
export function getAllProjects(): Project[] {
  return mockProjects
}

export function getProjects(): Project[] {
  return mockProjects
}

export function getProjectById(id: string): Project | undefined {
  return mockProjects.find(p => p.id === id)
}

export function getProjectsByUser(userId: string): Project[] {
  return mockProjects.filter(p => 
    p.collaborators.some(c => c.userId === userId && c.invitationStatus === 'accepted')
  )
}

export function getProjectsByCreator(userId: string): Project[] {
  return mockProjects.filter(p => p.createdBy === userId)
}

export function getProjectsBySupervisor(supervisorId: string): Project[] {
  return mockProjects.filter(p => p.supervisorId === supervisorId)
}

export function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
  const newProject: Project = {
    ...project,
    id: String(mockProjects.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockProjects.push(newProject)
  return newProject
}

export function updateProject(id: string, updates: Partial<Project>): Project | undefined {
  const index = mockProjects.findIndex(p => p.id === id)
  if (index === -1) return undefined
  
  mockProjects[index] = {
    ...mockProjects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockProjects[index]
}

export function acceptInvitation(projectId: string, userId: string): boolean {
  const project = mockProjects.find(p => p.id === projectId)
  if (!project) return false
  
  const collaborator = project.collaborators.find(c => c.userId === userId)
  if (!collaborator) return false
  
  collaborator.invitationStatus = 'accepted'
  collaborator.acceptedAt = new Date().toISOString()
  
  // Check if all collaborators accepted
  const allAccepted = project.collaborators.every(c => c.invitationStatus === 'accepted')
  if (allAccepted && project.status === 'draft_pending_team') {
    project.status = 'active_no_supervisor'
  }
  
  project.updatedAt = new Date().toISOString()
  return true
}

export function declineInvitation(projectId: string, userId: string): boolean {
  const project = mockProjects.find(p => p.id === projectId)
  if (!project) return false
  
  const collaborator = project.collaborators.find(c => c.userId === userId)
  if (!collaborator) return false
  
  collaborator.invitationStatus = 'declined'
  project.updatedAt = new Date().toISOString()
  return true
}

// Notifications
export function getNotificationsByUser(userId: string): Notification[] {
  return mockNotifications.filter(n => n.userId === userId)
}

export function getUnreadCount(userId: string): number {
  return mockNotifications.filter(n => n.userId === userId && !n.read).length
}

export function markNotificationAsRead(notificationId: string): boolean {
  const notification = mockNotifications.find(n => n.id === notificationId)
  if (!notification) return false
  
  notification.read = true
  return true
}

export function markAllAsRead(userId: string): void {
  mockNotifications.forEach(n => {
    if (n.userId === userId) {
      n.read = true
    }
  })
}

export function createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Notification {
  const newNotification: Notification = {
    ...notification,
    id: String(mockNotifications.length + 1),
    createdAt: new Date().toISOString(),
  }
  mockNotifications.push(newNotification)
  return newNotification
}

// Supervisor requests
export function createSupervisorRequest(request: Omit<SupervisorRequest, 'id' | 'requestedAt'>): SupervisorRequest {
  const newRequest: SupervisorRequest = {
    ...request,
    id: String(mockSupervisorRequests.length + 1),
    requestedAt: new Date().toISOString(),
  }
  mockSupervisorRequests.push(newRequest)
  
  // Update project status
  const project = mockProjects.find(p => p.id === request.projectId)
  if (project) {
    project.status = 'pending_supervisor'
    project.updatedAt = new Date().toISOString()
  }
  
  return newRequest
}

export function getSupervisorRequestsByProject(projectId: string): SupervisorRequest[] {
  return mockSupervisorRequests.filter(r => r.projectId === projectId)
}

export function getSupervisorRequestsBySupervisor(supervisorId: string): SupervisorRequest[] {
  return mockSupervisorRequests.filter(r => r.supervisorId === supervisorId && r.status === 'pending')
}

export function acceptSupervisorRequest(requestId: string, responseMessage?: string): boolean {
  const request = mockSupervisorRequests.find(r => r.id === requestId)
  if (!request) return false
  
  request.status = 'accepted'
  request.responseMessage = responseMessage
  request.respondedAt = new Date().toISOString()
  
  // Update project
  const project = mockProjects.find(p => p.id === request.projectId)
  if (project) {
    project.supervisorId = request.supervisorId
    project.supervisorName = request.supervisorName
    project.status = 'in_progress'
    project.updatedAt = new Date().toISOString()
  }
  
  return true
}

export function declineSupervisorRequest(requestId: string, responseMessage?: string): boolean {
  const request = mockSupervisorRequests.find(r => r.id === requestId)
  if (!request) return false
  
  request.status = 'declined'
  request.responseMessage = responseMessage
  request.respondedAt = new Date().toISOString()
  
  // Update project status back
  const project = mockProjects.find(p => p.id === request.projectId)
  if (project) {
    project.status = 'active_no_supervisor'
    project.updatedAt = new Date().toISOString()
  }
  
  return true
}
