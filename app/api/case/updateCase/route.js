import dbConnect from '@/app/db/page';
import Case from '@/app/models/Case';
import Appointment from '@/app/models/Appointment';

export async function POST(req) {
    try {
        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return new Response(JSON.stringify({ message: 'Invalid parameters' }), { status: 400 });
        }

        await dbConnect();

        const updatePayload = {};

        const normalizedStatus = status;

        if (normalizedStatus === 'Active') {
            updatePayload.status = 'Active';
            updatePayload.caseProgress = 'Initiated';
        } else if (normalizedStatus === 'Rejected') {
            updatePayload.status = 'Rejected';
            await Appointment.updateMany(
                { caseId: id },
                { $set: { status: 'cancelled' } }
            );
        } else {
            updatePayload.status = normalizedStatus;
        }

        const updatedCase = await Case.findByIdAndUpdate(id, updatePayload, { new: true });

        if (!updatedCase) {
            return new Response(JSON.stringify({ message: 'Case Not Found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ case: updatedCase }), { status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ message: 'Server error: ' + err.message }), { status: 500 });
    }
}
