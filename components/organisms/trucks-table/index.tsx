import { useTruckLocationService } from "@/contexts/TruckLocationContext";
import { Truck } from "@/data/repositories/IRepository";
import { useEffect, useState } from "react";
import { TrucksTableProps } from "./types";

export function TrucksTable(props: TrucksTableProps) {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const service = useTruckLocationService();
  const { onTruckSelect } = props;

  useEffect(() => {
    const fetchLocations = async () => {
      const data = await service.getTrucks();
      setTrucks(data);
    };

    fetchLocations();
  }, [service]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Trucks</h2>
      <div className="grid gap-4">
        {trucks.map((truck) => (
          <div key={truck.ID} className="border rounded-lg p-4 bg-white">
            <div
              key={truck.ID}
              className="flex items-center justify-between mb-2"
            >
              <span className="font-semibold">{truck.name}</span>
              <button
                className={`inline-flex items-center justify-center rounded-md bg-gray-900 px-2 py-1 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950`}
                onClick={() => onTruckSelect(truck)}
              >
                Select
              </button>
            </div>
            <p className="text-sm text-gray-600">{truck.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
