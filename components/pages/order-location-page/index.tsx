import { OrderLocationPageProps } from "./types";
import classNames from "classnames";
import styles from "./index.module.scss";
import { Order, OrderTruckExtended } from "@/data/repositories/IRepository";
import { useCallback, useEffect, useState } from "react";
import { useCarrierService } from "@/contexts/TrucksContext";
import { TruckLocationMap } from "@/components/organisms/truck-location-map";
import { OrderTrucksFloatingList } from "@/components/organisms/order-truck-floating-list";

export const OrderLocationPage = (props: OrderLocationPageProps) => {
  const { orderID } = props;
  const [orderTrucks, setTrucks] = useState<OrderTruckExtended[]>([]);
  const [order, setOrder] = useState<Order>();
  const service = useCarrierService();
  const [selectedTruck, setSelectedTruck] = useState<OrderTruckExtended>();

  const fetchOrderTrucks = useCallback(async () => {
    const t = await service.getOrderTrucks(orderID);
    setTrucks(t);
  }, [orderID, service]);

  const fetchOrder = useCallback(async () => {
    const ord = await service.getOrderById(orderID);
    console.log(ord);
    setOrder(ord);
  }, [setOrder, service, orderID]);

  useEffect(() => {
    fetchOrderTrucks();
    fetchOrder();
  }, [orderID, fetchOrderTrucks, fetchOrder]);

  const onTruckSelect = (truck: OrderTruckExtended) => {
    setSelectedTruck(truck);
  };

  return (
    <div
      className={classNames(
        "relative flex-1 items-center h-full",
        styles.locationMapContainer
      )}
    >
      <h1 className="text-2xl font-bold mb-4">Order: {order?.name}</h1>
      <TruckLocationMap
        truckIds={selectedTruck?.truckID ? [selectedTruck.truckID] : []}
      />
      <div
        className="absolute top-4 right-4 bg-white/90 rounded-lg shadow-lg max-h-[50vh] w-80 overflow-y-auto z-10 p-4"
        style={{ backdropFilter: "blur(5px)" }}
      >
        <OrderTrucksFloatingList
          trucks={orderTrucks}
          onTruckSelect={onTruckSelect}
        />
      </div>
    </div>
  );
};
