import * as React from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import {
  Command,
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "../components/ui/command"; 
import { cn } from "../lib/utils"; 

export type Option = { id: string; label: string; meta?: string };

export type CreatableValue =
  | { id: string; label: string; isCustom: false }
  | { id: null; label: string; isCustom: true }; // text mới

type Props = {
  value?: CreatableValue | null;
  onChange: (v: CreatableValue | null) => void;
  options: Option[];
  placeholder?: string;
  emptyHint?: string;
};

export type FamilyPick = { id: string | null; label: string };

export function FamilyUserCombobox({
  value,
  onChange,
  options,
  placeholder = "Search or type…",
  emptyHint = "No results.",
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.meta?.toLowerCase().includes(q)
    );
  }, [options, query]);

  const currentLabel = value?.label ?? "";

  const pick = (opt: Option) => {
    onChange({ id: opt.id, label: opt.label, isCustom: false });
    setOpen(false);
    setQuery("");
  };

  const createFromQuery = () => {
    const label = query.trim();
    if (!label) return;
    onChange({ id: null, label, isCustom: true });
    setOpen(false);
    setQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {currentLabel || "Select or type family user"}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={query}
            onValueChange={setQuery}
          />
          <CommandEmpty>
            {emptyHint}
            {query.trim() ? (
              <Button
                className="mt-2 w-full"
                size="sm"
                onClick={createFromQuery}
              >
                Create “{query.trim()}”
              </Button>
            ) : null}
          </CommandEmpty>

          <CommandGroup>
            {filtered.map((opt) => (
              <CommandItem
                key={opt.id}
                value={opt.label}
                onSelect={() => pick(opt)}
                className="flex items-center justify-between"
              >
                <span className="truncate">
                  {opt.label}
                  {opt.meta ? <span className="ml-2 text-xs text-slate-500">• {opt.meta}</span> : null}
                </span>
                <Check
                  className={cn(
                    "h-4 w-4",
                    value?.id === opt.id && !value?.isCustom ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
            {/* nút tạo nhanh nếu đang có query & vẫn có kết quả (cho user thấy rõ) */}
            {query.trim() && (
              <CommandItem onSelect={createFromQuery}>
                + Create “{query.trim()}”
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}