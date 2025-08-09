import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        backgroundImage: 'url("/images/background.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <SignIn />
    </div>
  );
}
