import dbConnect from "@/app/db/page";
import Appointment from "@/app/models/Appointment";
import User from "@/app/models/User";

export const GET = async (req) => {
    try {
        await dbConnect();
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return new Response(JSON.stringify({ message: "ID is required" }), { status: 400 });
        }

        const appointment = await Appointment.findById(id).populate("userId");

        if (!appointment) {
            return new Response(JSON.stringify({ message: "Appointment not found" }), { status: 404 });
        }

        // Convert Mongoose document to plain object
        const appointmentObj = appointment.toObject();

        // Add userName and default duration
        const enrichedAppointment = {
            ...appointmentObj,
            userName: appointment.userId?.name || "Unknown User",
            duration: appointmentObj.duration || "30 minutes",
        };

        return new Response(JSON.stringify({ appointment: enrichedAppointment }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: err.message }), { status: 500 });
    }
};
