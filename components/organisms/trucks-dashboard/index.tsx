import React, { useEffect, useState } from "react";
import { useCarrierService } from "@/contexts/TrucksContext";
import { toast } from "react-toastify";
import { TruckFull } from "@/data/repositories/IRepository";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Plus, TruckIcon } from "lucide-react";
import "./index.css";

export const TrucksDashboard = () => {
  const [trucks, setTrucks] = useState<TruckFull[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const companyID = "some-id-1";
  const service = useCarrierService();

  const goToTruckLocation = (truckName: string) => {
    // i want to open new page
    // window.location.href = `/truck-location/${truckID}`;
    window.open(`/truck-location/${truckName}`, "_blank");
  };

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const data = await service.getTrucks(companyID);
        setTrucks(data);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(
            err.message || "An error occurred while fetching trucks."
          );
        }
      }
    };

    fetchTrucks();
  }, [service]);

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <TruckIcon className="mr-2" /> Список машин
        </h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Название</th>
              <th className="border p-2">Текущий водитель</th>
              <th className="border p-2">Статус</th>
              <th className="border p-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((truck) => (
              <tr key={truck.ID} className="border">
                <td className="border p-2">{truck.name}</td>
                <td className="border p-2">{truck.driver?.name}</td>
                <td className="border p-2">{truck.status}</td>
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
                          onClick={() => goToTruckLocation(truck.name)}
                          className="DropdownMenuItem"
                        >
                          Перейти к машине
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenuPortal>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={openModal}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="mr-2" /> Добавить машину
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Добавить машину</h3>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✖
            </button>
            <p>Форма добавления машины</p>
          </div>
        </div>
      )}
    </main>
  );
};
