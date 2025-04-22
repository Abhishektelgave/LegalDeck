import dbConnect from "@/app/db/page";
import Appointment from "@/app/models/Appointment";

export const POST = async (req) => {
    try {
        const body = await req.json();
        const { id, status } = body;

        if (!id || !["confirmed", "cancelled"].includes(status)) {
            return new Response(JSON.stringify({ message: "Invalid input" }), { status: 400 });
        }

        await dbConnect();
        const updated = await Appointment.findByIdAndUpdate(id, { status }, { new: true });

        if (!updated) {
            return new Response(JSON.stringify({ message: "Appointment not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Appointment updated", appointment: updated }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: err.message }), { status: 500 });
    }
};
