import dbConnect from "@/app/db/page";
import Case from '@/app/models/Case';

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, lawyerId } = body;

    if (!userId || !lawyerId) {
      return new Response(JSON.stringify({ message: 'Missing parameters' }), { status: 400 });
    }

    await dbConnect();

    const cases = await Case.find({ userId, lawyerId });

    if (!cases || cases.length === 0) {
      return new Response(JSON.stringify({ message: 'No Cases Found' }), { status: 404 });
    }

    return new Response(JSON.stringify(cases), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ message: `Something went wrong: ${err.message}` }), { status: 500 });
  }
}
