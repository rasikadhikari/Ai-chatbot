"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

// Minimal local Tooltip components fallback to avoid a missing-module compile error.
// These provide a small API-compatible surface used by this file.
export const TooltipProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;

export const Tooltip: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="relative inline-block">{children}</div>
);

export const TooltipTrigger = ({ asChild, children }: { asChild?: boolean; children: React.ReactNode | React.ReactElement }) => {
  if (asChild && React.isValidElement(children)) return children as React.ReactElement;
  return <span>{children}</span>;
};

export const TooltipContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  // keep tooltip content accessible but visually hidden by default
  <span className="sr-only" role="tooltip">
    {children}
  </span>
);

export type ActionsProps = ComponentProps<"div">;

export const Actions = ({ className, children, ...props }: ActionsProps) => (
  <div className={cn("flex items-center gap-1", className)} {...props}>
    {children}
  </div>
);

export type ActionProps = ComponentProps<typeof Button> & {
  tooltip?: string;
  label?: string;
};

export const Action = ({
  tooltip,
  children,
  label,
  className,
  variant = "ghost",
  size = "sm",
  ...props
}: ActionProps) => {
  const button = (
    <Button
      className={cn(
        "size-9 p-1.5 text-muted-foreground hover:text-foreground",
        className
      )}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      {children}
      <span className="sr-only">{label || tooltip}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};
