import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        default: "border-slate-200 bg-slate-900/5 text-slate-600",
        indigo: "border-indigo-200 bg-indigo-500/10 text-indigo-700",
        aqua: "border-cyan-200 bg-cyan-400/10 text-cyan-700",
        coral: "border-rose-200 bg-rose-400/10 text-rose-700",
        gold: "border-amber-200 bg-amber-400/10 text-amber-700",
        success: "border-emerald-200 bg-emerald-400/10 text-emerald-700",
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
