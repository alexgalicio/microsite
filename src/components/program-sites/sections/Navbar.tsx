"use client"
import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

type NavbarProp = {
    programName: string
}

function Navbar({ programName }: NavbarProp) {
    const [showNav, setShowNav] = useState(false)

    const navlinks = (
        <>
            <li><a href="#" className="">Home</a></li>
            <li><a href="#" className="">About</a></li>
            <li><a href="#" className="">Subjects</a></li>
            <li><a href="#" className="">Careers</a></li>
            <li><a href="#" className="">Organization</a></li>
        </>
    )

    return (
        <nav className="bg-white sticky top-0 shadow-md z-[1000]">
            <div className="container mx-auto flex justify-between items-center p-4 sm:p-6">
                <Link href={"/"} className="text-xl font-bold">
                    {programName}
                </Link>

                <button className="md:hidden" onClick={() => setShowNav(!showNav)}>
                    {showNav ? <X size={27} /> : <Menu size={27} />}
                </button>

                <ul className="hidden md:flex md:space-x-8 font-medium text-gray-800">
                    {navlinks}
                </ul>

                {showNav && (
                    <ul className="absolute top-full w-full left-0 bg-white pb-4 flex flex-col items-center space-y-8 pt-4 font-medium text-gray-800 md:hidden shadow-md">
                        {navlinks}
                    </ul>
                )}
            </div>
        </nav>
    )
}

export default Navbar