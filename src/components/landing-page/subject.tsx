"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { fadeUp } from "./animation";

interface Year {
  title: string;
  subjects: string[];
}

interface SubjectsProps {
  years: Year[];
}

export default function Subjects({ years }: SubjectsProps) {
  return (
    <section id="career" className="py-16 md:py-20 lg:py-28 bg-[#F8FAFB]">
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
            Subjects
          </motion.h2>

          <motion.p
            className="text-body text-base"
            custom={1}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Explore the subjects you&apos;ll take each year in this program
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-8 lg:px-24">
        <Accordion
          type="single"
          collapsible
          className="max-w-2xl w-full my-4 space-y-2 mx-auto"
        >
          {years.map((year, index) => (
            <motion.div
              key={index}
              custom={2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-md px-4"
              >
                <AccordionTrigger className="hover:no-underline text-lg">
                  {year.title}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance">
                  <ul className="space-y-2 px-4 text-base">
                    {year.subjects.map((subject, subjectIndex) => (
                      <li key={subjectIndex} className="list-disc list-inside">
                        {subject}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
