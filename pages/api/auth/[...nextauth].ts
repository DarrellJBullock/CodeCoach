import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions, User } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const extendedUser = user as User & { sub?: string };
        token.id =
          extendedUser.id ??
          extendedUser.sub ??
          extendedUser.email ??
          "google-user";
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        (session.user as { id?: string }).id = token.id;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
