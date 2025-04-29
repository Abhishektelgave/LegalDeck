import crypto from "crypto";
import dbConnect from "@/app/db/page";
import Transitions from "@/app/models/Transition";
import Case from "@/app/models/Case";

export const POST = async (req) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, case_id } = await req.json();

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return new Response(JSON.stringify({ message: "Missing required parameters" }), { status: 400 });
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return new Response(JSON.stringify({ message: "Invalid payment verification" }), { status: 400 });
  }

  try {
    await dbConnect();

    await Transitions.updateOne(
      { razorpay_order_id },
      { done: true }
    );

    await Case.findByIdAndUpdate(case_id, {
      payment: "completed",
      razorpay_order_id,
    });

    return new Response(JSON.stringify({ message: "Payment verified successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to verify payment in the database", error: error.message }), { status: 500 });
  }
};
