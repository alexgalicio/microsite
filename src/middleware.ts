import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { readSiteSubdomain } from "./lib/actions";

// const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // if (!isPublicRoute(req)) await auth.protect();

  const url = req.nextUrl;
  const pathname = url.pathname;

  // get host name (eg. micro.com test.micro.com)
  const hostname = req.headers.get("host");

  let currentHost;
  if (process.env.NODE_ENV === "production") {
    // In production, use the custom base domain from environment variables
    const baseDomain = process.env.BASE_DOMAIN;
    currentHost = hostname?.replace(`.${baseDomain}`, "");
  } else {
    // In development, handle localhost case
    currentHost = hostname?.replace(`.localhost:3000`, "");
  }

  // If there's no currentHost, likely accessing the root domain, handle accordingly
  if (!currentHost) {
    // Continue to the next middleware or serve the root content
    return NextResponse.next();
  }

  // Fetch tenant-specific data based on the subdomain
  const response = await readSiteSubdomain(currentHost);

  // Handle the case where no subdomain data is found
  if (response.error || !response.data || !response.data.length) {
    // Continue to the next middleware or serve the root content
    return NextResponse.next();
  }

  const site_id = response.data[0]?.id;
  // Get the tenant's subdomain from the response
  const tenantSubdomain = response.data[0]?.subdomain;
  console.log("tenantSub: ", tenantSubdomain);
  console.log("pathname: ", pathname);

  if (tenantSubdomain) {
    return NextResponse.rewrite(new URL(`/${site_id}${pathname}`, req.url));
  }

  // Rewrite the URL to the tenant-specific path
  return NextResponse.rewrite(
    new URL(tenantSubdomain === "/" ? "" : `/alexgalicio.dev`, req.url)
  );
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
