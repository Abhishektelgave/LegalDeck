import dbConnect from "@/app/db/page";
import User from '@/app/models/users';
import bcrypt from 'bcryptjs';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export const POST = async (req) => {
    try {
        // Connect to the database
        const connection = await dbConnect();
        if (!connection) {
            return new Response(JSON.stringify({ message: 'Database connection failed' }), { status: 500 });
        }
        
        // Extract the data from the request
        const { name, email, password } = await req.json(); // Fix for req.json()
        if (!name || !email || !password ) {
            return new Response(JSON.stringify({ message: 'Search query missing' }), { status: 400 });
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);

        //create a new user
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            email_verified: false,
            createdDate: new Date(),
        });
        await user.save();
        return new Response(JSON.stringify(user), { status: 200 })
    } catch (error) {
        console.error('Error in POST handler:', error);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
};
