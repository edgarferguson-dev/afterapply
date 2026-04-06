import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(49,116,255,0.35)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,#335cff,#1686ff)] text-white shadow-[0_14px_36px_rgba(43,93,255,0.28)] hover:translate-y-[-1px]",
        secondary:
          "border border-white/12 bg-white/70 text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur hover:bg-white",
        ghost: "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900",
        coral:
          "bg-[linear-gradient(135deg,#ff7f71,#ff5f6d)] text-white shadow-[0_14px_36px_rgba(255,95,109,0.22)] hover:translate-y-[-1px]",
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
