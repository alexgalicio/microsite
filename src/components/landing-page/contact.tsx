"use client";

import ContactForm from "@/components/feedback/feedback-form";
import { motion } from "framer-motion";
import { fadeUp } from "./animation";

export default function Contact() {
  return (
    <section id="contact" className="py-16 md:py-20 lg:py-28 bg-[#F8FAFB]">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-[690px] text-center">
          <motion.h2
            className="mb-4 text-3xl font-bold text-black sm:text-4xl md:text-[44px] md:leading-tight"
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Let&apos;s Stay Connected
          </motion.h2>

          <motion.p
            className="text-body text-base"
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            We value your thoughts and suggestions. Share your feedback with us
            to help us improve and serve you better.
          </motion.p>
        </div>
      </div>

      <motion.div
        className="container mx-auto px-4"
        custom={2}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="mx-auto w-full max-w-[925px] rounded-lg bg-background px-8 py-10 sm:px-10">
          <ContactForm />
        </div>
      </motion.div>
    </section>
  );
}
