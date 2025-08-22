type CareerCardProp = {
    title: string,
    description: string
}

function CareerCard({ title, description }: CareerCardProp) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm">
          {description}
        </p>
    </div>
  )
}

export default CareerCard
