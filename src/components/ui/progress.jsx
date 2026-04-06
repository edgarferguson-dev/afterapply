import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../../lib/utils";

export function Progress({ className, value, indicatorClassName }) {
  return (
    <ProgressPrimitive.Root
      className={cn(
        "relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80",
        className,
      )}
      value={value}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full rounded-full bg-[linear-gradient(90deg,#04c8c4,#355fff)] transition-transform duration-500 ease-out",
          indicatorClassName,
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
