import { config } from 'dotenv';
import sgMail from '@sendgrid/mail';

config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM;

console.log('\n🔍 Email Configuration Check:');
console.log('================================');
console.log('SENDGRID_API_KEY:', SENDGRID_API_KEY ? `${SENDGRID_API_KEY.substring(0, 10)}...` : '❌ NOT SET');
console.log('SENDGRID_FROM_EMAIL:', SENDGRID_FROM_EMAIL || '❌ NOT SET');
console.log('================================\n');

if (!SENDGRID_API_KEY) {
  console.error('❌ SENDGRID_API_KEY is missing!');
  console.error('Please add SENDGRID_API_KEY to your .env file');
  process.exit(1);
}

if (!SENDGRID_FROM_EMAIL) {
  console.error('❌ SENDGRID_FROM_EMAIL is missing!');
  console.error('Please add SENDGRID_FROM_EMAIL to your .env file');
  process.exit(1);
}

// Set API key
sgMail.setApiKey(SENDGRID_API_KEY);

// Test email
const testEmail = process.argv[2] || 'test@example.com';

console.log(`📧 Sending test email to: ${testEmail}`);
console.log(`📧 From: ${SENDGRID_FROM_EMAIL}\n`);

const msg = {
  to: testEmail,
  from: SENDGRID_FROM_EMAIL,
  subject: 'Test Email from Telehealth Platform',
  text: 'This is a test email to verify SendGrid configuration.',
  html: '<p>This is a <strong>test email</strong> to verify SendGrid configuration.</p>',
};

sgMail
  .send(msg)
  .then(([response]) => {
    console.log('✅ Email sent successfully!');
    console.log('Status Code:', response.statusCode);
    console.log('Response Headers:', JSON.stringify(response.headers, null, 2));
  })
  .catch((error) => {
    console.error('❌ Failed to send email:');
    console.error('Error Message:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Body:', JSON.stringify(error.response.body, null, 2));
    }
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    process.exit(1);
  });

