"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "./navbar";
import { useEffect, useState } from "react";
import { getConfiguration } from "@/lib/actions/settings";

interface Config {
  logo: string;
  page_title: string;
  logo_width: number;
  logo_height: number;
}

export default function Header() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [logo, setLogo] = useState<string>();
  const [pageTitle, setPageTitle] = useState<string>();
  const [logoWidth, setLogoWidth] = useState<number>(50);
  const [logoHeight, setLogoHeight] = useState<number>(50);

  // used localStorage so the header doesnt have to re-fetch data everytime the page loads
  // for ux purposes
  useEffect(() => {
    const stored = localStorage.getItem("config");

    // load existing config from localStorage
    if (stored) {
      const config: Config = JSON.parse(stored);
      setLogo(config.logo);
      setPageTitle(config.page_title);
      setLogoWidth(config.logo_width || 50);
      setLogoHeight(config.logo_height || 50);
    }

    // fetch latest configuration from server
    async function refreshConfig() {
      const config = await getConfiguration();
      if (!config) return;

      const newConfig = JSON.stringify(config);

      // only update if the data is new or changed
      if (stored !== newConfig) {
        setLogo(config.logo);
        setPageTitle(config.page_title);
        setLogoWidth(config.logo_width || 50);
        setLogoHeight(config.logo_height || 50);
        localStorage.setItem("config", newConfig);
      }
    }

    refreshConfig();
  }, []);

  // mobile menu open/close state
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <div>
      <header className="header top-0 left-0 z-50 flex w-full items-center shadow-sticky fixed bg-white transition h-20">
        <div className="container mx-auto px-4 xl:px-24">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-full max-w-lg px-4 lg:mr-12">
              <Link
                href="/"
                className="flex items-center gap-4 header-logo block w-full py-4"
              >
                {/* load image if exists */}
                {logo && (
                  <Image
                    src={logo}
                    alt="Logo"
                    width={logoWidth}
                    height={logoHeight}
                    style={{
                      objectFit: "contain",
                    }}
                  />
                )}

                {/* load page title if exists */}
                {pageTitle && (
                  <h1 className="hidden sm:block font-medium text-lg leading-tight">
                    {pageTitle}
                  </h1>
                )}
              </Link>
            </div>

            <div className="flex w-full items-center justify-end px-4">
              <div className="relative">
                {/* hamburger menu */}
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
