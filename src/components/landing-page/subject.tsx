import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
          <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl md:text-[44px] md:leading-tight">
            Subjects
          </h2>
          <p className="text-body text-base">
            Explore the subjects you&apos;ll take each year in this program
          </p>
        </div>
      </div>
      <div className="container mx-auto px-8 lg:px-24">
        <Accordion type="single" collapsible className="max-w-2xl w-full my-4 space-y-2 mx-auto">
          {years.map((year, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-md px-4">
              <AccordionTrigger className="hover:no-underline text-lg">{year.title}</AccordionTrigger>
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
          ))}
        </Accordion>
      </div>
    </section>
  );
}
