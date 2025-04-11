import { OrderTruckExtended } from "@/data/repositories/IRepository";

export interface OrderTrucksFloatingListProps {
  onTruckSelect: (truck: OrderTruckExtended) => void;
  trucks: OrderTruckExtended[];
}
