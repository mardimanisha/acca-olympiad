"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

function Select(props: SelectPrimitive.Root.Props<string>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectTrigger({ className, placeholder, ...props }: SelectPrimitive.Trigger.Props & { placeholder?: string }) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "group/select flex h-[50px] w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-field border border-line bg-canvas px-3.5 text-left text-[0.93rem] text-navy outline-none transition-[box-shadow,border-color,background-color] lg:h-11",
        "hover:border-teal/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "data-popup-open:border-teal data-popup-open:bg-white data-popup-open:ring-3 data-popup-open:ring-teal/15",
        "data-disabled:cursor-not-allowed data-disabled:opacity-60 data-disabled:hover:border-line",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Value
        placeholder={<span className="text-[#8F9BAE]">{placeholder}</span>}
        className="truncate data-placeholder:text-[#8F9BAE]"
      />
      <SelectPrimitive.Icon className="shrink-0 text-[#8F9BAE] transition-transform duration-200 group-data-popup-open/select:rotate-180 group-data-popup-open/select:text-teal">
        <ChevronDown className="size-4" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({ className, children, ...props }: SelectPrimitive.Popup.Props) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side="bottom"
        align="start"
        sideOffset={6}
        alignItemWithTrigger={false}
        className="z-50 outline-none"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "w-(--anchor-width) origin-(--transform-origin) overflow-hidden rounded-field border border-line bg-white p-1.5 text-navy shadow-[0_16px_40px_-12px_rgba(11,26,61,0.28)] outline-none",
            "transition-[opacity,transform] duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
            className,
          )}
          {...props}
        >
          <SelectPrimitive.List className="max-h-[min(15rem,var(--available-height))] overflow-y-auto overscroll-contain pr-0.5 [scrollbar-color:#cfe9e3_transparent] [scrollbar-width:thin]">
            {children}
          </SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex cursor-pointer select-none items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 text-[0.92rem] font-medium outline-none",
        "data-highlighted:bg-mint data-highlighted:text-teal-deep data-selected:font-bold data-selected:text-teal",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="truncate">{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="shrink-0 text-teal">
        <Check className="size-4" strokeWidth={2.5} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectTrigger, SelectContent, SelectItem };
