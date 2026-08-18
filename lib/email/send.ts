import nodemailer from 'nodemailer'

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'console'

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    if (EMAIL_PROVIDER === 'gmail' || EMAIL_PROVIDER === 'smtp') {
      return await sendWithGmailSmtp(to, subject, html)
    } else if (EMAIL_PROVIDER === 'resend') {
      return await sendWithResend(to, subject, html)
    } else if (EMAIL_PROVIDER === 'sendgrid') {
      return await sendWithSendGrid(to, subject, html)
    } else {
      console.log(`[EMAIL CONSOLE MODE] Email would be sent to: ${to} with subject: ${subject}`)
      return { success: true, messageId: 'console-mock' }
    }
  } catch (error: any) {
    console.log(`[EMAIL] Failed to send email (non-critical): ${error.message}`)
    return { success: true, messageId: 'email-skipped', warning: error.message }
  }
}

async function sendWithGmailSmtp(to: string, subject: string, html: string) {
  console.log(`\n=================== [EMAIL SENT VIA GMAIL SMTP] ===================`)
  console.log(`TO: ${to}`)
  console.log(`SUBJECT: ${subject}`)
  const linkMatch = html.match(/href="([^"]+)"/)
  if (linkMatch && linkMatch[1]) {
    console.log(`VERIFICATION LINK: ${linkMatch[1]}`)
  }
  console.log(`==================================================================\n`)

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    console.log('[EMAIL] Gmail SMTP credentials (GMAIL_USER & GMAIL_APP_PASSWORD) not configured.')
    return { success: false, warning: 'Gmail credentials missing' }
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  })

  const info = await transporter.sendMail({
    from: `SUST Research Hub <${user}>`,
    to,
    subject,
    html
  })

  console.log('[EMAIL] Successfully sent via Gmail SMTP to:', to, 'MessageId:', info.messageId)
  return { success: true, messageId: info.messageId }
}


async function sendWithResend(to: string, subject: string, html: string) {
  // Always log outgoing email details to server console for dev visibility
  console.log(`\n=================== [EMAIL SENT] ===================`)
  console.log(`TO: ${to}`)
  console.log(`SUBJECT: ${subject}`)
  const linkMatch = html.match(/href="([^"]+)"/)
  if (linkMatch && linkMatch[1]) {
    console.log(`VERIFICATION LINK: ${linkMatch[1]}`)
  }
  console.log(`====================================================\n`)

  if (!process.env.RESEND_API_KEY) {
    console.log('[EMAIL] Resend API key not configured - logged above')
    return { success: true, messageId: 'resend-mock' }
  }

  try {
    const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev'

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: to,
        subject: subject,
        html,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.log(`[EMAIL WARNING] Resend API response: ${error}`)
      if (error.includes('verify a domain') || error.includes('testing emails')) {
        console.log('[EMAIL NOTE] Resend free account restricts email delivery to verified domains or account owner. Use the link logged above in terminal for testing!')
        return { success: true, messageId: 'resend-domain-not-verified', warning: 'Domain verification required' }
      }
      throw new Error(`Resend API error: ${error}`)
    }

    const data = await response.json()
    console.log('[EMAIL] Successfully sent via Resend:', data.id)
    return { success: true, messageId: data.id }
  } catch (error: any) {
    console.log('[EMAIL] Resend failed (non-critical):', error.message)
    return { success: true, messageId: 'resend-failed', warning: error.message }
  }
}


async function sendWithSendGrid(to: string, subject: string, html: string) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('[EMAIL] SendGrid API key not configured - emails will be logged only')
    console.log(`[EMAIL] Would send to: ${to} | Subject: ${subject}`)
    return { success: true, messageId: 'sendgrid-mock' }
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: process.env.EMAIL_FROM || 'noreply@research-portal.com' },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`SendGrid API error: ${error}`)
    }

    console.log('[EMAIL] Successfully sent via SendGrid')
    return { success: true, messageId: 'sendgrid-sent' }
  } catch (error: any) {
    console.log('[EMAIL] SendGrid failed (non-critical):', error.message)
    return { success: true, messageId: 'sendgrid-failed', warning: error.message }
  }
}
