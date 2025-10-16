"use client";

import { motion } from "framer-motion";
import FeatureCard from "./feature-card";
import { Briefcase, Monitor, UserCheck, Users } from "lucide-react";
import { fadeUp } from "./animation";

const features = [
  {
    icon: <Monitor />,
    title: "Cutting-Edge Facilities",
    description: "Access modern lab rooms and collaborative spaces",
  },
  {
    icon: <UserCheck />,
    title: "Expert Professors & Instructors",
    description: "Learn from seasoned professionals",
  },
  {
    icon: <Briefcase />,
    title: "Career Opportunities",
    description: "Internships, career programs, and more",
  },
  {
    icon: <Users />,
    title: "Active Student Communities",
    description: "Engage in orgs, events, and collaborations",
  },
];

export default function Feature() {
  return (
    <section className="bg-[#F8FAFB] relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 xl:px-24">
        <motion.div
          className="w-full mx-auto text-center max-w-[570px] mb-[100px]"
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold sm:text-4xl md:text-[45px]">
            Why Choose CICT?
          </h2>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:mt-20 justify-center">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
