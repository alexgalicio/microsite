import Navbar from "@/components/program-sites/sections/Navbar";
import Hero from "@/components/program-sites/sections/Hero";
import About from "@/components/program-sites/sections/About";
import Subjects from "@/components/program-sites/sections/Subjects";
import Careers from "@/components/program-sites/sections/Careers";
import Footer from "@/components/program-sites/sections/Footer";

async function page({ params }: { params: Promise<{ program: string }> }) {
  const { program } = await params;

  const data = await import(`@/data/${program}.json`).then(
    (mod) => mod.default
  );

  return (
    <>
      <Navbar programName={data.acronym}></Navbar>
      <main>
        <Hero
          heading={data.heroSection.heading}
          subheading={data.heroSection.subheading}
        />
        <About
          programName={data.acronym}
          heading={data.aboutSection.heading}
          subheading={data.aboutSection.subheading}
        />
        <Subjects years={data.subjectsSection} />
        <Careers careers={data.careerSection} />
      </main>
      <Footer program={data.programName} />
    </>
  );
}

export default page;
