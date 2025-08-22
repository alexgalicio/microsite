"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Year = {
  title: string;
  subjects: string[];
};

type SubjectsProps = {
  years: Year[];
};

function Subjects({ years }: SubjectsProps) {
  // Track which years are open → array of booleans
  const [open, setOpen] = useState<boolean[]>(Array(years.length).fill(false));

  const toggle = (i: number) => {
    setOpen((prev) =>
      prev.map((val, idx) => (idx === i ? !val : val))
    );
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex flex-col items-center space-y-8">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900">
          Subjects
        </h2>
        <p className="text-gray-600 text-center max-w-2xl text-base md:text-lg">
          Explore the subjects you’ll take each year in this program.
        </p>

        {/* Accordions */}
        <div className="w-full max-w-2xl space-y-6">
          {years.map((year, i) => (
            <div
              key={year.title}
              className="border rounded-2xl shadow-sm bg-white overflow-hidden transition hover:shadow-md"
            >
              <button
                onClick={() => toggle(i)}
                aria-expanded={open[i]}
                className="w-full flex justify-between items-center px-6 py-4 font-semibold text-lg text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {year.title}
                <ChevronDown
                  className={`h-5 w-5 text-gray-600 transition-transform duration-200 ${
                    open[i] ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {open[i] && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ul className="px-8 py-5 space-y-3 text-gray-700 list-disc">
                      {year.subjects.map((subj) => (
                        <li key={subj} className="leading-relaxed">
                          {subj}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Subjects;
