import dbConnect from "@/app/db/page";
import Users from "@/app/models/Lawyer";

export async function POST(req) {
    try {
        const { email, name, categories, upi } = await req.json();

        await dbConnect();

        const user = await Users.findOneAndUpdate(
            { email },
            {
                name,
                categories, // expects array
                upi
            },
            { new: true }
        );

        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ user }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ message: 'Internal Server Error: ' + error }), { status: 500 });
    }
}
