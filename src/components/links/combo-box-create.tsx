import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type ComboboxOptions = {
  id: string;
  title: string;
};

interface ComboboxProps {
  options: ComboboxOptions[];
  selected: ComboboxOptions["id"];
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (option: ComboboxOptions) => void;
  onCreate?: (label: ComboboxOptions["title"]) => void;
}

function CommandAddItem({
  query,
  onCreate,
}: {
  query: string;
  onCreate: () => void;
}) {
  return (
    <div
      tabIndex={0}
      onClick={onCreate}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
          onCreate();
        }
      }}
      className={cn(
        "flex w-full text-blue-500 cursor-pointer text-sm px-2 py-1.5 rounded-sm items-center focus:outline-none",
        "hover:bg-blue-200 focus:!bg-blue-200"
      )}
    >
      <CirclePlus className="mr-2 h-4 w-4" />
      Create &quot;{query}&quot;
    </div>
  );
}

export default function Combobox({
  options,
  selected,
  className,
  placeholder,
  disabled,
  onChange,
  onCreate,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [canCreate, setCanCreate] = useState(true);
  useEffect(() => {
    const isAlreadyCreated = options.some(
      (option) => option.title.toLowerCase() === query.toLowerCase()
    );
    setCanCreate(!!(query && !isAlreadyCreated && onCreate));
  }, [query, options, onCreate]);

  function handleSelect(option: ComboboxOptions) {
    if (onChange) {
      onChange(option);
      setOpen(false);
      setQuery("");
    }
  }

  function handleCreate() {
    if (onCreate && query) {
      onCreate(query);
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          disabled={disabled ?? false}
          aria-expanded={open}
          className={cn("w-full font-normal", className)}
        >
          {selected && selected.length > 0 ? (
            <div className="truncate mr-auto">
              {options.find((item) => item.id === selected)?.title}
            </div>
          ) : (
            <div className="text-slate-600 mr-auto">
              {placeholder ?? "Select"}
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Search or create new"
            value={query}
            onValueChange={(value: string) => setQuery(value)}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "Enter") {
                event.preventDefault();
              }
            }}
          />
          <CommandEmpty className="flex pl-1 py-1 w-full">
            {query && (
              <CommandAddItem query={query} onCreate={() => handleCreate()} />
            )}
          </CommandEmpty>

          <CommandList>
            <CommandGroup className="overflow-y-auto">
              {options.length === 0 && !query && (
                <div className="py-1.5 pl-8 space-y-1 text-sm">
                  <p>Enter a value to create a new one</p>
                </div>
              )}

              {/* Create */}
              {canCreate && options.length > 0 && (
                <CommandAddItem query={query} onCreate={() => handleCreate()} />
              )}

              {/* Select */}
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  tabIndex={0}
                  value={option.title}
                  onSelect={() => {
                    console.log("onSelect");
                    handleSelect(option);
                  }}
                  onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
                    if (event.key === "Enter") {
                      event.stopPropagation();

                      handleSelect(option);
                    }
                  }}
                  className={cn(
                    "cursor-pointer",
                    "focus:!bg-blue-200 hover:!bg-blue-200 aria-selected:bg-transparent"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 min-h-4 min-w-4",
                      selected === option.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
