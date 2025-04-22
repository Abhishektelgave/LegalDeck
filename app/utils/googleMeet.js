// ~NOT IN USE YET
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/meetings.space.created', 'https://www.googleapis.com/auth/gmail.send'];

export async function authorize() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  auth.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  return auth;
}

export async function createGoogleMeet() {
  const authClient = await authorize();
  const meet = google.meet({ version: 'v1', auth: authClient });

  const res = await meet.spaces.create({});
  return res.data.meetingUri;
}
