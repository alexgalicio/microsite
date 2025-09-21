"use client";

import { getNextEvents } from "@/lib/actions/calendar";
import { Briefcase, Monitor, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "./header";
import Hero from "./hero";
import ProgramCard from "./program-card";
import FeatureCard from "./feature-card";
import About from "./about";
import ContactForm from "../feedback/feedback-form";
import Footer from "./footer";

interface EventItem {
  day: string;
  month: string;
  date: string;
  title: string;
};

export default function LandingPage() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getNextEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main>
      {/* header */}
      <Header />

      {/* hero */}
      <Hero
        heading="College of Information and Communications Technology"
        subheading="A Center of Innovation at Bulacan State University where future
                tech innovators grow and excel"
      />

      {/* programs */}
      <section id="programs" className="py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 xl:px-24">
          <div className="w-full mx-auto text-center max-w-[570px] mb-[70px]">
            <h2 className="text-3xl font-bold leading-tight! sm:text-4xl md:text-[45px]">
              Our Programs
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-3 lg:grid-cols-3">
            <ProgramCard
              title="Bachelor of Science in Information Technology"
              link="/programs/bsit"
            />
            <ProgramCard
              title="Bachelor of Library and Information Science"
              link="/programs/blis"
            />
            <ProgramCard
              title="Bachelor of Science in Information Systems"
              link="/programs/bsis"
            />
          </div>
        </div>
      </section>

      {/* feature */}
      <section className="bg-[#F8FAFB] relative z-10 py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4 xl:px-24">
          <div className="w-full mx-auto text-center max-w-[570px] mb-[100px]">
            <h2 className="text-3xl font-bold leading-tight! sm:text-4xl md:text-[45px]">
              Why Choose CICT?
            </h2>
          </div>

          <div className=" grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:mt-20 justify-center">
            <FeatureCard
              icon={<Monitor />}
              title="Cutting-Edge Facilities"
              description="Access modern lab rooms and collaborative spaces"
            />
            <FeatureCard
              icon={<UserCheck />}
              title="Expert Professors & Instructors"
              description="Learn from seasoned professionals"
            />
            <FeatureCard
              icon={<Briefcase />}
              title="Career Opportunities"
              description="Internships, career programs, and more"
            />
            <FeatureCard
              icon={<Users />}
              title="Active Student Communities"
              description="Engage in orgs, events, and collaborations"
            />
          </div>
        </div>
      </section>

      {/* about */}
      <About
        span="CICT"
        title="Empowering Future Tech Innovators"
        description="The College of Information and Communications Technology
                  (CICT) equips students with the knowledge and skills needed to
                  thrive in the ever-evolving world of technology. Through
                  innovative learning, industry-aligned programs, and hands-on
                  experience, we prepare future IT professionals to lead,
                  create, and innovate in the digital age."
      />

      {/* calendar */}
      <section id="calendar" className="py-16 lg:py-20">
        <div className="bg-primary/80 py-[45px] min-h-[205px]">
          <div className="container mx-auto px-4 xl:px-24">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {events.map((event, index) => (
                <div key={index} className="p-4 text-white">
                  <div className="flex gap-4 items-stretch mx-auto max-w-[300px]">
                    <div className="flex flex-col justify-center items-center">
                      <div className="font-medium uppercase">{event.day}</div>
                      <div className="text-4xl font-bold uppercase">
                        {event.month}
                      </div>
                      <div className="text-5xl font-bold">{event.date}</div>
                    </div>
                    <div className="leading-tight whitespace-pre-line border-l border-white/30 pl-4 ml-4 flex items-center">
                      {event.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* contact form */}
      <section id="contact" className="py-16 md:py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-[690px] text-center">
            <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl md:text-[44px] md:leading-tight">
              Let&apos;s Stay Connected
            </h2>
            <p className="text-body text-base">
              We value your thoughts and suggestions. Share your feedback with
              us to help us improve and serve you better.
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="mx-auto w-full max-w-[925px] rounded-lg bg-[#F8FAFB] px-8 py-10 sm:px-10">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* footer */}
      <Footer />
    </main>
  );
}
