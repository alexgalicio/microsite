"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getMenuandSubmenu } from "@/lib/actions/menu";

interface SubLink {
  id: string;
  name: string;
  link: string;
}

interface Menu {
  id: string;
  title: string;
  sublink: SubLink[];
}

export default function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubHeading, setActiveSubHeading] = useState("");
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    const fetchMenus = async () => {
      const response = await getMenuandSubmenu();
      setMenus(response);
    };
    fetchMenus();
  }, []);

  return (
    <div>
      <div className="text-left md:cursor-pointer group">
        <div
          className="flex flex-row justify-between px-4 py-2 lg:py-7 items-center hover:text-primary"
          onClick={() => {
            setIsOpen(!isOpen);
            setActiveSubHeading("");
          }}
        >
          <h1 className="group">Microsites</h1>
          <span className="text-xl lg:hidden inline">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
          <span className="text-xl md:ml-2 lg:block hidden transition-transform duration-200 group-hover:rotate-180">
            <ChevronDown size={16} />
          </span>
        </div>

        {/* desktop dropdown */}
        <div
          className="
            fixed top-20 left-0 right-0 z-30 bg-white lg:px-32 py-4 shadow-2xl
            opacity-0 -translate-y-4 pointer-events-none
            group-hover:lg:opacity-100 group-hover:lg:-translate-y-0 group-hover:lg:pointer-events-auto
            transition-opacity transition-transform duration-300 ease-in-out
          "
        >
          <div className="container mx-auto p-5 grid grid-cols-5 gap-10">
            {menus.map((section) => (
              <div key={section.id}>
                <h1 className="text-lg font-semibold">{section.title}</h1>
                {section.sublink.map((item) => (
                  <li
                    key={item.id}
                    className="text-sm text-muted-foreground my-2.5 list-none"
                  >
                    <Link
                      href={item.link}
                      className="hover:text-primary transition-colors duration-100"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* mobile menu */}
      <div
        className={`lg:hidden px-6 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen opacity-100 pt-2 pb-4" : "max-h-0 opacity-0"
        }`}
      >
        {menus.map((section) => (
          <div key={section.id}>
            <h1
              onClick={() =>
                activeSubHeading !== section.title
                  ? setActiveSubHeading(section.title)
                  : setActiveSubHeading("")
              }
              className="font-semibold py-4 flex justify-between items-center cursor-pointer"
            >
              {section.title}
              <span className="text-xl inline transition-transform duration-300">
                {activeSubHeading === section.title ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </span>
            </h1>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                activeSubHeading === section.title
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {section.sublink.map((item) => (
                <li key={item.id} className="px-6 py-2 list-none">
                  <Link
                    href={item.link}
                    className="hover:text-primary transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
