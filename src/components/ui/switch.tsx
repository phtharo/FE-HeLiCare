import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "../../lib/utils";

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  thumbClassName?: string;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, thumbClassName, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      // Track (thanh dài)
      "peer inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full " +
        "border-2 border-transparent transition-colors " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
        "disabled:cursor-not-allowed disabled:opacity-50 " +
        "data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-300",
      className
    )}
    {...props}
  >
    {/* Thumb (cục tròn) */}
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-white shadow " +
          "transition-transform " +
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        thumbClassName
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
