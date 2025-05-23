import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { env } from '@config/env';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',

            credentials: {
                email: {
                    label: 'Email',
                    type: 'text'
                },
                password: { label: 'Password', type: 'password' }
            },

            async authorize(credentials, req) {
                try {
                    const res = await axios.post(`${env.NEXT_PUBLIC_API_URL_BACKEND}/auth/login`, { username: credentials.email, password: credentials.password });
                    const user = res.data;

                    if (user) {
                        return user;
                    } else {
                        return null;
                    }
                } catch (error) {
                    throw new Error(error.status);
                }
            }
        })
    ],
    secret: env.AUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    jwt: {
        secret: env.AUTH_SECRET
    },
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token }) {
            session = token as any;
            return session;
        },
        async redirect({ url }) {
            if (url) {
                return url;
            }
        }
    },

    pages: {
        signIn: '/auth/login'
    }
});

export { handler as GET, handler as POST };
