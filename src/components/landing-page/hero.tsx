"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "./animation";

interface HeroProps {
  heading: string;
  subheading: string;
}

export default function Hero({ heading, subheading }: HeroProps) {
  return (
    <section
      id="home"
      className="relative z-10 overflow-hidden pb-[200px] pt-[280px]"
    >
      <Image
        src="/images/pimentel.jpg"
        alt="Background"
        fill
        className="object-cover object-center -z-10"
        priority
      />

      <div className="absolute inset-0 bg-black/10 -z-5"></div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[800px] text-center">
              <motion.h1
                className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight"
                custom={0}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {heading}
              </motion.h1>

              <motion.p
                className="text-base leading-relaxed text-white sm:text-lg md:text-xl"
                custom={1}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {subheading}
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
