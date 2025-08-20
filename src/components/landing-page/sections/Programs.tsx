import Image from "next/image"
import Link from "next/link"
import ProgramCard from "@/components/landing-page/ui/ProgramCard"

function Programs() {
  return (
    <section className="py-8">
        <div className="container mx-auto px-4">
            <h2 className="text-center font-medium text-3xl mb-12 md:text-4xl">
                Our Programs
            </h2>
            <div className="flex flex-col flex-wrap items-center gap-8 md:gap-12 md:flex-row md:justify-between">
                <ProgramCard title="Bachelor of Science in Information Technology"/>
                <ProgramCard title="Bachelor of Library and Information Science"/>
                <ProgramCard title="Bachelor of Science in Information Systems"/>
            </div>
        </div>
    </section>
  )
}

export default Programs