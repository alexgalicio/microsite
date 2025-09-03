import { ReactNode } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="w-full px-4">
      <div className="wow fadeInUp group mb-12" data-wow-delay=".15s">
        <div className="relative z-10 mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-primary">
          <span className="absolute left-0 top-0 z-[-1] mb-8 flex h-[70px] w-[70px] rotate-[25deg] items-center justify-center rounded-2xl bg-primary/30 duration-300 group-hover:rotate-45"></span>
          <div className="text-white">{icon}</div>
        </div>
        <h3 className="mb-3 text-xl font-bold">{title}</h3>
        <p className="text-body-color lg:mb-11">{description}</p>
      </div>
    </div>
  );
}

export default FeatureCard;
