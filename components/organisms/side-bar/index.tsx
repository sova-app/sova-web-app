import { Ticket as TicketIcon, Truck as TruckIcon } from "lucide-react";
import Link from "next/link";

export const SideBar = () => {
  return (
    <aside className="w-64 border-r bg-gray-100/40 hidden md:block">
      <nav className="flex flex-col gap-4 p-4">
        <Link
          className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
          href="/dashboard"
        >
          <TruckIcon className="h-4 w-4" />
          Active Trucks
        </Link>
        <Link
          className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
          href="/trucks"
        >
          <TicketIcon className="h-4 w-4" />
          Manage Trucks
        </Link>
        <Link
          className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
          href="/orders"
        >
          <TicketIcon className="h-4 w-4" />
          Manage Orders
        </Link>
      </nav>
    </aside>
  );
};
