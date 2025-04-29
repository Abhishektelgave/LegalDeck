import dbConnect from "@/app/db/page";
import Appointment from "@/app/models/Appointment";
import Case from "@/app/models/Case";

export async function GET(request) {

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    // Connect to the database
    await dbConnect();

    console.log(id)
    // Find the case by ID
    const caseDetails = await Case.findById(id)
      .populate('lawyerId', 'name email')
      .populate('userId', 'name email')
      .exec();

    if (!caseDetails) {
      return new Response(
        JSON.stringify({ message: 'Case not found' }),
        { status: 404 }
      );
    }

    // Return the case details
    return new Response(
      JSON.stringify({caseDetails }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: 'Error fetching case details' + err.message }),
      { status: 500 }
    );
  }
}

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
      status: "Active",
      caseProgress: "Initiated",
      documents: [],
      desc: "",
    });

    await newCase.save();

    return new Response(JSON.stringify({ message: "Case created", _id: newCase._id }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
