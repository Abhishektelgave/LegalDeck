import { google } from 'googleapis';

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
  REFRESH_TOKEN,
} = process.env;

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function POST(req) {
  try {
    const { summary, description, startTime, endTime } = await req.json();

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const event = {
      summary,
      description,
      start: {
        dateTime: startTime,
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endTime,
        timeZone: 'Asia/Kolkata',
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return new Response(
      JSON.stringify({ success: true, eventId: response.data.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Calendar event error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
