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

  verificationEmail: (fullName: string, verifyUrl: string) => ({
    subject: 'Verify Your SUST Email Address - Research Hub',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 14px 32px; background: #2563eb; color: white; text-decoration: none; font-weight: bold; border-radius: 8px; margin: 20px 0; font-size: 16px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .token-box { background: #e0f2fe; border: 1px border #0284c7; padding: 12px; border-radius: 6px; font-family: monospace; word-break: break-all; margin: 15px 0; font-size: 13px; color: #0369a1; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Welcome to SUST Research Hub</h1>
            </div>
            <div class="content">
              <h2>Hello ${fullName},</h2>
              <p>Thank you for registering with your SUST institutional email address. To complete your account creation and activate your access, please verify your email address below.</p>
              
              <div style="text-align: center;">
                <a href="${verifyUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <div class="token-box">${verifyUrl}</div>
              
              <p>This verification link will expire in 24 hours.</p>
              
              <p>If you did not create an account on SUST Research Hub, please ignore this email.</p>
              
              <p>Best regards,<br>SUST Research Hub Team</p>
            </div>
            <div class="footer">
              <p>Shahjalal University of Science and Technology, Sylhet, Bangladesh</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  supervisionRequestEmail: (supervisorName: string, studentName: string, workspaceTitle: string, proposal: string, link: string) => ({
    subject: `New Supervision Request from ${studentName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 25px; border-radius: 0 0 10px 10px; }
            .box { background: white; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .button { display: inline-block; padding: 12px 25px; background: #4f46e5; color: white; text-decoration: none; font-weight: bold; border-radius: 6px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 25px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 New Supervision Request</h1>
            </div>
            <div class="content">
              <h2>Hello Dr. ${supervisorName},</h2>
              <p><strong>${studentName}</strong> has submitted a new supervision request for their research workspace.</p>
              <div class="box">
                <p><strong>Research Title:</strong> ${workspaceTitle}</p>
                ${proposal ? `<p><strong>Proposal Summary:</strong> ${proposal}</p>` : ''}
              </div>
              <div style="text-align: center;">
                <a href="${link}" class="button">Review Supervision Request</a>
              </div>
              <p>Best regards,<br>SUST Research Hub Team</p>
            </div>
            <div class="footer"><p>SUST Research Hub</p></div>
          </div>
        </body>
      </html>
    `,
  }),

  supervisionResponseEmail: (studentName: string, supervisorName: string, action: 'accepted' | 'declined', link: string) => ({
    subject: `Supervision Request ${action === 'accepted' ? 'Accepted' : 'Declined'} by Dr. ${supervisorName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${action === 'accepted' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'}; color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 25px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 25px; background: ${action === 'accepted' ? '#059669' : '#4f46e5'}; color: white; text-decoration: none; font-weight: bold; border-radius: 6px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 25px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${action === 'accepted' ? '🎉 Supervision Accepted!' : 'Supervision Status Update'}</h1>
            </div>
            <div class="content">
              <h2>Hello ${studentName},</h2>
              <p>Dr. <strong>${supervisorName}</strong> has <strong>${action}</strong> your research supervision request.</p>
              ${action === 'accepted' ? '<p>Congratulations! You can now collaborate and progress with your research workspace.</p>' : '<p>You can select another supervisor from the research hub.</p>'}
              <div style="text-align: center;">
                <a href="${link}" class="button">View Research Workspace</a>
              </div>
              <p>Best regards,<br>SUST Research Hub Team</p>
            </div>
            <div class="footer"><p>SUST Research Hub</p></div>
          </div>
        </body>
      </html>
    `,
  }),

  paperApprovalEmail: (studentName: string, paperTitle: string, link: string) => ({
    subject: `Congratulations! Your Paper Has Been Approved & Published`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 25px; border-radius: 0 0 10px 10px; }
            .box { background: white; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .button { display: inline-block; padding: 12px 25px; background: #059669; color: white; text-decoration: none; font-weight: bold; border-radius: 6px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 25px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Paper Approved & Published!</h1>
            </div>
            <div class="content">
              <h2>Hello ${studentName},</h2>
              <p>Great news! Your submitted paper has been reviewed and officially approved by the admin team.</p>
              <div class="box">
                <p><strong>Title:</strong> ${paperTitle}</p>
              </div>
              <p>It is now publicly visible in the SUST Research Hub publications repository.</p>
              <div style="text-align: center;">
                <a href="${link}" class="button">View Published Paper</a>
              </div>
              <p>Best regards,<br>SUST Research Hub Team</p>
            </div>
            <div class="footer"><p>SUST Research Hub</p></div>
          </div>
        </body>
      </html>
    `,
  }),

  paperRevisionEmail: (studentName: string, paperTitle: string, feedback: string, link: string) => ({
    subject: `Action Required: Paper Revision Requested`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 25px; border-radius: 0 0 10px 10px; }
            .box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 15px 0; }
            .button { display: inline-block; padding: 12px 25px; background: #d97706; color: white; text-decoration: none; font-weight: bold; border-radius: 6px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 25px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✏️ Revision Requested</h1>
            </div>
            <div class="content">
              <h2>Hello ${studentName},</h2>
              <p>Your paper <strong>"${paperTitle}"</strong> requires revision before it can be published.</p>
              <div class="box">
                <strong>Admin Feedback:</strong><br>
                ${feedback}
              </div>
              <p>Please update your paper according to the feedback and resubmit.</p>
              <div style="text-align: center;">
                <a href="${link}" class="button">Revise & Resubmit Paper</a>
              </div>
              <p>Best regards,<br>SUST Research Hub Team</p>
            </div>
            <div class="footer"><p>SUST Research Hub</p></div>
          </div>
        </body>
      </html>
    `,
  }),

  workspaceInvitationEmail: (inviterName: string, workspaceTitle: string, role: string, link: string) => ({
    subject: `You've been invited to join ${workspaceTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 25px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 25px; background: #2563eb; color: white; text-decoration: none; font-weight: bold; border-radius: 6px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 25px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🤝 Research Workspace Invitation</h1>
            </div>
            <div class="content">
              <p><strong>${inviterName}</strong> invited you to collaborate as a <strong>${role}</strong> on the research workspace:</p>
              <h3>${workspaceTitle}</h3>
              <div style="text-align: center;">
                <a href="${link}" class="button">Join Workspace</a>
              </div>
              <p>Best regards,<br>SUST Research Hub Team</p>
            </div>
            <div class="footer"><p>SUST Research Hub</p></div>
          </div>
        </body>
      </html>
    `,
  }),

  authorshipClaimEmail: (userName: string, paperTitle: string, action: 'approved' | 'rejected', link: string) => ({
    subject: `Authorship Claim ${action === 'approved' ? 'Approved' : 'Rejected'}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${action === 'approved' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'}; color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 25px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 25px; background: #2563eb; color: white; text-decoration: none; font-weight: bold; border-radius: 6px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 25px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Authorship Claim Update</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>Your claim of authorship for <strong>"${paperTitle}"</strong> has been <strong>${action}</strong> by the admin team.</p>
              <div style="text-align: center;">
                <a href="${link}" class="button">View Paper</a>
              </div>
              <p>Best regards,<br>SUST Research Hub Team</p>
            </div>
            <div class="footer"><p>SUST Research Hub</p></div>
          </div>
        </body>
      </html>
    `,
  }),
}


