import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getLink } from "./lib/getLink";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/editor(.*)",
  "/settings(.*)",
  "/microsites(.*)",
  "/manage-menu(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();

  const url = req.nextUrl;
  const path = url.pathname;
  const hostname = req.headers.get("host")!;

  // Handle editor subdomain
  if (
    hostname === getLink({ subdomain: "editor", method: false }).slice(0, -1)
  ) {
    return NextResponse.rewrite(
      new URL(`/editor${path === "/" ? "" : path}`, req.url)
    );
  }

  // Handle www subdomain
  if (hostname === getLink({ subdomain: "www", method: false }).slice(0, -1)) {
    return NextResponse.next();
  }

  // Handle root domain
  if (hostname === getLink({ method: false }).slice(0, -1)) {
    return NextResponse.next();
  }

  // handle custom subdomain
  const subdomain = hostname.split(".")[0];
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
