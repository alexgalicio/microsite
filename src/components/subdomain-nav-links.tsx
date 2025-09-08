"use client";

import Link from "next/link";

export default function SubdomainNavLinks({ subdomain }: { subdomain: string }) {
  return (
    <div className="flex gap-6 font-normal flex-col lg:flex-row lg:items-center">
      <Link href="/" className="hover:text-primary px-4 py-2">
        Home
      </Link>
      <Link
        href={`https://${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/announcements`}
        className="hover:text-primary px-4 py-2"
      >
        Announcements
      </Link>
      <Link href="/#photos" className="hover:text-primary px-4 py-2">
        Photos
      </Link>
      <Link href="/#about" className="hover:text-primary px-4 py-2">
        About
      </Link>
      <Link href="/#testimonial" className="hover:text-primary px-4 py-2">
        Testimonial
      </Link>
      <Link
        href={`https://${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/links`}
        className="hover:text-primary px-4 py-2"
      >
        Links
      </Link>
    </div>
  );
}
