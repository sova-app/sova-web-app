import { Badge } from "@/components/ui/badge";
import { OrderTrucksFloatingListProps } from "./types";
import { OrderTruckStatus } from "@/data/repositories/IRepository";

export function OrderTrucksFloatingList(props: OrderTrucksFloatingListProps) {
  const { onTruckSelect, trucks: orderTrucks } = props;
  const getStatusColor = (status: OrderTruckStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "DONE":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      case "IDLE":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Trucks</h2>
      <div className="grid gap-4">
        {orderTrucks.map((orderTruck) => (
          <div
            key={orderTruck.truckID}
            className="border rounded-lg p-4 bg-white"
          >
            <div
              key={orderTruck.truckID}
              className="flex items-center justify-between mb-2"
            >
              <span className="font-semibold">{orderTruck.truckName}</span>
              <button
                className={`inline-flex items-center justify-center rounded-md bg-gray-900 px-2 py-1 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950`}
                onClick={() => onTruckSelect(orderTruck)}
              >
                Select
              </button>
            </div>
            <Badge
              variant="outline"
              className={getStatusColor(orderTruck.status)}
            >
              {orderTruck.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
