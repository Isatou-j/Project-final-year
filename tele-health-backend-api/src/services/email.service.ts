//import nodemailer from 'nodemailer';
import { Resend } from 'resend';
const resend = new Resend(process.env.Resend_API_KEY);
/**const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});*/

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Generic email sender with code
export async function sendEmail({
  to,
  subject,
  text,
  code,
  expiresAt,
}: {
  to: string;
  subject: string;
  text: string;
  code: string;
  expiresAt?: string;
}) {
  await resend.emails.send({
    from: `"Telehealth Platform" <${process.env.RESEND_FROM_EMAIL}>`,
    to,
    subject,
    html: `
      <div style="max-width: 500px; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #eaeaea; border-radius: 10px; background-color: #ffffff;">
      <h2 style="color: #2c3e50; text-align: center;">Verify Your Email</h2>
      <p style="font-size: 16px; color: #555;">
        Hi there,<br/><br/>
        Your <strong>Telehealth Platform</strong> ${text} is:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; padding: 14px 24px; font-size: 28px; font-weight: bold; letter-spacing: 4px; background-color: #f0f0f0; border-radius: 8px; color: #333;">
          ${code}
        </span>
      </div>
      <p style="font-size: 14px; color: #888; text-align: center;">
        This code is valid for the next <strong>${expiresAt}</strong>.<br/>
        Please do not share this code with anyone.
      </p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #aaa; text-align: center;">
        You received this email because you're signing in to Telehealth Platform. If this wasn't you, you can ignore this message.
      </p>
    </div>
    `,
    text: `Your Telehealth Platform ${text} is: ${code}. This code is valid for the next ${expiresAt}. Please do not share this code with anyone.`,
  });
}

// Email Verification
export const sendVerificationEmail = async (
  email: string,
  userId: string,
  token: string,
) => {
  try {
    const verificationUrl = `${FRONTEND_URL}/verify-email?userId=${userId}&token=${token}`;

    const mailOptions = {
      from: `Telehealth Platform <${process.env.RESEND_FROM_EMAIL!}>`,
      to: email,
      subject: 'Verify Your Email - Telehealth Platform',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #4F46E5;
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .button {
              display: inline-block;
              background-color: #4F46E5;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
              text-align: center;
            }
            .info-box {
              background-color: #FEF3C7;
              padding: 15px;
              border-left: 4px solid #F59E0B;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Telehealth Platform</h1>
            </div>
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>Thank you for registering with our telehealth platform. To complete your registration and start using our services, please verify your email address.</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #4F46E5; font-size: 14px;">${verificationUrl}</p>
              
              <div class="info-box">
                <strong>⏰ Important:</strong> This link will expire in 24 hours.
              </div>
              
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Telehealth Platform. All rights reserved.</p>
              <p>If you have questions, contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Telehealth Platform!
        
        Thank you for registering. Please verify your email address by clicking the link below:
        
        ${verificationUrl}
        
        This link will expire in 24 hours.
        
        If you didn't create an account, please ignore this email.
        
        © ${new Date().getFullYear()} Telehealth Platform. All rights reserved.
      `,
    };

    const {data, error } = await resend.emails.send(mailOptions);
    console.log('✅ Verification email sent successfully:', data?.id);
    return { success: true, messageId: data?.id};
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Password Reset Email
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
) => {
  try {
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `Telehealth Platform <${process.env.RESEND_FROM_EMAIL!}>`,
      to: email,
      subject: 'Reset Your Password - Telehealth Platform',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #4F46E5;
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .button {
              display: inline-block;
              background-color: #4F46E5;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
            }
            .warning-box {
              background-color: #FEF3C7;
              padding: 15px;
              border-left: 4px solid #F59E0B;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #4F46E5; font-size: 14px;">${resetUrl}</p>
              
              <div class="warning-box">
                <strong>⚠️ Security Notice:</strong><br>
                This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
              </div>
              
              <p>For security reasons, this link can only be used once.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Telehealth Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request
        
        We received a request to reset your password. Click the link below to create a new password:
        
        ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request a password reset, please ignore this email.
        
        © ${new Date().getFullYear()} Telehealth Platform. All rights reserved.
      `,
    };

    const {data, error }  = await resend.emails.send(mailOptions);
    console.log('✅ Password reset email sent successfully:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Welcome Email Template
const getWelcomeEmailTemplate = (userName: string, role: string) => {
  const roleSpecific = {
    PATIENT: {
      icon: '',
      features: [
        '<li><span class="icon"></span><strong>Find Doctors:</strong> Search and book appointments with qualified physicians</li>',
        '<li><span class="icon"></span><strong>Manage Appointments:</strong> Schedule, reschedule, or cancel appointments easily</li>',
        '<li><span class="icon"></span><strong>Video Consultations:</strong> Connect with doctors from anywhere</li>',
        '<li><span class="icon"></span><strong>Medical Records:</strong> Store and access your health documents securely</li>',
        '<li><span class="icon"></span><strong>Prescriptions:</strong> View and download your prescriptions</li>',
        '<li><span class="icon"></span><strong>Reviews:</strong> Rate and review your healthcare providers</li>',
      ],
      tips: `
        <ol>
          <li><strong>Complete your profile</strong> - Add your medical history and emergency contact</li>
          <li><strong>Search for doctors</strong> - Find specialists based on your needs</li>
          <li><strong>Book your first appointment</strong> - Choose a convenient time slot</li>
          <li><strong>Upload medical records</strong> - Keep your health documents organized</li>
        </ol>
      `,
      dashboardLink: `${FRONTEND_URL}/patient/dashboard`,
    },
    PHYSICIAN: {
      icon: '',
      features: [
        '<li><span class="icon"></span><strong>Manage Schedule:</strong> Set your availability and consultation hours</li>',
        '<li><span class="icon"></span><strong>Patient Management:</strong> Access patient history and medical records</li>',
        '<li><span class="icon"></span><strong>Conduct Consultations:</strong> Provide care through video/audio calls</li>',
        '<li><span class="icon"></span><strong>Write Prescriptions:</strong> Generate digital prescriptions instantly</li>',
        '<li><span class="icon"></span><strong>Track Earnings:</strong> Monitor your consultation fees and payments</li>',
        '<li><span class="icon"></span><strong>View Analytics:</strong> Insights into your practice performance</li>',
      ],
      tips: `
        <div class="warning-box" style="background-color: #FEF3C7; padding: 15px; border-left: 4px solid #F59E0B; margin: 20px 0; border-radius: 4px;">
          <strong>Account Under Review:</strong> Your account is currently pending admin approval. You'll receive an email notification once your credentials are verified and your account is activated.
        </div>
        <p><strong>What happens next?</strong></p>
        <ol>
          <li>Our team will review your credentials and license information</li>
          <li>You'll receive an approval notification within 24-48 hours</li>
          <li>Once approved, you can start accepting appointments</li>
          <li>Set up your availability schedule and consultation fees</li>
        </ol>
      `,
      dashboardLink: `${FRONTEND_URL}/physician/dashboard`,
    },
    ADMIN: {
      icon: '',
      features: [
        '<li><span class="icon"></span><strong>Physician Management:</strong> Review and approve physician registrations</li>',
        '<li><span class="icon"></span><strong>User Management:</strong> Monitor and manage all platform users</li>',
        '<li><span class="icon"></span><strong>Analytics Dashboard:</strong> View platform statistics and metrics</li>',
        '<li><span class="icon"></span><strong>Payment Management:</strong> Track transactions and revenue</li>',
        '<li><span class="icon"></span><strong>Service Management:</strong> Add and manage medical services</li>',
        '<li><span class="icon"></span><strong>System Settings:</strong> Configure platform settings and fees</li>',
      ],
      tips: `
        <ol>
          <li><strong>Review pending physicians</strong> - Approve or reject new doctor registrations</li>
          <li><strong>Monitor appointments</strong> - Ensure smooth platform operations</li>
          <li><strong>Check analytics</strong> - Review platform performance metrics</li>
          <li><strong>Manage services</strong> - Add or update available medical services</li>
        </ol>
      `,
      dashboardLink: `${FRONTEND_URL}/admin/dashboard`,
    },
  };

  const config =
    roleSpecific[role as keyof typeof roleSpecific] || roleSpecific.PATIENT;

  return {
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .header {
            background-color: #4F46E5;
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .welcome-message {
            color: #333;
            line-height: 1.6;
          }
          .feature-box {
            background-color: #EEF2FF;
            padding: 20px;
            margin: 20px 0;
            border-radius: 6px;
            border-left: 4px solid #4F46E5;
          }
          .button {
            display: inline-block;
            background-color: #4F46E5;
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
          }
          .tips-section {
            background-color: #F0FDF4;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border-left: 4px solid #10B981;
          }
          .warning-box {
            background-color: #FEF3C7;
            padding: 15px;
            border-left: 4px solid #F59E0B;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
          }
          .icon {
            font-size: 18px;
            margin-right: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Telehealth Platform!</h1>
          </div>
          <div class="content">
            <div class="welcome-message">
              <h2>Hi ${userName},</h2>
              <p>Thank you for joining our telehealth platform! Your account has been successfully created as a <strong>${role === 'PHYSICIAN' ? 'Physician' : role === 'ADMIN' ? 'Administrator' : 'Patient'}</strong>.</p>
              
              <div class="feature-box">
                <h3>What you can do:</h3>
                <ul style="list-style: none; padding-left: 0;">
                  ${config.features.join('')}
                </ul>
              </div>
              
              <div class="tips-section">
                <h3>Getting Started:</h3>
                ${config.tips}
              </div>
              
              ${
                role !== 'PHYSICIAN'
                  ? `
              <div style="text-align: center;">
                <a href="${config.dashboardLink}" class="button">Go to Dashboard</a>
              </div>
              `
                  : ''
              }
              
              <p>Need help? Our support team is here to assist you with any questions about using the platform.</p>
              
              <p>Welcome aboard!<br>
              <strong>The Telehealth Platform Team</strong></p>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Telehealth Platform. All rights reserved.</p>
            <p>Questions? Reply to this email or visit our help center</p>
            <p>If you didn't create this account, please contact our support team immediately.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Telehealth Platform!
      
      Hi ${userName},
      
      Thank you for joining our telehealth platform! Your account has been successfully created as a ${role === 'PHYSICIAN' ? 'Physician' : role === 'ADMIN' ? 'Administrator' : 'Patient'}.
      
      ${role === 'PHYSICIAN' ? 'Account Under Review: Your account is currently pending admin approval. You will receive an email notification once your credentials are verified.' : ''}
      
      Need help? Our support team is here to assist you.
      
      Welcome aboard!
      The Telehealth Platform Team

      © ${new Date().getFullYear()} Telehealth Platform. All rights reserved.
    `,
  };
};

// Send Welcome Email
export const sendWelcomeEmail = async (
  email: string,
  userName: string,
  role: string = 'PATIENT',
) => {
  try {
    const emailTemplate = getWelcomeEmailTemplate(userName, role);

    const mailOptions = {
      from: `Telehealth Platform <${process.env.RESEND_FROM_EMAIL!}>`,
      to: email,
      subject: `Welcome to Telehealth Platform - Your ${role === 'PHYSICIAN' ? 'Physician' : role === 'ADMIN' ? 'Admin' : 'Patient'} Account is Ready!`,
      html: emailTemplate.html,
      text: emailTemplate.text,
    };

    const {data, error }  = await resend.emails.send(mailOptions);
    console.log('✅ Welcome email sent successfully:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};

// Physician Approval Email
export const sendPhysicianApprovalEmail = async (
  email: string,
  physicianName: string,
  approved: boolean,
) => {
  try {
    const dashboardUrl = `${FRONTEND_URL}/physician/dashboard`;
    const subject = approved
      ? 'Your Physician Account Has Been Approved!'
      : 'Update on Your Physician Application';

    const mailOptions = {
      from: `Telehealth Platform <${process.env.RESEND_FROM_EMAIL!}>`,
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: ${approved ? '#10B981' : '#EF4444'};
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .button {
              display: inline-block;
              background-color: #4F46E5;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
            }
            .success-box {
              background-color: #D1FAE5;
              padding: 20px;
              border-left: 4px solid #10B981;
              margin: 20px 0;
              border-radius: 4px;
            }
            .info-box {
              background-color: #EEF2FF;
              padding: 20px;
              border-left: 4px solid #4F46E5;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${approved ? 'Account Approved!' : 'Application Update'}</h1>
            </div>
            <div class="content">
              <h2>Dear Dr. ${physicianName},</h2>
              
              ${
                approved
                  ? `
                <div class="success-box">
                  <p>Great news! Your physician account has been approved and verified. You can now start offering consultations to patients on our platform.</p>
                </div>
                
                <div style="text-align: center;">
                  <a href="${dashboardUrl}" class="button">Access Your Dashboard</a>
                </div>
                
                <div class="info-box">
                  <h3>Next Steps:</h3>
                  <ol>
                    <li><strong>Set Your Availability:</strong> Configure your consultation schedule and working hours</li>
                    <li><strong>Complete Your Profile:</strong> Add your bio, specialization details, and profile photo</li>
                    <li><strong>Set Consultation Fees:</strong> Define your consultation charges</li>
                    <li><strong>Start Accepting Appointments:</strong> Patients can now book appointments with you</li>
                  </ol>
                </div>
                
                <p>We're excited to have you as part of our healthcare provider network. Together, we're making healthcare more accessible!</p>
              `
                  : `
                <p>Thank you for your interest in joining our telehealth platform as a healthcare provider.</p>
                
                <p>After careful review of your application and credentials, we are unable to approve your physician account at this time. This decision may be due to:</p>
                
                <ul>
                  <li>Incomplete or unverifiable credentials</li>
                  <li>License verification issues</li>
                  <li>Missing required documentation</li>
                </ul>
                
                <p>If you believe this decision was made in error or would like to discuss your application, please contact our support team. We're happy to review additional documentation or clarify any concerns.</p>
              `
              }
              
              <p>If you have any questions, our support team is here to help.</p>
              
              <p>Best regards,<br>
              <strong>The Telehealth Platform Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Telehealth Platform. All rights reserved.</p>
              <p>Need assistance? Contact support@telehealth.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        ${approved ? 'Account Approved!' : 'Application Update'}
        
        Dear Dr. ${physicianName},
        
        ${
          approved
            ? `
          Great news! Your physician account has been approved and verified.
          
          Next Steps:
          1. Set your availability and consultation schedule
          2. Complete your profile with bio and specialization
          3. Set your consultation fees
          4. Start accepting appointments
          
          Access your dashboard: ${dashboardUrl}
        `
            : `
          Thank you for your interest in joining our platform.
          
          After careful review, we are unable to approve your account at this time.
          
          If you believe this is an error, please contact our support team.
        `
        }
        
        © ${new Date().getFullYear()} Telehealth Platform. All rights reserved.
      `,
    };

    const {data, error }  = await resend.emails.send(mailOptions);
    console.log(
      '✅ Physician approval email sent successfully:',
      data?.id,
    );
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('❌ Failed to send physician approval email:', error);
    throw new Error('Failed to send physician approval email');
  }
};

// Appointment Confirmation Email
export const sendAppointmentConfirmationEmail = async (
  email: string,
  patientName: string,
  physicianName: string,
  appointmentDate: Date,
  appointmentTime: string,
  appointmentType: string = 'VIDEO',
  meetingLink?: string,
) => {
  try {
    const appointmentUrl =
      meetingLink || `${FRONTEND_URL}/patient/appointments`;

    const mailOptions = {
      from: `Telehealth Platform <${process.env.RESEND_FROM_EMAIL!}>`,
      to: email,
      subject: 'Appointment Confirmed - Telehealth Platform',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #10B981;
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .appointment-card {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 25px;
              border-radius: 8px;
              margin: 20px 0;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .detail-row {
              display: flex;
              padding: 10px 0;
              border-bottom: 1px solid rgba(255, 255, 255, 0.3);
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .detail-label {
              font-weight: bold;
              margin-right: 10px;
              min-width: 120px;
            }
            .button {
              display: inline-block;
              background-color: #4F46E5;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
              text-align: center;
            }
            .info-box {
              background-color: #EEF2FF;
              padding: 20px;
              border-left: 4px solid #4F46E5;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Appointment Confirmed</h1>
            </div>
            <div class="content">
              <h2>Dear ${patientName},</h2>
              <p>Your appointment has been successfully scheduled. We look forward to providing you with quality healthcare.</p>
              
              <div class="appointment-card">
                <h3 style="margin-top: 0; font-size: 20px;">Appointment Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Doctor:</span>
                  <span>Dr. ${physicianName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span>${appointmentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span>${appointmentTime}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Type:</span>
                  <span>${appointmentType === 'VIDEO' ? 'Video Consultation' : appointmentType === 'AUDIO' ? 'Audio Call' : 'Chat'}</span>
                </div>
              </div>
              
              ${
                meetingLink
                  ? `
              <div style="text-align: center;">
                <a href="${meetingLink}" class="button">Join Consultation</a>
              </div>
              `
                  : ''
              }
              
              <div class="info-box">
                <h3>Important Reminders:</h3>
                <ul>
                  <li>You will receive a reminder 24 hours before your appointment</li>
                  <li>Please ensure you have a stable internet connection for video consultations</li>
                  <li>Have your medical records and any relevant documents ready</li>
                  <li>Join the consultation 5 minutes early to test your connection</li>
                  <li>If you need to reschedule or cancel, please do so at least 2 hours in advance</li>
                </ul>
              </div>
              
              <p>To view or manage your appointments, visit your dashboard:</p>
              <div style="text-align: center;">
                <a href="${appointmentUrl}" class="button">View Appointments</a>
              </div>
              
              <p>If you have any questions or concerns before your appointment, feel free to contact our support team.</p>
              
              <p>Stay healthy!<br>
              <strong>The Telehealth Platform Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Telehealth Platform. All rights reserved.</p>
              <p>Need to reschedule? Visit your appointments page or contact support</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
         Appointment Confirmed
        
        Dear ${patientName},
        
        Your appointment has been successfully scheduled.
        
         Appointment Details:
        
         Doctor: Dr. ${physicianName}
         Date: ${appointmentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
         Time: ${appointmentTime}
         Type: ${appointmentType === 'VIDEO' ? 'Video Consultation' : appointmentType === 'AUDIO' ? 'Audio Call' : 'Chat'}

        ${meetingLink ? `Join your consultation: ${meetingLink}` : ''}
        
        Important Reminders:
        • You will receive a reminder 24 hours before your appointment
        • Ensure stable internet connection for video consultations
        • Have your medical records ready
        • Join 5 minutes early to test your connection
        
        View your appointments: ${appointmentUrl}
        
        Stay healthy!
        The Telehealth Platform Team
        
        © ${new Date().getFullYear()} Telehealth Platform. All rights reserved.
      `,
    };

    const {data, error} = await resend.emails.send(mailOptions);
    console.log(
      '✅ Appointment confirmation email sent successfully:',
      data?.id,
    );
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('❌ Failed to send appointment confirmation email:', error);
    throw new Error('Failed to send appointment confirmation email');
  }
};

// Appointment Reminder Email (24 hours before)
export const sendAppointmentReminderEmail = async (
  email: string,
  patientName: string,
  physicianName: string,
  appointmentDate: Date,
  appointmentTime: string,
  meetingLink?: string,
) => {
  try {
    const mailOptions = {
      from:`Telehealth Platform <${process.env.RESEND_FROM_EMAIL!}>`,
      to: email,
      subject: 'Reminder: Your Appointment is Tomorrow',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #F59E0B;
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .reminder-box {
              background-color: #FEF3C7;
              padding: 20px;
              border-left: 4px solid #F59E0B;
              margin: 20px 0;
              border-radius: 4px;
            }
            .button {
              display: inline-block;
              background-color: #4F46E5;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Appointment Reminder</h1>
            </div>
            <div class="content">
              <h2>Hi ${patientName},</h2>
              
              <div class="reminder-box">
                <p style="margin: 0; font-size: 18px;"><strong>Your appointment is tomorrow!</strong></p>
              </div>
              
              <p><strong>👨‍⚕️ Doctor:</strong> Dr. ${physicianName}</p>
              <p><strong>📆 Date:</strong> ${appointmentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>⏰ Time:</strong> ${appointmentTime}</p>
              
              ${
                meetingLink
                  ? `
              <div style="text-align: center;">
                <a href="${meetingLink}" class="button">Join Consultation</a>
              </div>
              `
                  : ''
              }
              
              <p><strong>📋 Checklist:</strong></p>
              <ul>
                <li>✅ Test your internet connection</li>
                <li>✅ Prepare your medical questions</li>
                <li>✅ Have your medical records ready</li>
                <li>✅ Find a quiet, well-lit space</li>
              </ul>
              
              <p>See you soon!</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Telehealth Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
         Appointment Reminder
        
        Hi ${patientName},
        
        Your appointment is tomorrow!
        
         Doctor: Dr. ${physicianName}
         Date: ${appointmentDate.toLocaleDateString()}
         Time: ${appointmentTime}
        
        ${meetingLink ? `Join: ${meetingLink}` : ''}
        
        Checklist:
        - Test your internet connection
        - Prepare your medical questions
        - Have your medical records ready

        See you soon!
      `,
    };

    const {data, error} = await resend.emails.send(mailOptions);
    console.log(
      '✅ Appointment reminder email sent successfully:',
      data?.id,
    );
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('❌ Failed to send appointment reminder email:', error);
    throw new Error('Failed to send appointment reminder email');
  }
};

// Appointment Cancellation Email
export const sendAppointmentCancellationEmail = async (
  email: string,
  patientName: string,
  physicianName: string,
  appointmentDate: Date,
  appointmentTime: string,
  cancelledBy: 'patient' | 'physician' | 'admin',
) => {
  try {
    const mailOptions = {
      from: `Telehealth Platform <${process.env.RESEND_FROM_EMAIL!}>`,
      to: email,
      subject: 'Appointment Cancelled - Telehealth Platform',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #EF4444;
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .button {
              display: inline-block;
              background-color: #4F46E5;
              color: white;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Appointment Cancelled</h1>
            </div>
            <div class="content">
              <h2>Dear ${patientName},</h2>
              <p>Your appointment has been cancelled.</p>
              
              <p><strong>👨‍⚕️ Doctor:</strong> Dr. ${physicianName}</p>
              <p><strong>📆 Date:</strong> ${appointmentDate.toLocaleDateString()}</p>
              <p><strong>⏰ Time:</strong> ${appointmentTime}</p>
              <p><strong>Cancelled by:</strong> ${cancelledBy === 'patient' ? 'You' : cancelledBy === 'physician' ? 'Doctor' : 'Administrator'}</p>
              
              <p>You can book a new appointment at your convenience.</p>
              
              <div style="text-align: center;">
                <a href="${FRONTEND_URL}/patient/find-doctors" class="button">Book New Appointment</a>
              </div>
              
              <p>If you have any questions, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Telehealth Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        ❌ Appointment Cancelled
        
        Dear ${patientName},
        
        Your appointment has been cancelled.
        
        Doctor: Dr. ${physicianName}
        Date: ${appointmentDate.toLocaleDateString()}
        Time: ${appointmentTime}
        Cancelled by: ${cancelledBy === 'patient' ? 'You' : cancelledBy === 'physician' ? 'Doctor' : 'Administrator'}
        
        Book a new appointment: ${FRONTEND_URL}/patient/find-doctors
        
        © ${new Date().getFullYear()} Telehealth Platform. All rights reserved.
      `,
    };

    const {data, error} = await resend.emails.send(mailOptions);
    console.log(
      '✅ Appointment cancellation email sent successfully:',
      data?.id,
    );
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('❌ Failed to send appointment cancellation email:', error);
    throw new Error('Failed to send appointment cancellation email');
  }
};
