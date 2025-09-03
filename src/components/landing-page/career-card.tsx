export interface Career {
  title: string;
  description: string;
}

export default function CareerCard({ title, description }: Career) {
  return (
    <div className="rounded-lg border p-4 hover:shadow-md">
      <h2 className="mb-1 font-semibold">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
