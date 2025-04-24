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
    const search = req.nextUrl.searchParams.get('search');  // Get the search param from the URL

    if (!search) {
      return new Response(JSON.stringify({ message: 'Search query missing' }), { status: 400 });
    }

    // Debug line 

    // Find users based on the search query
    const lawyers = await Lawyer.find({
      name: {
        $regex: search,
        $options: "i", // Case-insensitive search
      },
      lawyer_verified: "approved",
    });

    if (!lawyers.length) {
      return new Response(JSON.stringify({ message: 'No lawyers found' }), { status: 404 });
    }

    return new Response(JSON.stringify(lawyers), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error :' + error }), { status: 500 });
  }
};
