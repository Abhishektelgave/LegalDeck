import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/app/db/page";
import Lawyer from '@/app/models/Lawyer';
import User from '@/app/models/User';
import Admin from '@/app/models/Admin';
import bcrypt from 'bcryptjs';

export const authOptions = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: { label: 'name', type: 'text' },
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
        fileName: { label: 'FileName', type: 'text' },
        categories: { label: 'Categories', type: 'text' },
        isSignup: { label: 'IsSignup', type: 'text' },
      },

      async authorize(credentials) {
        const { role, categories, fileName, isSignup, email, password, name } = credentials;

        await dbConnect();

        // Admin Login
        if (role === 'admin') {
          const admin = await Admin.findOne({ email });
          if (!admin) throw new Error('No admin found.');
          const valid = await bcrypt.compare(password, admin.password);
          if (!valid) throw new Error('Invalid password.');
          return { ...admin._doc, role: 'admin' };
        }

        // User Login
        if (role === 'user') {
          if (isSignup === 'true') {
            const existingUser = await User.findOne({ email });
            if (existingUser) throw new Error('Email already in use.');
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({ name, email, password: hashedPassword });
            await newUser.save();
            return { ...newUser._doc, role: 'user' };
          } else {
            const user = await User.findOne({ email });
            if (!user) throw new Error('No user found.');
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new Error('Invalid password.');
            return { ...user._doc, role: 'user' };
          }
        }

        // Lawyer Login
        if (role === 'lawyer') {
          if (isSignup === 'true') {
            const existingLawyer = await Lawyer.findOne({ email });
            if (existingLawyer) throw new Error('Email already in use.');
            const hashedPassword = await bcrypt.hash(password, 12);
            const parsedCategories = JSON.parse(categories || '{}');
            const newLawyer = new Lawyer({
              name,
              email,
              password: hashedPassword,
              fileName,
              categories: parsedCategories,
              oauthProvider: 'Credentials',
              upi: '',
            });
            await newLawyer.save();
            return { ...newLawyer._doc, role: 'lawyer' };
          } else {
            const lawyer = await Lawyer.findOne({ email });
            if (!lawyer) throw new Error('No lawyer found.');
            const valid = await bcrypt.compare(password, lawyer.password);
            if (!valid) throw new Error('Invalid password.');
            return { ...lawyer._doc, role: 'lawyer' };
          }
        }

        throw new Error('Invalid role.');
      }
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();

      if (account?.provider === 'google') {
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          const defaultPassword = user.name + '@123';
          const hashedPassword = await bcrypt.hash(defaultPassword, 12);
          const newUser = new User({
            name: user.name,
            email: user.email,
            password: hashedPassword,
            profileImage: user.image,
            email_verified: true,
            oauthProvider: "google",
          });
          await newUser.save();
        }
      }

      return true;
    },

    async session({ session, token }) {
      await dbConnect();
      let currentUser;
      const role = token.role;

      if (role === 'admin') {
        currentUser = await Admin.findOne({ email: session.user.email });
      } else if (role === 'lawyer') {
        currentUser = await Lawyer.findOne({ email: session.user.email });
      } else {
        currentUser = await User.findOne({ email: session.user.email });
      }

      if (currentUser) {
        session.user = {
          id: currentUser._id.toString(),
          name: currentUser.name,
          email: currentUser.email,
          role,
          oauthProvider: currentUser.oauthProvider,
          createdDate: currentUser.createdDate,
          ...(role === 'user ' && {
            image: currentUser.profileImage,
          }),
          ...(role === 'lawyer' && {
            close_appoitment: currentUser.close_appoitment,
            categories: currentUser.categories,
            isApproved: currentUser.lawyer_verified,
            upi: currentUser.upi,
          }),
        };
        if (token) token.id = currentUser._id;
      }

      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || 'user';
        token.email = user.email;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  debug: true,
});

export { authOptions as GET, authOptions as POST };
