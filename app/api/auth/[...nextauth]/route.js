import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/app/db/page";
import Lawyer from '@/app/models/Lawyer';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';



export const authOptions = NextAuth({

  providers: [

    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // ----------------------------------------------------------------------------------------------------------------
    // Credential Provider
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: { label: 'name', type: 'text', placeholder: 'UserName' },
        email: { label: 'Email', type: 'email', placeholder: 'Email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const { isSignup, email, password, name } = credentials;

        // Connect to database
        await dbConnect();

        if (isSignup) {
          // Signup Flow
          const existingLawyer = await Lawyer.findOne({ email });
          if (existingLawyer) {
            throw new Error('Email already in use.');
          }

          const hashedPassword = await bcrypt.hash(password, 12);
          const newLawyer = new Lawyer({
            name,
            email,
            password: hashedPassword,
          });
          await newLawyer.save();
          return newLawyer;

        } else {
          // Login Flow
          const lawyer = await Lawyer.findOne({ email });
          if (!lawyer) {
            throw new Error('No user found with this email.');
          }

          const isPasswordValid = await bcrypt.compare(password, lawyer.password);
          if (!isPasswordValid) {
            throw new Error('Invalid password.');
          }

          return lawyer;
        }
      }
    }),
  ],
  // ------------------------------------------------------------------------------------------------------------------
  database: process.env.MONGODB_URI,

  // Callbacks
  callbacks: {
    async signIn({ user, account, token }) {

      // Connect db
      await dbConnect();

      // Check for existing User
      const existingUser = await User.findOne({ email: user.email });

      // Create User if not found
      if (!existingUser) {
        const newUser = new User({
          name: user.name,
          email: user.email,
          profileImage: user.image || "",
          email_verified: true,
          oauthProvider: account.provider || "google",
        });

        // Save User
        await newUser.save();
      }
      return true;
    },

    // Manage Session
    async session({ session, token }) {

      // Connect db
      await dbConnect();

      // Check for User
      const user = await User.findOne({ email: session.user.email });

      // Add User to session
      if (user) {
        session.user = {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.profileImage,
          bio: user.bio,
          followers: user.followers,
          following: user.following,
          oauthProvider: user.oauthProvider,
          createdDate: user.createdDate,
          emailVerified: user.email_verified
        };

        // Add token id
        if (user) {
          token.id = user._id;
        }
      }
      return session;
    },

    // JavaScript Web token
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
  debug: true,
});

export { authOptions as GET, authOptions as POST };
