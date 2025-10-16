"use client";

import { fadeUp } from "./animation";
import CareerCard, { Career } from "./career-card";
import { motion } from "framer-motion";

interface CareersProps {
  careers: Career[];
}

export default function Careers({ careers }: CareersProps) {
  return (
    <section id="career" className="py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-[690px] text-center">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl md:text-[44px] md:leading-tight">
              Career Paths
            </h2>
          </motion.div>

          <motion.p
            className="text-body text-base"
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            See common career paths when you choose this program
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-24">
        <div className="grid gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
          {careers.map((career, index) => (
            <motion.div
              key={index}
              custom={2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <CareerCard
                key={index}
                title={career.title}
                description={career.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
