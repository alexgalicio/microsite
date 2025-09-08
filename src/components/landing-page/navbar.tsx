"use client";

import Link from "next/link";
import MegaMenu from "./mega-menu";

export default function Navbar() {
  return (
    <div className="flex gap-6 font-normal flex-col lg:flex-row lg:items-center">
      <Link href="/" className="hover:text-primary px-4 py-2">
        Home
      </Link>
      <Link href="/#programs" className="hover:text-primary px-4 py-2">
        Programs
      </Link>
      <Link href="#about" className="hover:text-primary px-4 py-2">
        About
      </Link>
      <Link href="/#contact" className="hover:text-primary px-4 py-2">
        Contact
      </Link>
      <MegaMenu />
    </div>
  );
}
