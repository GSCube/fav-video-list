import NextAuth from "next-auth"
import type {NextAuthConfig} from "next-auth"
import GoogleProvider from "next-auth/providers/google";

const config: NextAuthConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
            authorization: {
                params: {
                    scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube',
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],
    session: {
        strategy: 'jwt', // Use JWT sessions. This is default and usually recommended.
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.AUTH_SECRET,
    callbacks: {
// @ts-ignore
        async jwt({ token, user, account, profile }) {
            // Initial sign in

            console.log('account', account)
            console.log('user', user)
            console.log('profile', profile)


            if (user) token.userId = user.id;
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpires = Date.now() + (account.expires_in || 0) * 1000;
            }


            // if (account && user) {
            //     return {
            //         accessToken: account.accessToken,
            //         accessTokenExpires: Date.now() + account.expires_in * 1000,
            //         refreshToken: account.refresh_token,
            //         user,
            //     }
            // }

            // localStorage.setItem('accessToken', token.accessToken)
            // localStorage.setItem('accessTokenExpires', token.accessTokenExpires)
            // localStorage.setItem('refreshToken', token.refreshToken)

            // Return previous token if the access token has not expired yet
            // console.log('before if token', token)
            // if (Date.now() < token.accessTokenExpires) {
            //     return token
            // }

            // Access token has expired, try to update it
            return token
        },
        async session({session, token, user, newSession}) {
            console.log('session in session', session)
            console.log('token in session', token)
            console.log('user in session', user)
            console.log('', )

            if (token) {
                session.user.id = '123';
                // @ts-ignore
                session.accessToken = token.accessToken;
                // @ts-ignore
                session.refreshToken = token.refreshToken;
            }



            return session
        },
    },
}

export const {auth, handlers} = NextAuth(config)



