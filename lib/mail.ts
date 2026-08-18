
import { sendEmail as realSendEmail } from "./email/send"

export async function sendEmail({
    to,
    subject,
    text,
    html
}: {
    to: string
    subject: string
    text: string
    html?: string
}) {
    return await realSendEmail(to, subject, html || `<p>${text}</p>`)
}

