import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        default: "border-[color:var(--fp-line)] bg-[color:var(--fp-surface)] text-[color:var(--fp-muted)]",
        indigo: "border-[color:rgba(0,120,198,0.2)] bg-[color:rgba(0,120,198,0.08)] text-[color:var(--fp-blue)]",
        aqua: "border-[color:rgba(0,169,183,0.2)] bg-[color:rgba(0,169,183,0.08)] text-[color:var(--fp-teal)]",
        coral: "border-[color:rgba(238,53,46,0.18)] bg-[color:rgba(238,53,46,0.08)] text-[color:var(--fp-red)]",
        gold: "border-[color:rgba(122,90,0,0.18)] bg-[color:var(--fp-amber-bg)] text-[color:var(--fp-amber-text)]",
        success: "border-[color:rgba(0,147,60,0.18)] bg-[color:rgba(0,147,60,0.08)] text-[color:var(--fp-green)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
