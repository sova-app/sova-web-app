import React, { useEffect, useState } from "react";
import { MoreVertical, Plus, TruckIcon } from "lucide-react";
import { useCarrierService } from "@/contexts/TrucksContext";
import { toast } from "react-toastify";
import { TruckFull } from "@/data/repositories/IRepository";

export const TrucksDashboard = () => {
  //   const [trucks, ] = useState([
  //     { id: 1, name: "Volvo FH16", driver: "Иван Петров", status: "Свободный" },
  //     {
  //       id: 2,
  //       name: "Scania R500",
  //       driver: "Андрей Смирнов",
  //       status: "На заявке",
  //     },
  //   ]);
  const [trucks, setTrucks] = useState<TruckFull[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const companyID = "some-id-1";
  const service = useCarrierService();

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const data = await service.getTrucks(companyID);
        console.log("Data", data);
        setTrucks(data);
      } catch (err) {
        // TODO: Make global error handling
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
                  <button className="p-1">
                    <MoreVertical size={20} />
                  </button>
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
