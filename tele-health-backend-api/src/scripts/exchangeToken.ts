import { config } from 'dotenv';
import { google } from 'googleapis';

// Load environment variables
config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

async function getToken() {
  try {
    const { tokens } = await oauth2Client.getToken(
      '4/0ASc3gC1wkZaJlvFoEcmkOsDN2oKlAdbsQlJ-RJD6-0l7zCoTJ2DY0gK3D4krCELXyk-I7A&scope=https://www.googleapis.com/auth/calendar'
    );
    console.log('✅ SUCCESS! Here are your tokens:\n');
    console.log(JSON.stringify(tokens, null, 2));
    console.log('\n📋 Copy the refresh_token value above and add it to your .env file');
  } catch (error) {
    console.error('❌ Error getting tokens:', error);
  }
}

getToken();
