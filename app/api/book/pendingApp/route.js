import dbConnect from '@/app/db/page';
import Appointment from '@/app/models/Appointment';
import Lawyer from '@/app/models/Lawyer'; // Assuming you have a Lawyer model

export const GET = async (req) => {
    try {
        const connection = await dbConnect();
        if (!connection) {
            return new Response(JSON.stringify({ message: 'Database connection failed' }), { status: 500 });
        }

        // Get query parameters (userId)
        const url = new URL(req.url);
        const userId = url.searchParams.get('userId');

        // Check for required parameters
        if (!userId) {
            return new Response(JSON.stringify({ message: 'Missing parameter: userId' }), { status: 400 });
        }

        // Fetch appointments for the user
        const appointments = await Appointment.find({
            userId: userId,
            status: 'pending'
        }).populate('lawyerId'); // Populate lawyer data

        if (!appointments.length) {
            return new Response(JSON.stringify({ message: 'No appointments found' }), { status: 201 });
        }

        // Modify the appointments data to add lawyer name and default duration
        const updatedAppointments = appointments.map(appt => {
            // Set default duration if not present
            appt.duration = appt.duration || '30 hour';  // You can change the default duration here
            const lawyerName = appt.lawyerId ? appt.lawyerId.name : 'Unknown Lawyer'; // Get lawyer name
            return {
                ...appt.toObject(),
                lawyerName, // Add lawyer name to the response
            };
        });

        return new Response(JSON.stringify({ appointments: updatedAppointments }), { status: 200 });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: 'Server error: ' + err.message }), { status: 500 });
    }
};
