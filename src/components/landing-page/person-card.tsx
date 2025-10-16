import Image from "next/image";

interface PersonProps {
  image: string;
  name: string;
  role: string;
}

export default function PersonCard({ image, name, role }: PersonProps) {
  return (
    <div className="flex flex-col items-center p-4">
      <Image
        src={image}
        alt="team"
        width={120}
        height={120}
        className="rounded-full"
      />
      <h3 className="text-lg font-bold">{name}</h3>
      <p>{role}</p>
    </div>
  );
}
