import dbConnect from '@/app/db/page';
import Case from '@/app/models/Case';

export async function POST(req) {
    try {
        const body = await req.json();
        const { id, caseProgress } = body;

        if (!id || !caseProgress) {
            return new Response(JSON.stringify({ message: 'Invalid parameters' }), { status: 400 });
        }

        await dbConnect();
        if (caseProgress === 'Resolved') {
            const updatedCase = await Case.findByIdAndUpdate(id, { caseProgress, status: 'Resolved' }, { new: true });

            if (!updatedCase) {
                return new Response(JSON.stringify({ message: 'Case Not Found' }), { status: 404 });
            }

            return new Response(JSON.stringify({ case: updatedCase }), { status: 200 });
        } else {

            const updatedCase = await Case.findByIdAndUpdate(id, { caseProgress }, { new: true });

            if (!updatedCase) {
                return new Response(JSON.stringify({ message: 'Case Not Found' }), { status: 404 });
            }

            return new Response(JSON.stringify({ case: updatedCase }), { status: 200 });
        }
        
    } catch (err) {
        return new Response(JSON.stringify({ message: 'Server error: ' + err.message }), { status: 500 });
    }
}
