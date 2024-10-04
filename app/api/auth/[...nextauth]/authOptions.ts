import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from 'lib/mongo';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import type { Adapter } from 'next-auth/adapters';
import dbConnect from 'lib/mongo/dbConnect';
import crypto from 'crypto';
import User from 'lib/utils/Models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'email',
          placeholder: 'email@example.com'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      authorize: async (credentials) => {
        await dbConnect();
        // Add logic here to look up the user from the credentials supplied
        if (credentials == null) return null;
        // login

        try {
          const user = await User.findOne({ email: credentials.email }).select('+salt +hash');

          if (!user) {
            return Promise.resolve(null);
          }

          const inputHash = crypto.pbkdf2Sync(credentials.password, user.salt, 1000, 64, 'sha512').toString('hex');
          if (inputHash === user.hash) {
            return Promise.resolve(user);
          }
          return Promise.resolve('invalid user');
        } catch (err: any) {
          throw new Error(err);
        }
      }
    })
  ],
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    newUser: '/home/activity?firstLogin=true',
    error: '/home/activity'
  },
  callbacks: {
    // We can pass in additional information from the user document MongoDB returns
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.access_token;
        token.id = user?.id;
        token.isGuide = user?.isGuide;
        token.profile = user?.profile;
      }
      return token;
    },
    // If we want to access our extra user info from sessions we have to pass it the token here to get them in sync:
    session: async ({ session, token }: any) => {
      if (token) {
        session.accessToken = token.accessToken;
        session.user.id = token.id;
        session.user.isGuide = token.isGuide;
        session.user.profile = token.profile;
      }
      return session;
    }
  }
};
