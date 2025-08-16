import Navbar from "@/components/landing-page/sections/Navbar"
import Hero from "@/components/landing-page/sections/Hero"
import Programs from "@/components/landing-page/sections/Programs"
import Features from "@/components/landing-page/sections/Features"
import About from "@/components/landing-page/sections/About"
import Footer from "@/components/landing-page/sections/Footer"

function Home() {
  return (
    <>
        <Navbar></Navbar>
        <main>
            <Hero></Hero>
            <Programs></Programs>
            <Features></Features>
            <About></About>
        </main>
        <Footer></Footer>
        
    </>
    
  )
}

export default Home