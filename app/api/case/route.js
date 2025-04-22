import dbConnect from '@/app/db/page';
import Case from '@/app/models/Case';

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  const newCase = new Case({
    appointmentId: body.appointmentId,
    userName: body.userName,
    lawyerName: body.lawyerName,
    dateStarted: new Date().toISOString().split('T')[0],
    status: 'Not Started',
    documents: [],
    messages: [],
  });

  await newCase.save();
  return Response.json({ createdCase: newCase });
}
