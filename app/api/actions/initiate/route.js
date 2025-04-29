import Razorpay from "razorpay";
import dbConnect from "@/app/db/page";
import Transition from "@/app/models/Transition";

export const POST = async (req) => {
    try {
        // Connect to the database
        const connection = await dbConnect();
        if (!connection) {
            return new Response(JSON.stringify({ message: 'Database connection failed' }), { status: 500 });
        }

        const { amount, from_user, to_user, upi } = await req.json();

        // Validate input data
        if (!amount || !from_user || !to_user || !upi) {
            return new Response(JSON.stringify({ message: 'Missing required parameters' }), { status: 400 });
        }

        // Initialize Razorpay instance
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        // Create Razorpay order
        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise for INR)
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
            payment_capture: 1,
            notes: { payeeVPA: upi },
        };

        try {
            const order = await instance.orders.create(options);

            // Save the order details in the database
            await Transition.create({
                razorpay_order_id: order.id,
                amount,
                fromUser: from_user,
                toUser: to_user,
            });

            // Return order data to the client
            return new Response(JSON.stringify(order), { status: 200 });
        } catch (razorpayError) {
            console.error("Razorpay order creation error:", razorpayError);
            return new Response(JSON.stringify({ message: "Razorpay order creation failed" }), { status: 500 });
        }
    } catch (error) {
        console.error("Order creation error:", error);
        return new Response(JSON.stringify({ message: "Failed to create order" }), { status: 500 });
    }
};
