import About from "@/components/landing-page/about";
import Career from "@/components/landing-page/career";
import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import Hero from "@/components/landing-page/hero";
import Subject from "@/components/landing-page/subject";

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ program: string }>;
}) {
  const { program } = await params;

  const data = await import(`@/data/${program}.json`).then(
    (mod) => mod.default
  );

  return (
    <>
      <Header />
      <Hero
        heading={data.heroSection.heading}
        subheading={data.heroSection.subheading}
      />
      <About
        span={data.acronym}
        title={data.aboutSection.heading}
        description={data.aboutSection.subheading}
      />
      <Subject years={data.subjectsSection} />
      <Career careers={data.careerSection} />
      <Footer />
    </>
  );
}
