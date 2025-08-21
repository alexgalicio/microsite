import Image from "next/image"
import Link from "next/link"

type ProgramCardProps = {
    title: string,
    link: string
}

function ProgramCard({title, link} : ProgramCardProps) {
    return (
        <div className="flex flex-col grow space-y-2 items-center">
            <Image src={"/images/cict.png"} alt="college logo" width={200} height={200}></Image>
            <p className="text-center font-bold text-md lg:text-lg">{title}</p>
            <Link href={link} className="self-stretch text-center font-medium py-2 border-2 border-blue-950 sm:self-center sm:px-12 transition hover:bg-blue-950 hover:text-white">
                Learn More
            </Link>
        </div>
    )
}

export default ProgramCard