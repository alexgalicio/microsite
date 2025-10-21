import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getLink } from "./lib/getLink";

const isAdminRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/manage-menu(.*)",
  "/calendar(.*)",
  "/notifications(.*)",
  "/chatbot(.*)",
  "/settings/configure(.*)",
]);

const isUserRoute = createRouteMatcher(["/editor(.*)", "/facebook-feed(.*)"]);

const isSharedRoute = createRouteMatcher(["/settings(.*)", "/microsites(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const { sessionClaims } = await auth();

  // redirect if user is not logged in
  if (isAdminRoute(req) || isUserRoute(req) || isSharedRoute(req)) {
    await auth.protect();
  }

  // get user role
  const role = sessionClaims?.metadata?.role;

  // user-only routes, redirect to forbidden page if not a normal user
  if (isUserRoute(req) && role !== "user") {
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  // admin-only routes, redirect to forbidden page if user is not an admin
  if (isAdminRoute(req) && role !== "admin") {
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  // shared routes for both user and admin
  if (isSharedRoute(req)) {
    return NextResponse.next();
  }

  // subdomain based routing
  const url = req.nextUrl;
  const path = url.pathname;
  const hostname = req.headers.get("host")!;

  // redirect request from the editor subdomain to /editor path
  if (
    hostname === getLink({ subdomain: "editor", method: false }).slice(0, -1)
  ) {
    return NextResponse.rewrite(
      new URL(`/editor${path === "/" ? "" : path}`, req.url)
    );
  }

  // allow request from the www subdomain 
  if (hostname === getLink({ subdomain: "www", method: false }).slice(0, -1)) {
    return NextResponse.next();
  }

  // allow request from the root domain
  if (hostname === getLink({ method: false }).slice(0, -1)) {
    return NextResponse.next();
  }

  // handle rquest from custom domains
  const subdomain = hostname.split(".")[0];
  return NextResponse.rewrite(new URL(`/${subdomain}${path}`, req.url));
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
