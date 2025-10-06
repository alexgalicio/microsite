import Image from "next/image";

interface AboutProps {
  span: string;
  heading: string;
  description: string;
  image: string;
}

export default function About({ span, heading, description, image }: AboutProps) {
  return (
    <section
      id="about"
      className="bg-gray-1 py-16 md:py-20 lg:py-28"
    >
      <div className="container mx-auto px-4 xl:px-20">
        <div className="flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div className="w-full mx-auto max-w-[570px]">
              <span className="mb-2 text-lg font-semibold text-primary">
                About {span}
              </span>
              <h2 className="mb-4 text-3xl font-bold leading-tight! text-black sm:text-4xl md:text-[45px]">
                {heading}
              </h2>
              <p className="text-base leading-relaxed! md:text-lg mb-10">
                {description}
              </p>
            </div>
          </div>

          <div className="w-full px-4 lg:w-1/2">
            <div className="relative mx-auto max-w-[570px]">
              <div className="relative aspect-[11/6] overflow-hidden">
                <Image
                  src={image}
                  alt="about-image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
