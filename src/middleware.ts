import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getLink } from "./lib/getLink";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect();

  const url = req.nextUrl;
  const path = url.pathname;
  const hostname = req.headers.get("host")!;

  console.log("path", path);
  console.log("host", hostname);

 if (
    hostname === getLink({ method: false }).slice(0, -1) || 
    hostname === `www.${getLink({ method: false }).slice(0, -1)}`
  ) {
    return NextResponse.next();
  }

  // handle custom subdomain
  const subdomain = hostname.split(".")[0];
  console.log("sub", subdomain);
  return NextResponse.rewrite(new URL(`/${subdomain}${path}`, req.url));
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
