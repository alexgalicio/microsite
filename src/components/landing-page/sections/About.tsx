import Image from "next/image"

function About() {
    return (
        <section className="py-8">
            <div className="container mx-auto items-center px-4 flex flex-col gap-4 md:flex-row">
                <div className="text-center flex flex-col gap-2 md:text-left md:w-1/2">
                    <small className="font-extrabold text-gray-800">
                        ABOUT CICT
                    </small>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug">
                        Empowering Future Tech Innovators
                    </h2>
                    <p className="text-gray-700 text-base md:text-lg">
                        The College of Information and Communications Technology (CICT) equips students with the knowledge and skills needed to thrive in the ever-evolving world of technology. Through innovative learning, industry-aligned programs, and hands-on experience, we prepare future IT professionals to lead, create, and innovate in the digital age.
                    </p>
                </div>
                <Image src={"/images/CICTFaculty.png"} alt="college faculty" width={500} height={300} className="w-full h-96 md:w-1/2 md:h-[500px] object-contain lg:object-cover" />
            </div>
        </section>
    )
}

export default About