import NextAuth from "next-auth";
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    callbacks: {
        async jwt({ token, account }) {
            console.log(`token=${token}, account=${account}`)

            if (account?.id_token) {
                token.idToken = account.id_token
            }

            return token
        },

        async session({ session, token }) {
            console.log(`token=${token}, session=${session}`)
            session.idToken = token.idToken
            return session
        }
    }
})