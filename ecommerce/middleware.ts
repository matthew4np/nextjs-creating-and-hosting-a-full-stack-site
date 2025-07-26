import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check for the 'token' cookie
  const token = request.cookies.get("token")?.value;

  // If there's no token, redirect to the login page
  if (!token) {
    // The full URL is needed for a redirect.
    const loginUrl = new URL("/login", request.url);
    // We store the page the user was trying to access in a query parameter.
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If the token exists, allow the request to proceed
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/cart"], // Only protect routes that strictly require a logged-in user
};