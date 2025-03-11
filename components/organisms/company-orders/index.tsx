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

import { MoreHorizontal, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useCarrierService } from "@/contexts/TrucksContext";
import { Order, OrderStatus } from "@/data/repositories/IRepository";
import { toast } from "react-toastify";

export function OrdersTable() {
  const companyID = "some-id-1";
  const service = useCarrierService();

  const [orders, setOrders] = useState<Order[]>([]);

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
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
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

  return (
    <>
      <div className="rounded-md border flex-1 p-4 md:p-6 ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Комментарий</TableHead>

              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
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
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{order?.comment}</TableCell>

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
                        <DropdownMenuItem>Редактировить</DropdownMenuItem>
                        <DropdownMenuItem>Перейти к карте</DropdownMenuItem>
                        <DropdownMenuItem  >Удалить</DropdownMenuItem>
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
    </>
  );
}
