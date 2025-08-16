import FeatureCard from "@/components/landing-page/ui/FeatureCard";
import { Monitor, UserCheck, Briefcase, Users } from "lucide-react";

function Features() {
  return (
    <section className="bg-amber-500 text-blue-950 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-center font-semibold text-3xl mb-16 md:text-4xl tracking-tight">
          Why Choose CICT?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Monitor size={40} />}
            title="Cutting-Edge Facilities"
            description="Access modern lab rooms and collaborative spaces"
          />
          <FeatureCard
            icon={<UserCheck size={40} />}
            title="Expert Professors & Instructors"
            description="Learn from seasoned professionals"
          />
          <FeatureCard
            icon={<Briefcase size={40} />}
            title="Career Opportunities"
            description="Internships, career programs, and more"
          />
          <FeatureCard
            icon={<Users size={40} />}
            title="Active Student Communities"
            description="Engage in orgs, events, and collaborations"
          />
        </div>
      </div>
    </section>
  );
}

export default Features;
