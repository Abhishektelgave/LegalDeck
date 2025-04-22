import dbConnect from "@/app/db/page";
import Appointment from "@/app/models/Appointment";
import Case from "@/app/models/Case";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ message: "Invalid input" }), { status: 400 });
    }

    await dbConnect();

    const appt = await Appointment.findById(id);
    if (!appt) {
      return new Response(JSON.stringify({ message: "Appointment not found" }), { status: 404 });
    }

    const newCase = new Case({
      lawyerId: appt.lawyerId,
      userId: appt.userId,
      category: appt.category,
      dateStarted: new Date().toISOString().split('T')[0],
      status: "Not Started",
      documents: [],
      desc: "",
    });

    await newCase.save();

    return new Response(JSON.stringify({ message: "Case created", _id: newCase._id }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
