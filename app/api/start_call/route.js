// app/api/start_call/route.js
import { google } from 'googleapis';
import { authorize, createGoogleMeet } from '@/app/utils/googleMeet';

export async function POST(req) {
  try {
    const body = await req.json();
    const { appointment } = body;

    if (!appointment?.lawyerEmail || !appointment?.lawyerName) {
      return new Response(JSON.stringify({ error: 'Missing lawyer info' }), {
        status: 400,
      });
    }

    const meetLink = await createGoogleMeet();
    const authClient = await authorize();
    const gmail = google.gmail({ version: 'v1', auth: authClient });

    const messageParts = [
      `To: ${appointment.lawyerEmail}`,
      'Subject: Appointment Video Call Started',
      'Content-Type: text/html; charset=utf-8',
      '',
      `<p>Hi ${appointment.lawyerName},</p>
       <p>Your video consultation has started. Please join using the link below:</p>
       <p><a href="${meetLink}">${meetLink}</a></p>`,
    ];

    const encodedMessage = Buffer.from(messageParts.join('\n'))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return new Response(JSON.stringify({ meetLink }), { status: 200 });
  } catch (err) {
    console.error('Start call error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
