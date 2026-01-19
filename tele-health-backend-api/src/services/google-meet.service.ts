import { google } from 'googleapis';
import { env } from '../config/env';

/**
 * Google Meet service using Google Calendar API
 * Creates real Google Meet links via Calendar API
 */

/**
 * Result of creating a Google Meet link
 */
export interface GoogleMeetResult {
  meetingLink: string;
  calendarEventId: string;
}

/**
 * Creates a Google Calendar event with a Google Meet link
 * @param appointmentId - The appointment ID
 * @param appointmentDate - The appointment date
 * @param startTime - The appointment start time
 * @param endTime - The appointment end time
 * @param patientName - Patient's full name
 * @param physicianName - Physician's full name
 * @returns The Google Meet link and calendar event ID
 */
export async function createGoogleMeetLink(
  appointmentId: number,
  appointmentDate: Date,
  startTime: Date,
  endTime: Date,
  patientName: string,
  physicianName: string,
): Promise<GoogleMeetResult> {
  // Check if OAuth credentials are configured
  if (
    !env.GOOGLE_CLIENT_ID ||
    !env.GOOGLE_CLIENT_SECRET ||
    !env.GOOGLE_REFRESH_TOKEN
  ) {
    throw new Error(
      'Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN in your .env file.',
    );
  }

  try {
    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_REDIRECT_URI || 'http://localhost:3000',
    );

    // Set the refresh token
    oauth2Client.setCredentials({
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
    });

    // Initialize Calendar API
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Create calendar event with Google Meet
    const event = {
      summary: `Tele-Health Consultation: ${patientName} with ${physicianName}`,
      description: `Appointment ID: ${appointmentId}\nPatient: ${patientName}\nPhysician: ${physicianName}`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'UTC',
      },
      conferenceData: {
        createRequest: {
          requestId: `appointment-${appointmentId}-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
      attendees: [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours before
          { method: 'popup', minutes: 15 }, // 15 minutes before
        ],
      },
    };

    console.log('📅 Creating Google Calendar event with Meet link...');

    const response = await calendar.events.insert({
      calendarId: env.GOOGLE_CALENDAR_ID || 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
    });

    const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri;
    const calendarEventId = response.data.id;

    if (!meetLink) {
      throw new Error('Failed to create Google Meet link');
    }

    if (!calendarEventId) {
      throw new Error('Failed to get calendar event ID');
    }

    console.log(`✅ Created Google Meet link: ${meetLink}`);
    console.log(`📅 Calendar Event ID: ${calendarEventId}`);

    return {
      meetingLink,
      calendarEventId,
    };
  } catch (error: any) {
    console.error('❌ Error creating Google Meet link:', {
      message: error?.message,
      code: error?.code,
      appointmentId,
    });

    // Re-throw with more context
    throw new Error(
      `Failed to create Google Meet link: ${error?.message || 'Unknown error'}`,
    );
  }
}

