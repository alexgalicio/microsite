export interface Career {
  title: string;
  description: string;
}

export default function CareerCard({ title, description }: Career) {
  return (
    <div className="h-full rounded-lg border p-4 hover:shadow-md flex flex-col">
      <h2 className="mb-2 font-semibold">{title}</h2>
      <p className="text-muted-foreground flex-grow">{description}</p>
    </div>
  );
}
