// /app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connect from '@/lib/mongodb';
import User from '@/models/user';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({token, user}){
      if(user){
        await connect();
        const dbuser= await User.findOne({email: user.email});
        token.id= dbuser?._id?.toString();
      }
      return token;
    },
    async session({ session, token }) {
      if(token?.id){
        session.user.id= token.id;
      }
      return session;
    },
    async signIn({user}) {
      await connect();
       const { email, name, image } = user;
      const existingUser = await User.findOne({ email});
      if (!existingUser) {
        console.log('Creating new user in DB:', user);
  
        await User.create({ email, name, image });
      } else {
        console.log('User already exists in DB:', existingUser);
      }

      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debugging logs for NextAuth
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
