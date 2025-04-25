import dbConnect from "@/app/db/page";
import Lawyer from "@/app/models/Lawyer";

export const GET = async (req) => {
    try {
        // database commection
        const connection = await dbConnect();
        if (!connection) {
            return new Response(JSON.stringify({ message: "Database connection error" }), { status: 500 });
        }

        // fetch all users from the database
        const lawyers = await Lawyer.find({
            lawyer_verified: "Approved"
        });

        if (!lawyers.length) {
            return new Response(JSON.stringify({ message: "No User not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(lawyers), { status: 200 });

    } catch (e) {
        return new Response(JSON.stringify({ message: "server error : " + e }), { status: 500 });
    }
}