"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { PlusIcon, Loader2, MoreHorizontal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useCarrierService } from "@/contexts/TrucksContext";
import { Order, OrderStatus, Roles } from "@/data/repositories/IRepository";
import { toast } from "react-toastify";
import { OrderFormModal } from "@/components/organisms/order-modal-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { CompanyOrderFormModal } from "../company-order-modal-form";

export function OrdersTable() {
  const { role } = useAuth();
  const router = useRouter();
  // TODO SA-100, SA-101: Replace "some-id-1" with the actual company ID
  const companyID = "some-id-1";
  const service = useCarrierService();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadCompanyOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await service.getOrdersByCompany(companyID);
      setOrders(res);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(
          error.message || "An error occurred while fetching orders."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [companyID, service]);

  useEffect(() => {
    loadCompanyOrders();
  }, [loadCompanyOrders]);

  const [loading, setLoading] = useState(false);
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case "DONE":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      case "INITIATED":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  const goToOrderTruckLocations = (orderID: string) => {
    router.push(`/orders/${orderID}/location`);
  };

  const updateOrderStatus = useCallback(
    async (orderID: string, status: OrderStatus) => {
      try {
        setLoading(true);
        await service.updateOrderStatus(orderID, status);
        loadCompanyOrders();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(
            error.message || "An error occurred while fetching orders."
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [service, loadCompanyOrders]
  );

  return (
    <div className="rounded-md border flex-1 p-4 md:p-6 ">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        Список заказов
      </h2>
      {role === Roles.carrier ? (
        <OrderFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSuccess={() => {
            loadCompanyOrders();
            setIsModalOpen(false);
          }}
        />
      ) : (
        <CompanyOrderFormModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSuccess={() => {
            loadCompanyOrders();
            setIsModalOpen(false);
          }}
        />
      )}
      <Table>
        <TableHeader>
          <div className="my-2">
            <Button onClick={() => setIsModalOpen(true)} size="sm">
              <PlusIcon className="h-4 w-4" />
              <span>Создать заказ</span>
            </Button>
          </div>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Комментарий</TableHead>
            <TableHead>Дата начала</TableHead>
            <TableHead>Дата конца</TableHead>

            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              </TableCell>
            </TableRow>
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.ID}>
                <TableCell className="font-medium">{order.name}</TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusColor(order.status)}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order?.comment}</TableCell>
                <TableCell>
                  {order.start_date
                    ? order.start_date.toDateString()
                    : "Не начато"}
                </TableCell>
                <TableCell>
                  {order.end_date
                    ? order.end_date?.toDateString()
                    : "Не закончено"}
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Действия</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => updateOrderStatus(order.ID, "CANCELLED")}
                      >
                        Отменить заказ
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateOrderStatus(order.ID, "ACTIVE")}
                      >
                        Возобновить заказ
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateOrderStatus(order.ID, "DONE")}
                      >
                        Завершить заказ
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => goToOrderTruckLocations(order.ID)}
                      >
                        К списку машин
                      </DropdownMenuItem>
                      <DropdownMenuItem>Удалить</DropdownMenuItem>
                      {/* {hasRole("admin") && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit order</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Cancel order
                            </DropdownMenuItem>
                          </>
                        )} */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
