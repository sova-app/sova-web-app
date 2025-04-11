import { Truck } from "@/data/repositories/IRepository";

export interface TrucksFloatingListProps {
  onTruckSelect: (truck: Truck) => void;
  trucks: Truck[];
}
