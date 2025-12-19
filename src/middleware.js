import axios from "axios";
import { auth } from "./auth";

const NEXT_PUBLIC_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:5000'

export default auth(async req => {
    const isLoginPage = req.nextUrl.pathname.startsWith("/login")
    const isAuthUser = !!req.auth

    const pathname = req.nextUrl.pathname

    if (!isAuthUser) {
        if (isLoginPage) return null;
        return Response.redirect(new URL('/login', req.url))
    }

    if (pathname.startsWith("/editor")) {
        const designId = pathname.split('/')[2]
        try {
            const res = await axios({
                url: `${NEXT_PUBLIC_GATEWAY_URL}/v1/designs/${designId}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${req.auth.idToken}`,
                },
            })
            const publicFor = res.data.data.publicFor

            const email = req.auth.user.email

            if (email === res.data.data.email) {
                return null
            }

            if (publicFor.length === 0) {
                return Response.redirect(new URL('/', req.url))
            }
            else {
                if (publicFor[0].email === 'all') {
                    return null
                }
                else {
                    const emailFound = publicFor.find(user => user.email === email)
                    if (emailFound) {
                        return null;
                    }
                    return Response.redirect(new URL('/', req.url))
                }
            }
        } catch (e) {
            return null;
        }

    }

    if (isLoginPage) {
        if (isAuthUser) {
            return Response.redirect(new URL('/', req.url))
        }

        return null
    }
})

export const config = {
    matcher: [
        '/',
        '/editor/:path*',
        '/login'
    ]
}