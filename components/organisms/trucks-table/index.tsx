import { useTruckLocationService } from "@/contexts/TruckLocationContext";
import { Truck } from "@/data/repositories/IRepository";
import Link from "next/link";
import { useEffect, useState } from "react";

export function TrucksTable() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const service = useTruckLocationService();

  useEffect(() => {
    const fetchLocations = async () => {
      const data = await service.getTrucks();
      setTrucks(data);
    };

    fetchLocations();
  }, [service]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Truck Assignments</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trucks.map((truck) => (
          <div key={truck.ID} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{truck.name}</span>
              <Link
                className={`inline-flex items-center justify-center rounded-md bg-gray-900 px-2 py-1 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300`}
                href={`/dashboard/trucks/${truck.name}`}
              >
                Open Location
              </Link>
            </div>
            <p className="text-sm text-gray-600">{truck.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
