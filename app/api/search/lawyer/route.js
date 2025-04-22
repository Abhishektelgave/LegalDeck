import dbConnect from "@/app/db/page";
import Lawyer from '@/app/models/Lawyer';

export const GET = async (req) => {
  try {
    // Connect to the database
    const connection = await dbConnect();
    if (!connection) {
      return new Response(JSON.stringify({ message: 'Database connection failed' }), { status: 500 });
    }

    // Extract the search query
    const username = req.nextUrl.searchParams.get('lawyer');

    if (!username) {
      return new Response(JSON.stringify({ message: 'Search query missing' }), { status: 400 });
    } 

    // Find users based on the search query
    const lawyer = await Lawyer.findOne({
      name: {
        $regex: username,
        $options: "i", // Case-insensitive search
      },
    });

    if (!lawyer) {
      return new Response(JSON.stringify({ message: 'No users found' }), { status: 404 });
    }

    return new Response(JSON.stringify(lawyer), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error : ' + error }), { status: 500 });
  }
};
