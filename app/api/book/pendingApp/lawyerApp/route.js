import dbConnect from '@/app/db/page';
import Appointment from '@/app/models/Appointment';
import Lawyer from '@/app/models/Lawyer';


export const GET = async (req) => {
    try {
        const connection = await dbConnect();
        if (!connection) {
            return new Response(JSON.stringify({ message: 'Database connection failed' }), { status: 500 });
        }

        // Get query parameters (userId)
        const url = new URL(req.url);
        const lawyerId = url.searchParams.get('lawyerId');

        // Check for required parameters
        if (!lawyerId) {
            return new Response(JSON.stringify({ message: 'Missing parameter: lawyerId' }), { status: 404 });
        }

        // Fetch appointments for the user
        const appointments = await Appointment.find({
            lawyerId: lawyerId,
            status: 'pending',
        }).populate('userId');

        if (!appointments.length) {
            return new Response(JSON.stringify({ message: 'No appointments found' }), { status: 201 });
        }


        // Modify the appointments data to add lawyer name and default duration
        const updatedAppointments = appointments.map(appt => {
            // Set default duration if not present
            appt.duration = appt.duration || '30 hour';  // You can change the default duration here
            const userName = appt.userId ? appt.userId.name : 'Unknown user'; // Get lawyer name
            return {
                ...appt.toObject(),
                userName, // Add lawyer name to the response
            };
        });

        return new Response(JSON.stringify({ appointments: updatedAppointments }), { status: 200 });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: 'Server error: ' + err.message }), { status: 500 });
    }
};
