"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center h-[60vh]",
        className
      )}
    >
      <div className="flex justify-center isolate">
        {icon && (
          <div className="bg-background size-12 grid place-items-center rounded-xl shadow-lg ring-1 ring-border transition duration-500 hover:-translate-y-0.5 hover:duration-200">
            {icon}
          </div>
        )}
      </div>
      <h2 className="text-foreground font-medium mt-6">{title}</h2>
      <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">
        {description}
      </p>
    </div>
  );
}
