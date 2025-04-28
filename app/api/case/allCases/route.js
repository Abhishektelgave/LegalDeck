import dbConnect from "@/app/db/page";
import Case from '@/app/models/Case';

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, lawyerId, role } = body;

    if ((!userId && !lawyerId) || !role) {
      return new Response(JSON.stringify({ message: 'Missing parameters' }), { status: 400 });
    }

    await dbConnect();

    let cases = [];

    if (role === 'lawyer') {
      if (!lawyerId) {
        return new Response(JSON.stringify({ message: 'Lawyer ID missing' }), { status: 400 });
      }
      cases = await Case.find({ lawyerId });
    } else if (role === 'user') {
      if (!userId) {
        return new Response(JSON.stringify({ message: 'User ID missing' }), { status: 400 });
      }
      cases = await Case.find({ userId });
    } else {
      return new Response(JSON.stringify({ message: 'Invalid role' }), { status: 400 });
    }

    if (!cases || cases.length === 0) {
      return new Response(JSON.stringify({ message: 'No Cases Found' }), { status: 404 });
    }

    return new Response(JSON.stringify(cases), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ message: `Something went wrong: ${err.message}` }), { status: 500 });
  }
}
