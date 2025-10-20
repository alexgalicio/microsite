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

  // redirect if not logged in
  if (isAdminRoute(req) || isUserRoute(req) || isSharedRoute(req)) {
    await auth.protect();
  }
  const role = sessionClaims?.metadata?.role;

  // user-only routes
  if (isUserRoute(req) && role !== "user") {
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  // admin-only routes
  if (isAdminRoute(req) && role !== "admin") {
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  // shared routes
  if (isSharedRoute(req)) {
    return NextResponse.next();
  }

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
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
