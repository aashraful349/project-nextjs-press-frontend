import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt, { JwtPayload } from 'jsonwebtoken'
import path from 'path';
import { jwtUtils } from './utils/jwt';
import { url } from 'inspector';
import { getNewAccessToken } from './service/refreshToken';
 

const AUTH_ROUTES=["/login","/register"]
const PUBLIC_ROUTES=["/","/news"]

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    // console.log("proxy")

    const pathName=request.nextUrl.pathname;

    console.log("path name:",pathName)

    const cookieStore = await cookies();
    // const accessToken=cookieStore.get("accessToken")?.value;


    let accessToken=request.cookies.get("accessToken")?.value;
    const refreshToken=request.cookies.get("refreshToken")?.value;

    let decodedAccessToken=accessToken? jwtUtils.verifyToken(accessToken,process.env.JWT_ACCESS_SECRET as string) :null;

    const decodedRefreshToken=refreshToken? jwtUtils.verifyToken(refreshToken,process.env.JWT_REFRESH_SECRET as string) :null;

    if(!decodedAccessToken?.success && decodedRefreshToken?.success){

        const result=await getNewAccessToken();
        if(result.success){
            const newAccessToken=result.data.accessToken;
            cookieStore.set("accessToken", newAccessToken,{
                httpOnly:true,
                maxAge: 60 * 60 * 24 ,
                sameSite:"lax"
            });
            accessToken=newAccessToken;
            decodedAccessToken = jwtUtils.verifyToken(accessToken!, process.env.JWT_ACCESS_SECRET as string);
        }
    }

    let userRole=null;

        if(!decodedAccessToken?.success){
        cookieStore.delete("accessToken");
        // return NextResponse.redirect(new URL("/login",request.url))
    }

    
    if(decodedAccessToken?.success && decodedAccessToken.data){
        userRole=(decodedAccessToken.data as JwtPayload).role;
    }



    if(accessToken && AUTH_ROUTES.includes(pathName)){

        if(userRole==="USER"){
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        else if(userRole==="ADMIN"){
            return NextResponse.redirect(new URL('/admin-dashboard', request.url))
        }
        else if(userRole==="AUTHOR"){
            return NextResponse.redirect(new URL('/author-dashboard', request.url))
        }
        else{
            return NextResponse.redirect(new URL('/', request.url))
        }

    }

    const isPublicRoute = PUBLIC_ROUTES.some(route=>pathName=== route || pathName.startsWith(route+"/"));

    const isAuthRoute= AUTH_ROUTES.some(route=>pathName=== route || pathName.startsWith(route+"/"));

    if(!accessToken && !isPublicRoute && !isAuthRoute){
        return NextResponse.redirect(new URL('/login', request.url))
    }


    if(pathName.startsWith("/dashboard") && userRole!=="USER"){
        return NextResponse.redirect(new URL('/not-found', request.url))
    }else if(pathName.startsWith("/admin-dashboard") && userRole!=="ADMIN"){
        return NextResponse.redirect(new URL('/not-found', request.url))
    }else if(pathName.startsWith("/author-dashboard") && userRole!=="AUTHOR"){
        return NextResponse.redirect(new URL('/not-found', request.url))
    }


//   return NextResponse.redirect(new URL('/', request.url))
return NextResponse.next()
}
 
// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }
 
export const config = {
  matcher: [
    // '/dashboard/:path*',
    // '/admin-dashboard/:path*',
    '/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)'
  ],
}