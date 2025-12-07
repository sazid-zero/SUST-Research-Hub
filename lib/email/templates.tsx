export const emailTemplates = {
  registrationPendingEmail: (fullName: string) => ({
    subject: 'Registration Received - Pending Approval',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Registration Received!</h1>
            </div>
            <div class="content">
              <h2>Hello ${fullName},</h2>
              <p>Thank you for registering with the Research Hub. Your account has been created and is currently <strong>pending admin approval</strong>.</p>
              
              <h3>What happens next?</h3>
              <ul>
                <li>Our admin team will review your registration</li>
                <li>You'll receive an email notification once your account is approved</li>
                <li>After approval, you can log in and start using the system</li>
              </ul>
              
              <p>This process typically takes 1-2 business days. If you have any questions, please contact our support team.</p>
              
              <p>Best regards,<br>Research Hub Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  approvalEmail: (fullName: string, loginUrl: string) => ({
    subject: 'Account Approved - Welcome to Research Hub!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Account Approved!</h1>
            </div>
            <div class="content">
              <h2>Congratulations ${fullName}!</h2>
              <p>Your account has been <strong>approved</strong> by our admin team. You can now access all features of the Research Hub.</p>
              
              <div style="text-align: center;">
                <a href="${loginUrl}" class="button">Login to Your Account</a>
              </div>
              
              <h3>Getting Started:</h3>
              <ul>
                <li>Complete your profile information</li>
                <li>Browse available theses</li>
                <li>Start your research journey</li>
              </ul>
              
              <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
              
              <p>Welcome aboard!<br>Research Hub Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  rejectionEmail: (fullName: string, reason: string, reapplyUrl: string) => ({
    subject: 'Registration Update - Action Required',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .reason-box { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Registration Update</h1>
            </div>
            <div class="content">
              <h2>Hello ${fullName},</h2>
              <p>Thank you for your interest in the Research Hub. Unfortunately, we are unable to approve your registration at this time.</p>
              
              <div class="reason-box">
                <strong>Reason:</strong><br>
                ${reason}
              </div>
              
              <p>If you believe this was an error or you have addressed the issue, you're welcome to register again.</p>
              
              <div style="text-align: center;">
                <a href="${reapplyUrl}" class="button">Register Again</a>
              </div>
              
              <p>If you have questions, please contact our support team for assistance.</p>
              
              <p>Best regards,<br>Research Hub Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  adminNotificationEmail: (
    userName: string,
    userEmail: string,
    userRole: string,
    dashboardUrl: string
  ) => ({
    subject: `New Registration: ${userName} (${userRole})`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New User Registration</h1>
            </div>
            <div class="content">
              <h2>Action Required: New Registration Pending</h2>
              <p>A new user has registered and is awaiting approval.</p>
              
              <div class="info-box">
                <strong>User Details:</strong><br><br>
                <strong>Name:</strong> ${userName}<br>
                <strong>Email:</strong> ${userEmail}<br>
                <strong>Role:</strong> ${userRole}<br>
              </div>
              
              <p>Please review this registration and approve or reject the user's access.</p>
              
              <div style="text-align: center;">
                <a href="${dashboardUrl}" class="button">Review Registration</a>
              </div>
              
              <p><em>Note: Users cannot access the system until their registration is approved.</em></p>
            </div>
            <div class="footer">
              <p>This is an automated admin notification from Research Hub.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
}
