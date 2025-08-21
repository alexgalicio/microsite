"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

function Navbar() {
  const [showNav, setShowNav] = useState(false)

  const navlinks = (
    <>
      <li><a href="#" className="hover:text-yellow-500 transition">Home</a></li>
      <li><a href="#" className="hover:text-yellow-500 transition">Programs</a></li>
      <li><a href="#" className="hover:text-yellow-500 transition">About</a></li>
      <li><a href="#" className="hover:text-yellow-500 transition">Microsites</a></li>
    </>
  )

  return (
    <nav className="bg-white sticky top-0 shadow-md z-[1000]">
      <div className="container mx-auto flex justify-between items-center p-4 sm:p-6">
        <Link href={"/"}>
          <div className="flex items-center space-x-2">
            <Image src={"/images/cict.png"} height={40} width={40} alt="college logo" />
            <span className="text-xl font-bold">CICT</span>
          </div>
        </Link>

        <button className="md:hidden" onClick={()=> setShowNav(!showNav)}>
          {showNav ? <X size={27}/> : <Menu size={27}/>}
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