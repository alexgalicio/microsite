"use client";
import { useState } from "react"
import { ChevronDown } from "lucide-react"

type Year = {
  title: string;
  subjects: string[];
}

type SubjectsProps = {
  years: Year[];
}

function Subjects({years} : SubjectsProps) {

  const [open, setOpen] = useState(Array(years.length).fill(false));

  const toggle = (i: number) => {
    setOpen((prev) => prev.map((val, idx) => (idx === i ? !val : val)));
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex flex-col items-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900">
          Subjects
        </h2>
        <p className="text-gray-600 text-center max-w-xl text-base md:text-lg">
          Explore the subjects you’ll take each year in this program.
        </p>

        <div className="w-full max-w-2xl space-y-4">
          {years.map((year, i) => (
            <div
              key={i}
              className="border rounded-xl shadow-sm bg-white overflow-hidden transition hover:shadow-md"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex justify-between items-center px-4 py-3 font-semibold text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {year.title}
                <ChevronDown
                  className={`h-5 w-5 text-gray-600 transition-transform duration-200 ${
                    open[i] ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  open[i] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <ul className="px-6 py-4 space-y-2 text-gray-700 list-disc">
                  {year.subjects.map((subj, j) => (
                    <li key={j}>{subj}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Subjects
