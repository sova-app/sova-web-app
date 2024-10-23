import { Truck } from "@/data/repositories/IRepository";

export interface TrucksTableProps {
  onTruckSelect: (truck: Truck) => void;
}
