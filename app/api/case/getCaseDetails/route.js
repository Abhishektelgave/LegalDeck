import connectDB from '@/app/db/page';
import Case from '@/app/models/Case';

export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ message: 'Case ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const caseData = await Case.findOne({ _id: id })
      .populate('userId', 'name email')
      .populate('lawyerId', 'name email');

    if (!caseData) {
      return new Response(JSON.stringify({ message: 'Case not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Default data handling
    const lawyerName = caseData.lawyerId?.name || 'Unknown user';
    const lawyerEmail = caseData.lawyerId?.email || 'Unknown email';
    const userName = caseData.userId?.name || 'Unknown user';
    const userEmail = caseData.userId?.email || 'Unknown email';

    const responseData = {
      ...caseData.toObject(),
      lawyerName,
      lawyerEmail,
      userName,
      userEmail,
    };

    return new Response(JSON.stringify(responseData), {
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
