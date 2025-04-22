import dbConnect from '@/app/db/page';
import Case from '@/app/models/Case';

export async function GET(req, { params }) {
    await dbConnect();
    const { id } = params;

    const existingCase = await Case.findOne({ appointmentId: id });
    if (!existingCase) {
        return Response.json({ exists: false });
    }

    return Response.json({ exists: true, case: existingCase });
}
