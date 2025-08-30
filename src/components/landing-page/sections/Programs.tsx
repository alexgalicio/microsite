import Image from "next/image"
import Link from "next/link"
import ProgramCard from "@/components/landing-page/ui/ProgramCard"

function Programs() {
  return (
    <section className="py-16">
        <div className="container mx-auto px-4">
            <h2 className="text-center font-medium text-3xl mb-12 md:text-4xl">
                Our Programs
            </h2>
            <div className="flex flex-col flex-wrap items-center gap-8 md:gap-12 md:flex-row md:justify-between">
                <ProgramCard title="Bachelor of Science in Information Technology" link="/programs/bsit"/>
                <ProgramCard title="Bachelor of Library and Information Science" link="/programs/blis"/>
                <ProgramCard title="Bachelor of Science in Information Systems" link="/programs/bsis"/>
            </div>
        </div>
    </section>
  )
}

export default Programs