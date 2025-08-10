import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Header() {
  const [isLoading, setIsLoading] = useState(false);

  const handleBackClick = () => {
    setIsLoading(true);
  };

  return (
    <section className="flex items-center justify-between mt-8 md:mt-16 mb-12">
      <Link href="/announcements">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
          Announcements.
        </h1>
      </Link>
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "ghost" }))}
        onClick={handleBackClick}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
        <span className="hidden lg:inline">Home</span>
      </Link>
    </section>
  );
}
