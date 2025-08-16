import { ReactNode } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md transition-shadow duration-300 space-y-4">
      <div className="text-amber-500">{icon}</div>
      <div>
        <p className="font-semibold text-lg mb-1">{title}</p>
        <p className="text-sm text-gray-700">{description}</p>
      </div>
    </div>
  );
}

export default FeatureCard;
