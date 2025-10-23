"use client";

import { motion } from "framer-motion";
import PersonCard from "./person-card";
import { fadeUp } from "./animation";

const teamAdvisers = [
  {
    image: "/images/cict.png",
    name: "Ruel Paraiso, MSIT",
    role: "Capstone Adviser",
  },
  {
    image: "/images/cict.png",
    name: "Jayson Batoon, DIT",
    role: "Capstone Coordinator",
  },
];

const teamMembers = [
  {
    image: "/images/cict.png",
    name: "Alexis Joy Galicio",
    role: "Lead Developer",
  },
  { image: "/images/cict.png", name: "Eddhan Gabryell Tan", role: "Developer" },
  { image: "/images/cict.png", name: "John Joshua Alcaraz", role: "Role" },
  { image: "/images/cict.png", name: "Ynez Yzabel Sanchez", role: "Role" },
  { image: "/images/cict.png", name: "Reyan Concepcion", role: "Role" },
];

export default function Team() {
  return (
    <section id="team" className="py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4 space-y-4">
        {/* section title */}
        <motion.div
          className="w-full mx-auto text-center max-w-[570px] mb-15"
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold leading-tight! sm:text-4xl md:text-[45px]">
            Meet the Team
          </h2>
        </motion.div>

        {/* advisers */}
        <div className="flex gap-15 justify-center flex-wrap mb-10">
          {teamAdvisers.map((person, index) => (
            <motion.div
              key={index}
              custom={index + 1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <PersonCard {...person} />
            </motion.div>
          ))}
        </div>

        {/* team members */}
        <div className="flex gap-15 justify-center flex-wrap">
          {teamMembers.map((person, index) => (
            <motion.div
              key={index}
              custom={index + 2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <PersonCard {...person} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
