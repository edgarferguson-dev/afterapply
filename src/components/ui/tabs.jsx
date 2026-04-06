import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";

export function Tabs(props) {
  return <TabsPrimitive.Root {...props} />;
}

export function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex h-12 items-center rounded-full border border-white/70 bg-white/70 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-slate-500 transition data-[state=active]:bg-slate-950 data-[state=active]:text-white",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      className={cn("outline-none data-[state=inactive]:hidden", className)}
      {...props}
    />
  );
}
