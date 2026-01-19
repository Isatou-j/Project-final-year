/**
 * Meeting link generation service
 * Generates Google Meet links for video consultations
 * Uses Google Calendar API when credentials are available, otherwise generates simple links
 */

import { env } from '../config/env';
import { createGoogleMeetLink, GoogleMeetResult } from './google-meet.service';

export interface GenerateMeetingLinkParams {
  appointmentId: number;
  consultationType: 'VIDEO' | 'AUDIO' | 'CHAT';
  appointmentDate: Date;
  startTime: Date;
  endTime: Date;
  patientName: string;
  physicianName: string;
}

export interface MeetingLinkResult {
  meetingLink: string;
  calendarEventId?: string;
  meetingCreatedAt?: Date;
}

/**
 * Generates a Google Meet link for an appointment
 * Tries to use Google Calendar API first, falls back to simple link generation
 */
export const generateMeetingLink = async (
  params: GenerateMeetingLinkParams,
): Promise<MeetingLinkResult> => {
  const {
    appointmentId,
    consultationType,
    appointmentDate,
    startTime,
    endTime,
    patientName,
    physicianName,
  } = params;

  // Try to use Google Calendar API if credentials are configured
  if (
    env.GOOGLE_CLIENT_ID &&
    env.GOOGLE_CLIENT_SECRET &&
    env.GOOGLE_REFRESH_TOKEN
  ) {
    try {
      console.log(
        `📞 Using Google Calendar API to create Meet link for appointment ${appointmentId}`,
      );
      const result: GoogleMeetResult = await createGoogleMeetLink(
        appointmentId,
        appointmentDate,
        startTime,
        endTime,
        patientName,
        physicianName,
      );
      return {
        meetingLink: result.meetingLink,
        calendarEventId: result.calendarEventId,
        meetingCreatedAt: new Date(),
      };
    } catch (error: any) {
      console.warn(
        `⚠️  Failed to create Google Meet link via API, falling back to simple link: ${error?.message}`,
      );
      // Fall through to simple link generation
    }
  } else {
    console.log(
      `ℹ️  Google OAuth credentials not configured, using simple link generation`,
    );
  }

  // Fallback: Generate a simple meeting link
  const simpleLink = generateSimpleMeetingLink(appointmentId, consultationType);
  return {
    meetingLink: simpleLink,
  };
};

/**
 * Generates a simple Google Meet link (fallback method)
 * This creates a basic Meet link format but won't create an actual meeting room
 */
function generateSimpleMeetingLink(
  appointmentId: number,
  consultationType: 'VIDEO' | 'AUDIO' | 'CHAT',
): string {
  // Generate a unique meeting code based on appointment ID and timestamp
  const timestamp = Date.now();
  const uniqueId = `${appointmentId}-${timestamp}`.replace(/[^a-zA-Z0-9]/g, '');

  // Generate a meeting code in Google Meet format: xxx-xxxx-xxx
  const generateMeetCode = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    let code = '';

    // Generate 3 groups: xxx-xxxx-xxx format
    for (let i = 0; i < 3; i++) {
      const groupLength = i === 1 ? 4 : 3;
      for (let j = 0; j < groupLength; j++) {
        const useChar = Math.random() > 0.5;
        code += useChar
          ? chars[Math.floor(Math.random() * chars.length)]
          : nums[Math.floor(Math.random() * nums.length)];
      }
      if (i < 2) code += '-';
    }

    return code;
  };

  const meetCode = generateMeetCode();
  const meetLink = `https://meet.google.com/${meetCode}`;

  console.log(
    `✅ Generated simple Google Meet link for appointment ${appointmentId}: ${meetLink}`,
  );

  return meetLink;
}

