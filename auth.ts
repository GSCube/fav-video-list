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
          // TODO: dont ask user for permissions if already granted
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
    async jwt({token, user, account, profile}) {
      if (user) token.userId = user.id;
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = Date.now() + (account.expires_in || 0) * 1000;
      }

      // TODO: introduce a refresh token rotation
      // https://next-auth.js.org/v3/tutorials/refresh-token-rotation

      return token
    },
    async session({session, token, user, newSession}) {

      if (token) {
        // I've followed this example https://next-auth.js.org/v3/tutorials/refresh-token-rotation
        // bot for this for some reason types are not correct (probably I'm using the latest version of next-auth)
        // no time to investigate it now

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



