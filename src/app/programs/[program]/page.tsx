import Navbar from "@/components/program-sites/sections/Navbar"
import Hero from "@/components/program-sites/sections/Hero"
import About from "@/components/program-sites/sections/About"
import Subjects from "@/components/program-sites/sections/Subjects"
import Careers from "@/components/program-sites/sections/Careers"

type Prop = {
  params : {
    program: string
  }
}

async function page({params} : Prop) {
  const {program} = await params
  const data = await import(`@/data/${program}.json`).then(mod => mod.default)

  return (
    <>
        <Navbar programName={data.acronym}></Navbar>
        <main>
            <Hero heading={data.heroSection.heading} subheading={data.heroSection.subheading}/>
            <About heading={data.aboutSection.heading} subheading={data.aboutSection.subheading}/>
            <Subjects years={data.subjectsSection}/>
            <Careers/>
        </main>
    </>
  )
}

export default page