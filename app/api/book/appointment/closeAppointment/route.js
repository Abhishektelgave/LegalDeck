import dbConnect from "@/app/db/page";
import Lawyer from "@/app/models/Lawyer";

export const POST = async (req) => {
    try {
        const body = await req.json();
        const { close_appoitment } = body;
        const url = new URL(req.url);
        const id = url.searchParams.get("lawyerId");


        if (!id || !["true", "false"].includes(close_appoitment)) {
            return new Response(JSON.stringify({ message: "Invalid input" }), { status: 400 });
        }

        await dbConnect();
        const updated = await Lawyer.findByIdAndUpdate(id, { close_appoitment }, { new: true });

        if (!updated) {
            return new Response(JSON.stringify({ message: "Lawyer not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Lawyer updated", lawyer: updated }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ message: err.message }), { status: 500 });
    }
};
