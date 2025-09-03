"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "./navbar";
import { useState } from "react";

export default function Header() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <div>
      <header className="header top-0 left-0 z-50 flex w-full items-center shadow-sticky fixed bg-white transition h-20">
        <div className="container mx-auto px-4 xl:px-24">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-100 max-w-full px-4 xl:mr-12">
              <Link href="/" className="header-logo block w-full py-4">
                <Image
                  src="/images/cict_logo.svg"
                  alt="CICT Logo"
                  width={140}
                  height={30}
                  className="w-full"
                />
              </Link>
            </div>
            <div className="flex w-full items-center justify-end px-4">
              <div className="relative">
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="ring-primary block rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 ${
                      navbarOpen ? "top-[7px] rotate-45" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 ${
                      navbarOpen ? "opacity-0" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 ${
                      navbarOpen ? "top-[-8px] -rotate-45" : " "
                    }`}
                  />
                </button>

                {/* desktop nav */}
                <nav className="hidden lg:block">
                  <Navbar />
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* mobile nav */}
        <nav
          id="navbarCollapse"
          className={`navbar fixed left-0 right-0 top-20 z-30 border-t-[1px] bg-white px-6 transition-all duration-300 ease-in-out lg:hidden overflow-hidden ${
            navbarOpen ? "h-[calc(100vh-4rem)] py-4" : "h-0 py-0"
          }`}
        >
          <div className="overflow-y-auto h-full">
            <Navbar />
          </div>
        </nav>
      </header>
    </div>
  );
}
