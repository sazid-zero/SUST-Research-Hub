import { sendEmail } from '@/lib/email/send'
import { emailTemplates } from '@/lib/email/templates'

export async function sendApprovalEmail(email: string, fullName: string, loginUrl: string): Promise<void> {
  const template = emailTemplates.approvalEmail(fullName, loginUrl)
  await sendEmail(email, template.subject, template.html)
}

export async function sendRejectionEmail(
  email: string,
  fullName: string,
  reason: string,
  reapplyUrl: string
): Promise<void> {
  const template = emailTemplates.rejectionEmail(fullName, reason, reapplyUrl)
  await sendEmail(email, template.subject, template.html)
}

export async function sendRegistrationEmail(email: string, fullName: string): Promise<void> {
  const template = emailTemplates.registrationPendingEmail(fullName)
  await sendEmail(email, template.subject, template.html)
}

export async function sendAdminNotificationEmail(
  adminEmail: string,
  userName: string,
  userEmail: string,
  userRole: string,
  dashboardUrl: string
): Promise<void> {
  const template = emailTemplates.adminNotificationEmail(userName, userEmail, userRole, dashboardUrl)
  await sendEmail(adminEmail, template.subject, template.html)
}

export async function sendVerificationLinkEmail(
  email: string,
  fullName: string,
  verifyUrl: string
): Promise<void> {
  const template = emailTemplates.verificationEmail(fullName, verifyUrl)
  await sendEmail(email, template.subject, template.html)
}

export async function sendSupervisionRequestEmail(
  supervisorEmail: string,
  supervisorName: string,
  studentName: string,
  workspaceTitle: string,
  proposal: string,
  link: string
): Promise<void> {
  const template = emailTemplates.supervisionRequestEmail(supervisorName, studentName, workspaceTitle, proposal, link)
  await sendEmail(supervisorEmail, template.subject, template.html)
}

export async function sendSupervisionResponseEmail(
  studentEmail: string,
  studentName: string,
  supervisorName: string,
  action: 'accepted' | 'declined',
  link: string
): Promise<void> {
  const template = emailTemplates.supervisionResponseEmail(studentName, supervisorName, action, link)
  await sendEmail(studentEmail, template.subject, template.html)
}

export async function sendPaperApprovalEmail(
  studentEmail: string,
  studentName: string,
  paperTitle: string,
  link: string
): Promise<void> {
  const template = emailTemplates.paperApprovalEmail(studentName, paperTitle, link)
  await sendEmail(studentEmail, template.subject, template.html)
}

export async function sendPaperRevisionEmail(
  studentEmail: string,
  studentName: string,
  paperTitle: string,
  feedback: string,
  link: string
): Promise<void> {
  const template = emailTemplates.paperRevisionEmail(studentName, paperTitle, feedback, link)
  await sendEmail(studentEmail, template.subject, template.html)
}

export async function sendWorkspaceInvitationEmail(
  toEmail: string,
  inviterName: string,
  workspaceTitle: string,
  role: string,
  link: string
): Promise<void> {
  const template = emailTemplates.workspaceInvitationEmail(inviterName, workspaceTitle, role, link)
  await sendEmail(toEmail, template.subject, template.html)
}

export async function sendAuthorshipClaimEmail(
  toEmail: string,
  userName: string,
  paperTitle: string,
  action: 'approved' | 'rejected',
  link: string
): Promise<void> {
  const template = emailTemplates.authorshipClaimEmail(userName, paperTitle, action, link)
  await sendEmail(toEmail, template.subject, template.html)
}


