import dbConnect from "@/app/db/page";
import Lawyer from '@/app/models/Lawyer';

export const GET = async (req) => {
  try {
    await dbConnect();

    const search = req.nextUrl.searchParams.get('search') || '';
    const category = req.nextUrl.searchParams.get('category') || '';
    const minRating = parseFloat(req.nextUrl.searchParams.get('minRating')) || 0;

    const filters = {
      name: { $regex: search, $options: "i" },
      lawyer_verified: "Approved"
    };

    if (category) {
      filters[`categories.${category}`] = { $exists: true };
    }

    const allLawyers = await Lawyer.find(filters);

    // Filter by rating manually if needed
    const filteredByRating = allLawyers.filter(lawyer => {
      const ratings = lawyer.ratings || [];
      const avg = ratings.length
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;
      return avg >= minRating;
    });

    if (filteredByRating.length === 0) {
      return new Response(JSON.stringify({ message: 'No lawyers found' }), { status: 404 });
    }

    return new Response(JSON.stringify(filteredByRating), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error :' + error }), { status: 500 });
  }
};
