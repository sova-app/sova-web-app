import { OrderLocationPageProps } from "./types";
import classNames from "classnames";
import styles from "./index.module.scss";
import { OrderTruck } from "@/data/repositories/IRepository";
import { useCallback, useEffect, useState } from "react";
import { useCarrierService } from "@/contexts/TrucksContext";
import { TruckLocationMap } from "@/components/organisms/truck-location-map";

export const OrderLocationPage = (props: OrderLocationPageProps) => {
  const { orderID } = props;
  const [orderTrucks, setTrucks] = useState<OrderTruck[]>([]);
  const service = useCarrierService();

  const fetchOrderTrucks = useCallback(async () => {
    const t = await service.getOrderTrucks(orderID);
    setTrucks(t);
  }, [orderID, service]);

  useEffect(() => {
    fetchOrderTrucks();
  }, [orderID, fetchOrderTrucks]);

  return (
    <div
      className={classNames(
        "relative flex-1 items-center h-full",
        styles.locationMapContainer
      )}
    >
      <h1 className="text-2xl font-bold mb-4">Order: {orderID}</h1>
      <TruckLocationMap truckIds={orderTrucks.map((truck) => truck.truckID)} />
    </div>
  );
};
