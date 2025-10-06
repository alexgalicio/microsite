import Image from "next/image";

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
      
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/10 -z-5"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[800px] text-center">
              <h1 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                {heading}
              </h1>
              <p className="text-base leading-relaxed text-white sm:text-lg md:text-xl">
                {subheading}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}