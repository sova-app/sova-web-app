import { Loader } from "@/components/molecules/loader";
import type { Truck } from "@/data/repositories/IRepository";
import { useEffect, useState } from "react";
import { TruckLocationMap } from "../truck-location-map";
import { TrucksFloatingList } from "../trucks-table";
import classNames from "classnames";
import styles from "./index.module.scss";
import { useTruckLocationService } from "@/contexts/TruckLocationContext";
// import { Exception } from "sass";

export const TruckContent = () => {
  const [selectedTruck, setSelectedTruck] = useState<Truck>();
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [isLoading] = useState<boolean>(false);
  const service = useTruckLocationService();

  useEffect(() => {
    const fetchTrucks = async () => {
      const data = await service.getTrucks();
      setTrucks(data);
    };

    fetchTrucks();
  }, [service]);

  const onTruckSelect = (truck: Truck) => {
    setSelectedTruck(truck);
  };
  return (
    <main className="flex-1 p-4 md:p-6">
      <div
        className={classNames(
          "relative flex-1 items-center h-full",
          styles.locationMapContainer
        )}
      >
        {isLoading ? (
          <Loader size={64} />
        ) : (
          <TruckLocationMap
            truckIds={selectedTruck?.ID ? [selectedTruck.ID] : []}
          />
        )}

        <div
          className="absolute top-4 left-4 bg-white/90 rounded-lg shadow-lg max-h-[50vh] w-80 overflow-y-auto z-10 p-4"
          style={{ backdropFilter: "blur(5px)" }}
        >
          <TrucksFloatingList trucks={trucks} onTruckSelect={onTruckSelect} />
        </div>
      </div>
    </main>
  );
};
