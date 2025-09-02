import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function ProgramCard({
  title,
  link,
}: {
  title: string;
  link: string;
}) {
  return (
    <div className="w-full">
      <div className="bg-white p-8 lg:px-5 xl:px-8 flex flex-col items-center text-center">
        <Image
          src="/images/cict.png"
          alt="CICT_Logo"
          width={200}
          height={200}
        />
        <h3 className="mt-2 mb-5 text-xl font-bold text-black sm:text-xl lg:text-xl xl:text-2xl">
          {title}
        </h3>
        <Button
          asChild
          variant="ghost"
          className="w-full rounded-xs border-2 border-blue-900 hover:bg-blue-900 hover:text-white text-blue-900"
        >
          <Link href={link}>Learn more</Link>
        </Button>
      </div>
    </div>
  );
}
