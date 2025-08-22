import Image from "next/image"

type AboutProps = {
    heading: string,
    subheading: string
}

function About({heading, subheading} : AboutProps) {
    return(
        <section className="py-8">
            <div className="container mx-auto px-4 flex flex-col md:flex-row gap-4 items-center space-y-4">
                <div className="flex flex-col gap-4 text-center md:text-left md:w-1/2">
                    <h2 className="text-3xl font-extrabold text-gray-900 leading-snug">{heading}</h2>
                    <p className="text-gray-700 text-base md:text-lg">
                        {subheading}
                    </p>
                </div>
                <Image src={"/images/CICTFaculty.png"} alt="about us section image" width={500} height={300} className="w-full h-96 md:w-1/2 md:h-[500px] object-contain lg:object-cover" />
            </div>
        </section>
    )
}

export default About