import { config } from 'dotenv';
import axios from 'axios';

config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

if (!SENDGRID_API_KEY) {
  console.error('❌ SENDGRID_API_KEY is not set');
  process.exit(1);
}

async function checkSendGridActivity() {
  try {
    console.log('\n🔍 Checking SendGrid Activity...\n');

    // Get recent email activity (last 10 emails)
    const response = await axios.get(
      'https://api.sendgrid.com/v3/messages',
      {
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
        },
        params: {
          limit: 10,
        },
      },
    );

    console.log('📧 Recent Email Activity:');
    console.log('================================\n');

    if (response.data.messages && response.data.messages.length > 0) {
      response.data.messages.forEach((msg: any, index: number) => {
        console.log(`${index + 1}. Email ID: ${msg.msg_id}`);
        console.log(`   From: ${msg.from_email}`);
        console.log(`   To: ${msg.to_email}`);
        console.log(`   Subject: ${msg.subject}`);
        console.log(`   Status: ${msg.status}`);
        console.log(`   Last Event: ${msg.last_event_time || 'N/A'}`);
        console.log(`   Opens: ${msg.opens_count || 0}`);
        console.log(`   Clicks: ${msg.clicks_count || 0}`);
        console.log('');
      });
    } else {
      console.log('No recent emails found.');
    }

    // Check suppression lists
    console.log('\n📋 Checking Suppression Lists...\n');
    const suppressionsResponse = await axios.get(
      'https://api.sendgrid.com/v3/suppression/bounces',
      {
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
        },
        params: {
          limit: 10,
        },
      },
    );

    if (suppressionsResponse.data && suppressionsResponse.data.length > 0) {
      console.log('⚠️  Bounced Emails:');
      suppressionsResponse.data.forEach((bounce: any) => {
        console.log(`   - ${bounce.email}: ${bounce.reason}`);
      });
    } else {
      console.log('✅ No bounced emails found.');
    }

    // Check spam reports
    const spamResponse = await axios.get(
      'https://api.sendgrid.com/v3/suppression/spam_reports',
      {
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
        },
        params: {
          limit: 10,
        },
      },
    );

    if (spamResponse.data && spamResponse.data.length > 0) {
      console.log('\n⚠️  Spam Reports:');
      spamResponse.data.forEach((spam: any) => {
        console.log(`   - ${spam.email}: Reported as spam on ${spam.created}`);
      });
    } else {
      console.log('\n✅ No spam reports found.');
    }

    console.log('\n💡 Tips:');
    console.log('1. Check your email spam folder');
    console.log('2. Verify the sender email is authenticated in SendGrid');
    console.log('3. Check SendGrid Activity Feed in dashboard for more details');
    console.log('4. Make sure your domain/email is verified in SendGrid\n');
  } catch (error: any) {
    if (error.response) {
      console.error('❌ SendGrid API Error:');
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

checkSendGridActivity();

