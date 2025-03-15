import React, { useCallback, useEffect, useState } from "react";
import { useCarrierService } from "@/contexts/TrucksContext";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Order } from "@/data/repositories/IRepository";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { File, Plus } from "lucide-react";
import "./index.css";
import { Loader } from "@/components/molecules/loader";
import OrderForm from "../order-form";
import { useRouter } from "next/navigation";

export const OrdersDashboard = () => {
  const router = useRouter();
  const [carrierOrders, setCarrierOrders] = useState<Order[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // TODO SA-100, SA-101: Replace "some-id-1" with the actual company ID
  const companyID = "some-id-1";
  const service = useCarrierService();

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await service.getOrdersByCompany(companyID);
      setOrders(data);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || "An error occurred while fetching orders.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [service, companyID]);

  const fetchCarrierOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await service.getCarrierOrdersByCompany(companyID);
      setCarrierOrders(data);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || "An error occurred while fetching orders.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [service, companyID]);

  useEffect(() => {
    toast.error(`No locations available for.`);
    fetchOrders();
    fetchCarrierOrders();
  }, [service, fetchOrders, fetchCarrierOrders]);

  const goToOrderTruckLocations = (orderID: string) => {
    console.log(orderID);
    router.push(`/orders/${orderID}/location`);
  };

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <File className="mr-2" /> Список заказов
        </h2>
        {isLoading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500">No records</div>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Название</th>
                <th className="border p-2">Статус</th>
                <th className="border p-2">Комментарий</th>
                <th className="border p-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.ID} className="border">
                  <td className="border p-2">{order.name}</td>
                  <td className="border p-2">
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="border p-2">{order.comment}</td>
                  <td className="border p-2 relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="IconButton"
                          aria-label="Customise options"
                        >
                          <HamburgerMenuIcon />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuPortal>
                        <DropdownMenuContent
                          className="DropdownMenuContent"
                          sideOffset={5}
                        >
                          <DropdownMenuItem
                            onClick={() => goToOrderTruckLocations(order.ID)}
                            className="DropdownMenuItem"
                          >
                            Перейти к карте
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button
          onClick={openModal}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="mr-2" /> Создать заказ
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <File className="mr-2" /> Список экспедиторских заказов
        </h2>
        {isLoading ? (
          <Loader />
        ) : carrierOrders.length === 0 ? (
          <div className="text-center text-gray-500">No records</div>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Название</th>
                <th className="border p-2">Статус</th>
                <th className="border p-2">Комментарий</th>
                <th className="border p-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {carrierOrders.map((order) => (
                <tr key={order.ID} className="border">
                  <td className="border p-2">{order.name}</td>
                  <td className="border p-2">
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="border p-2">{order.comment}</td>
                  <td className="border p-2 relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="IconButton"
                          aria-label="Customise options"
                        >
                          <HamburgerMenuIcon />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuPortal>
                        <DropdownMenuContent
                          className="DropdownMenuContent"
                          sideOffset={5}
                        >
                          <DropdownMenuItem
                            // onClick={() => goToTruckLocation(truck.name)}
                            className="DropdownMenuItem"
                          >
                            Перейти к карте
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Создать заказ</h3>
            <OrderForm onClose={closeModal} onOrderAdded={fetchOrders} />
          </div>
        </div>
      )}
    </main>
  );
};
