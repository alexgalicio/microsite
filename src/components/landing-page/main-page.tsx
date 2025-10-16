"use client";

import Header from "./header";
import Hero from "./hero";
import About from "./about";
import Footer from "./footer";
import Program from "./program";
import Feature from "./feature";
import Calendar from "./calendar";
import Contact from "./contact";
import Team from "./team";

export default function LandingPage() {
  return (
    <main>
      <Header />
      <Hero
        heading="College of Information and Communications Technology"
        subheading="A Center of Innovation at Bulacan State University where future
                tech innovators grow and excel"
      />
      <Program />
      <Feature />
      <About
        span="CICT"
        heading="Empowering Future Tech Innovators"
        description="The College of Information and Communications Technology
                  (CICT) equips students with the knowledge and skills needed to
                  thrive in the ever-evolving world of technology. Through
                  innovative learning, industry-aligned programs, and hands-on
                  experience, we prepare future IT professionals to lead,
                  create, and innovate in the digital age."
        image="/images/cict_faculty.svg"
      />
      <Calendar />
      <Contact />
      <Team />
      <Footer />
    </main>
  );
}
