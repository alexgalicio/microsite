"use client";

import { motion } from "framer-motion";
import ProgramCard from "./program-card";
import { fadeUp } from "./animation";

const programs = [
  {
    title: "Bachelor of Science in Information Technology",
    link: "/programs/bsit",
  },
  {
    title: "Bachelor of Library and Information Science",
    link: "/programs/blis",
  },
  {
    title: "Bachelor of Science in Information Systems",
    link: "/programs/bsis",
  },
];

export default function Program() {
  return (
    <section id="programs" className="py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 xl:px-24">
        <motion.div
          className="w-full mx-auto text-center max-w-[570px] mb-[70px]"
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-[45px]">
            Our Programs
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-3 lg:grid-cols-3">
          {programs.map((program, i) => (
            <motion.div
              key={i}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <ProgramCard {...program} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
