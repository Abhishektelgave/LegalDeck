import dbConnect from '@/app/db/page';
import Lawyer from '@/app/models/Lawyer';

export const GET = async (req) => {
    try {
        const connection = await dbConnect();
        if (!connection) {
            return new Response(JSON.stringify({ message: 'Database connection failed' }), { status: 500 });
        }

        // Fetch appointments for the user
        const lawyers = await Lawyer.find({
            lawyer_verified: 'rejected',
        });

        if (!lawyers.length) {
            return new Response(JSON.stringify({ message: 'No Laywer found' }), { status: 201 });
        }

        return new Response(JSON.stringify({ lawyers: lawyers }), { status: 200 });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: 'Server error: ' + err.message }), { status: 500 });
    }
};
