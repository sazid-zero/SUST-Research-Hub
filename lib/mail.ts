
/**
 * Simulated email sending utility.
 * In production, you would use Resend, Amazon SES, or Nodemailer.
 */
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
    console.log(`--- EMAIL SENT ---`)
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Content: ${text}`)
    console.log(`------------------`)
    
    // If you have RESEND_API_KEY in process.env, you can implement real sending here.
    return { success: true }
}
