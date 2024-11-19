import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { env } from '@config/env';
import { HttpStatus } from '@enums/HttpStatusEnum';

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
                console.log('res', { ...credentials });

                const res = await axios.post(`${env.NEXT_PUBLIC_API_URL_BACKEND}/auth/login`, { username: credentials.email, password: credentials.password });

                console.log('res', res);

                console.log('status', res.status);
                console.log('data', res.data);

                if (res.status === HttpStatus.UNAUTHORIZED) {
                    return { status: res?.status };
                }

                const user = res.data;

                if (user) {
                    return user;
                } else {
                    return null;
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
