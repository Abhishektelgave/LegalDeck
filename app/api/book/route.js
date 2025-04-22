import dbConnect from '@/app/db/page';
import Appointment from '@/app/models/Appointment';

export const POST = async (req) => {
    try {
        const connection = await dbConnect();
        if (!connection) {
            return new Response(JSON.stringify({ message: 'Database connection failed' }), { status: 500 });
        }

        const body = await req.json();
        const { lawyerId, userId,  date, time, category, fee } = body;

        if (!lawyerId ||!userId || !date || !time || !category || !fee) {
            return new Response(JSON.stringify({ message: 'Invalid parameters' }), { status: 400 });
        }

        const existing = await Appointment.findOne({ lawyerId, userId, date, time, category });
        if (existing) {
            return new Response(JSON.stringify({ message: 'Appointment already scheduled' }), { status: 409 });
        }

        const newAppointment = new Appointment({
            lawyerId,
            userId,
            date,
            time,
            category,
            fee,
            status: 'pending',
            payment:'pending',
        });

        await newAppointment.save();

        return new Response(JSON.stringify({ message: 'Appointment created successfully' }), { status: 200 });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: 'Server error: ' + err.message }), { status: 500 });
    }
};
