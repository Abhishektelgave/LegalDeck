import dbConn from "@/app/db/page";
import bcrypt from 'bcryptjs';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const POST = async (req) => {
    try {
        // Connect to the database
        const connection = await dbConn();
        if (!connection) {
            return new Response(JSON.stringify({ message: 'Database connection failed' }), { status: 500 });
        }

        // Extract the data from the request
        const { email, password } = await req.json(); // Fix for req.json()

        if (!email || !password) {
            return new Response(JSON.stringify({ message: 'Search query missing' }), { status: 400 });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }
        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (isPasswordValid) {
            return new Response(JSON.stringify(user), { status: 200 });
        } else {
            return new Response(JSON.stringify({ message: 'Wrong password' }), { status: 401 });
        }

    } catch (error) {
        console.error('Error in POST handler:', error);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
};
