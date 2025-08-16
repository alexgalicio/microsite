import { ReactNode } from "react"

type FeatureCardProps = {
    title: string,
    description: string
    icon: ReactNode;
}

function FeatureCard({title, description, icon} : FeatureCardProps) {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <div>{icon}</div>
      <div>
        <p className="font-bold text-lg">{title}</p>
        <p>{description}</p>
      </div>
        
    </div>
  )
}

export default FeatureCard