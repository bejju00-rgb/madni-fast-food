import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isRegister: { label: "Is Register", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone) return null;

        if (credentials.isRegister === "true") {
          const existing = await prisma.user.findUnique({
            where: { phone: credentials.phone },
          });
          if (existing) throw new Error("Phone number already registered");

          const hashedPassword = await bcrypt.hash(
            credentials.password || credentials.phone,
            12
          );

          const user = await prisma.user.create({
            data: {
              name: credentials.name || "Customer",
              phone: credentials.phone,
              password: hashedPassword,
            },
          });

          return {
            id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role,
          };
        }

        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
        });

        if (!user) throw new Error("User not found. Please sign up first.");

        if (user.password && credentials.password) {
          const valid = await bcrypt.compare(credentials.password, user.password);
          if (!valid) throw new Error("Invalid password");
        }

        return {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = (user as { phone?: string }).phone || "";
        token.role = (user as { role?: string }).role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
