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
