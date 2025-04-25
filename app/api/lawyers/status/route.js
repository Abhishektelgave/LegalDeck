import dbConnect from "@/app/db/page";
import Lawyer from "@/app/models/Lawyer";

export async function POST(req) {
    try {
        const { id, lawyer_verified } = await req.json();

        if (!id || !["Approved", "Rejected"].includes(lawyer_verified)) {
            return new Response(JSON.stringify({ error: "Invalid input" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        console.log(id + lawyer_verified);
        await dbConnect();

        const updated = await Lawyer.findByIdAndUpdate(
            id,
            { lawyer_verified: lawyer_verified },
            { new: true }
        );

        if (!updated) {
            return new Response(JSON.stringify({ error: "Lawyer not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({
            message: "Status updated",
            lawyer_verified: updated.lawyer_verified
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
