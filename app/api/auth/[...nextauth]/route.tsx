import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { env } from '@config/env';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',

            credentials: {
                username: {
                    label: 'Username',
                    type: 'text'
                },
                password: { label: 'Password', type: 'password' }
            },

            async authorize(credentials, req) {
                try {
                    const res = await axios.post(`${env.API_URL}/auth/login`, { ...credentials });
                    const user = res.data;
                    if (user) {
                        return user;
                    } else {
                        return null;
                    }
                } catch (e) {
                    console.log(e);
                    return e;
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
            session.user = token as any;
            return session;
        },
        async redirect({ url, baseUrl }) {
            return '/';
        }
    },

    pages: {
        signIn: '/auth/login'
    }
});

export { handler as GET, handler as POST };
