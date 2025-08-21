import Navbar from "@/components/program-sites/sections/Navbar"
import Hero from "@/components/program-sites/sections/Hero"
import About from "@/components/program-sites/sections/About"

function page() {
  return (
    <>
        <Navbar programName="BSIT"></Navbar>
        <main>
            <Hero heading="Bachelor of Science in Information Technology" subheading="Choose BSIT as ur course lol it's fun trust me"/>
            <About/>
        </main>
    </>
  )
}

export default page