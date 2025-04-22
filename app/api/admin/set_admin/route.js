import bcrypt from 'bcryptjs';
import Admin from '@/app/models/Admin';
import connectDB from '@/app/db/page';

export const GET = async (req) => {
    try {
        // database connection
        await connectDB();

        // default admin access
        const adminData = {
            name: 'Abhishek',
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASS,
        };

        // Check if admin exists
        const existingAdmin = await Admin.findOne({ email: adminData.email });

        if (existingAdmin) {
            return new Response(JSON.stringify({ message: 'Admin already exists' }), {
                status: 200,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(adminData.password, 12);

        // Create the admin user
        const newAdmin = new Admin({
            email: adminData.email,
            password: hashedPassword,
            name: adminData.name,
        });

        // save
        await newAdmin.save();

        return new Response(JSON.stringify({ message: 'Admin created' }), {
            status: 201,
        });
    } catch (error) {
        console.error('Error creating admin:', error);
        return new Response(JSON.stringify({ message: 'Server error' }), {
            status: 500,
        });
    }
}
