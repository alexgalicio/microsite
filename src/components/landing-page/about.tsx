"use client";

import Image from "next/image";
import { useRef } from "react";
import { useInView } from "framer-motion";

interface AboutProps {
  span: string;
  heading: string;
  description: string;
  image: string;
}

export default function About({
  span,
  heading,
  description,
  image,
}: AboutProps) {
  const textRef = useRef(null);
  const imageRef = useRef(null);

  const textInView = useInView(textRef, { once: true, amount: 0.3 });
  const imageInView = useInView(imageRef, { once: true, amount: 0.3 });

  return (
    <section
      id="about"
      className="bg-gray-1 py-16 md:py-20 lg:py-28 overflow-hidden"
    >
      <div className="container mx-auto px-4 xl:px-20">
        <div className="flex flex-wrap items-center">
          <div
            ref={textRef}
            className="w-full px-4 lg:w-1/2"
            style={{
              transform: textInView ? "none" : "translateX(-150px)",
              opacity: textInView ? 1 : 0,
              transition: "all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s",
            }}
          >
            <div className="w-full mx-auto max-w-[570px]">
              <span className="mb-2 text-lg font-semibold text-primary">
                About {span}
              </span>
              <h2 className="mb-4 text-3xl font-bold text-black sm:text-4xl md:text-[45px]">
                {heading}
              </h2>
              <p className="text-base md:text-lg mb-10">{description}</p>
            </div>
          </div>

          <div
            ref={imageRef}
            className="w-full px-4 lg:w-1/2"
            style={{
              transform: imageInView ? "none" : "translateX(150px)",
              opacity: imageInView ? 1 : 0,
              transition: "all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) 0.4s",
            }}
          >
            <div className="relative mx-auto max-w-[570px]">
              <div className="relative aspect-[11/6] overflow-hidden rounded-xl shadow-lg">
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
