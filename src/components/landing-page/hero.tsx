import Image from "next/image";

interface HeroProps {
  heading: string;
  subheading: string;
}

export default function Hero({ heading, subheading }: HeroProps) {
  return (
    <section
      id="home"
      className="relative z-10 overflow-hidden pb-16 pb-[200px] pt-[270px]"
    >
      <Image
        src="/images/background.png"
        alt="Background"
        fill
        className="object-cover object-center -z-10"
        priority
      />
      <div className="container mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[800px] text-center">
              <h1 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                {heading}
              </h1>
              <p className="text-base leading-relaxed! text-white sm:text-lg md:text-xl">
                {subheading}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
