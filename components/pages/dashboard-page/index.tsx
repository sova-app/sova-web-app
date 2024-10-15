"use client";

import { TrucksTable } from "@/components/organisms/trucks-table";
import { TruckLocationProvider } from "@/contexts/TruckLocationContext";
import { Truck, Ticket, Bell, Search, User } from "lucide-react";
import Link from "next/link";

interface TicketProps {
  id: string;
  title: string;
  status: "Open" | "In Progress" | "Closed";
  assignedTruck: string;
}

const tickets: TicketProps[] = [
  {
    id: "T001",
    title: "Delivery to New York",
    status: "Open",
    assignedTruck: "TR-101",
  },
  {
    id: "T002",
    title: "Pickup from Chicago",
    status: "In Progress",
    assignedTruck: "TR-102",
  },
  {
    id: "T003",
    title: "Return to Depot",
    status: "Closed",
    assignedTruck: "TR-103",
  },
  {
    id: "T004",
    title: "Emergency Delivery",
    status: "Open",
    assignedTruck: "TR-104",
  },
  {
    id: "T005",
    title: "Maintenance Required",
    status: "In Progress",
    assignedTruck: "TR-105",
  },
];

export function Dashboard() {
  return (
    <TruckLocationProvider>
      <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-14 flex items-center border-b">
          <Link className="flex items-center justify-center" href="/">
            <Truck className="h-6 w-6" />
            <span className="ml-2 text-2xl font-bold">Sova</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4 sm:gap-6">
            <Search className="h-5 w-5" />
            <Bell className="h-5 w-5" />
            <User className="h-5 w-5" />
          </nav>
        </header>
        <div className="flex flex-1">
          <aside className="w-64 border-r bg-gray-100/40 hidden md:block">
            <nav className="flex flex-col gap-4 p-4">
              <Link
                className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
                href="#"
              >
                <Truck className="h-4 w-4" />
                Fleet Overview
              </Link>
              <Link
                className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
                href="#"
              >
                <Ticket className="h-4 w-4" />
                Tickets
              </Link>
            </nav>
          </aside>
          <main className="flex-1 p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Recent Tickets</h2>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left font-medium">ID</th>
                        <th className="p-2 text-left font-medium">Title</th>
                        <th className="p-2 text-left font-medium">Status</th>
                        <th className="p-2 text-left font-medium">
                          Assigned Truck
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => (
                        <tr key={ticket.id} className="border-t">
                          <td className="p-2">{ticket.id}</td>
                          <td className="p-2">{ticket.title}</td>
                          <td className="p-2">
                            <span
                              className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                ticket.status === "Open"
                                  ? "bg-green-100 text-green-800"
                                  : ticket.status === "In Progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {ticket.status}
                            </span>
                          </td>
                          <td className="p-2">{ticket.assignedTruck}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <TrucksTable />
            </div>
          </main>
        </div>
      </div>
    </TruckLocationProvider>
  );
}
