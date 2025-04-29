import connectDB from "@/app/db/page";
import Rating from "@/app/models/Rating";


export const GET = async (req) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const lawyerId = searchParams.get("lawyerId");

    if (!lawyerId) {
      return new Response(JSON.stringify({ error: "Missing lawyerId" }), { status: 400 });
    }

    const ratings = await Rating.find({ lawyerId })
      .populate("userId", "name") // populate only the name field
      .sort({ createdAt: -1 });

    const formatted = ratings.map(r => ({
      _id: r._id,
      category: r.category,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      userName: r.userId?.name || "Anonymous",
    }));

    return new Response(JSON.stringify(formatted), { status: 200 });

  } catch (error) {
    console.error("Error fetching ratings:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch ratings" }), { status: 500 });
  }
};


export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { lawyerId, userId, category, rating, comment } = body;

    if (!lawyerId || !userId || !category || !rating) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
      });
    }

    try {
      const newRating = new Rating({
        lawyerId,
        userId,
        category,
        rating,
        comment,
      });

      await newRating.save();
      return new Response(JSON.stringify({ message: "Rating submitted successfully." }), {
        status: 201,
      });
    } catch (err) {
      if (err.code === 11000) {
        return new Response(JSON.stringify({ error: "You’ve already rated this lawyer for this category." }), {
          status: 409,
        });
      }

      throw err;
    }
  } catch (error) {
    console.error("Rating API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
