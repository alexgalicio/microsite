import CareerCard, { Career } from "./career-card";

interface CareersProps {
  careers: Career[];
}

export default function Careers({ careers }: CareersProps) {
  return (
    <section id="career" className="py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-[690px] text-center">
          <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl md:text-[44px] md:leading-tight">
            Career Paths
          </h2>
          <p className="text-body text-base">
            See common career paths when you choose this program
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 lg:px-24">
        <div className="grid gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
          {careers.map((career, index) => (
            <CareerCard
              key={index}
              title={career.title}
              description={career.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
