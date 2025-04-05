import { useAuth } from "@/contexts/AuthContext";
import { Roles } from "@/data/repositories/IRepository";
import { Truck as TruckIcon, MapIcon, File as FileIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type SidebarLink = {
  href: string;
  label: string;
  hidden?: (...args: unknown[]) => boolean;
  icon: React.ElementType;
};

const sidebarLinks: SidebarLink[] = [
  { href: "/dashboard", icon: MapIcon, label: "Active Trucks" },
  {
    href: "/trucks",
    icon: TruckIcon,
    label: "Manage Trucks",
    hidden: (role) => role !== Roles.carrier,
  },
  {
    href: "/orders",
    icon: FileIcon,
    label: "Manage Orders",
    hidden: (role) => role !== Roles.carrier,
  },
  {
    href: "/company-orders",
    icon: FileIcon,
    label: "Company Orders",
    hidden: (role) => role !== Roles.expeditor,
  },
];

function SidebarItems() {
  const { role } = useAuth();

  return sidebarLinks.map((link) => {
    if (link.hidden && link.hidden(role)) {
      return null;
    }

    return (
      <>
        <Link
          key={link.href}
          className="flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
          href={link.href}
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      </>
    );
  });
}

export const SideBar = () => {
  return (
    <aside className="w-64 border-r bg-gray-100/40 hidden md:block">
      <nav className="flex flex-col gap-4 p-4">
        <SidebarItems />
      </nav>
    </aside>
  );
};
