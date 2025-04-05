import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Truck } from "@/data/repositories/IRepository";

export function TruckMultiSelect({
  trucks,
  selectedTrucks,
  onChange,
}: {
  trucks: Truck[];
  selectedTrucks: string[];
  onChange: (ids: string[]) => void;
}) {
  const toggleTruck = (id: string) => {
    onChange(
      selectedTrucks.includes(id)
        ? selectedTrucks.filter((t) => t !== id)
        : [...selectedTrucks, id]
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {selectedTrucks.length > 0
            ? `${selectedTrucks.length} выбрано`
            : "Выберите машины"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandGroup>
            {trucks.map((truck) => (
              <CommandItem
                key={truck.ID}
                onSelect={() => toggleTruck(truck.ID)}
              >
                <Checkbox
                  checked={selectedTrucks.includes(truck.ID)}
                  onCheckedChange={() => toggleTruck(truck.ID)}
                  className="mr-2"
                />
                {truck.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
