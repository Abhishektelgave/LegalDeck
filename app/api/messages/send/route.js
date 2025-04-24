import connectDB from '@/app/db/page';
import Case from '@/app/models/Case';

export async function POST(req) {
    await connectDB();

    const body = await req.json();
    const { caseId, senderId, senderRole, message } = body;

    try {
        const updatedCase = await Case.findByIdAndUpdate(caseId, {
            $push: {
                messages: {
                    sender: senderId,
                    senderRole,
                    message,
                },
            },
        }, { new: true });

        return new Response(JSON.stringify({ success: true, messages: updatedCase.messages }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
