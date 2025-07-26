import { SignOutButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <h1>logged in</h1>
      <SignOutButton />
    </>
  );
}
