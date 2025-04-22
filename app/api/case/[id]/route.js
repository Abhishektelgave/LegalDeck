import connectDB from '@/app/db/page';
import Case from '@/app/models/Case';

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ message: 'Case ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const caseData = await Case.findById(id);

    if (!caseData) {
      return new Response(JSON.stringify({ message: 'Case not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(caseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[CASE_GET_ERROR]', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
