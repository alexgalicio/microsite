import CareerCard from "./CareerCard"

type Career = {
    title: string, 
    description: string
}

type CareersProps = {
    careers: Career[]
}

function Careers({ careers }: CareersProps) {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 flex flex-col items-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900">
                    Career Paths
                </h2>
                <p className="text-gray-600 text-center max-w-xl text-base md:text-lg">
                    See common career paths when you choose this program
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {careers.map((career, index) => (
                        <CareerCard 
                            key={index} 
                            title={career.title} 
                            description={career.description} 
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Careers
