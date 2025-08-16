import FeatureCard from "@/components/landing-page/ui/FeatureCard"
import { Monitor, UserCheck, Briefcase, Users } from "lucide-react";

function Features() {
    return (
        <section className="bg-amber-500 text-blue-950 py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-center font-medium text-3xl mb-12 md:text-4xl">
                    Why Choose CICT?
                </h2>
                <div className="flex flex-col space-y-8 items-center gap-8 md:flex-row md:justify-between md:space-y-0">
                    <FeatureCard icon={<Monitor size={40}/>} title="Cutting-Edge Facilities" description="Access modern lab rooms and collaborative spaces"/>
                    <FeatureCard icon={<UserCheck size={40}/>} title="Expert professors and instructors" description="Learn from seasoned professionals"/>
                    <FeatureCard icon={<Briefcase size={40}/>} title="Career Opportunities" description="Internships, career programs, and more"/>
                    <FeatureCard icon={<Users size={40}/>} title="Active Student Communities" description="Engage in organizations, events, and collaborations"/>
                </div>
            </div>
        </section>
    )
}

export default Features