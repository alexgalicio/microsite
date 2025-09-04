import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div
      className="relative flex justify-center items-center min-h-screen"
      style={{
        backgroundImage: 'url("/images/pimentel.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative">
        <SignIn />
      </div>
    </div>
  );
}
