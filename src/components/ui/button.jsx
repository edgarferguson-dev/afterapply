import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(31,122,108,0.2)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[color:var(--fp-blue)] text-white shadow-[var(--fp-shadow-md)] hover:translate-y-[-1px]",
        secondary:
          "border border-[color:var(--fp-line)] bg-[color:var(--fp-surface)] text-[color:var(--fp-ink)] shadow-[var(--fp-shadow-sm)] hover:bg-white",
        ghost: "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900",
        coral:
          "border border-[color:rgba(238,53,46,0.2)] bg-transparent text-[color:var(--fp-red)] hover:bg-[color:rgba(238,53,46,0.06)]",
      },
      size: {
        sm: "h-9 px-4",
        default: "h-11 px-5",
        lg: "h-12 px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? "span" : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
