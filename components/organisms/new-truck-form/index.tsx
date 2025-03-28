import * as React from "react";
import { useState } from "react";
import * as Form from "@radix-ui/react-form";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import "./index.css";
import { CheckIcon } from "lucide-react";
import { toast } from "react-toastify";
import { Driver } from "@/data/repositories/IRepository";
import { useCarrierService } from "@/contexts/TrucksContext";
import { TruckFormProps } from "./types";

type TruckFormData = {
  name: string;
  driverID: string | null;
};

const TruckForm = (props: TruckFormProps) => {
  const [name, setTruckName] = useState("");
  const [driverID, setDriver] = useState<string | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const service = useCarrierService();
  const { onClose, onTruckAdded } = props;

  React.useEffect(() => {
    const fetchDrivers = async () => {
      try {
        // TODO SA-100, SA-101: Replace "some-id-1" with the actual company ID
        const data = await service.getDriversByCompany("some-id-1");
        setDrivers(data);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(
            err.message || "An error occurred while fetching truck locations."
          );
        }
      }
    };
    fetchDrivers();
  }, [service]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData: TruckFormData = { name, driverID };
    const addTruck = async () => {
      setIsLoading(true);
      try {
        // TODO SA-100, SA-101: Replace "some-id-1" with the actual company ID
        await service.addTruckToCompany("some-id-1", formData);
        onTruckAdded(); // Обновляем список грузовиков после успешного добавления
        onClose(); // Закрываем модалку после успешного добавления грузовика
      } catch (err) {
        if (err instanceof Error) {
          toast.error(
            err.message || "An error occurred while adding the truck."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };
    addTruck();
    console.log("Форма отправлена:", formData);
  };

  return (
    <Form.Root onSubmit={handleSubmit} className="p-4 rounded-lg w-80">
      <Form.Field name="truckName" className="mb-4">
        <Form.Label className="block text-sm font-medium">
          Название машины
        </Form.Label>
        <Form.Control asChild>
          <input
            type="text"
            value={name}
            onChange={(e) => setTruckName(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </Form.Control>
      </Form.Field>

      <Form.Field name="driver" className="mb-4">
        <Form.Label className="block text-sm font-medium">
          Выберите водителя
        </Form.Label>
        <Select.Root
          value={driverID || ""}
          onValueChange={setDriver}
          disabled={isLoading}
        >
          <Select.Trigger className="SelectTrigger" aria-label="Food">
            <Select.Value placeholder="Выберите водителя…" />
            <Select.Icon className="SelectIcon">
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="SelectContent">
              <Select.ScrollUpButton className="SelectScrollButton">
                <ChevronUpIcon />
              </Select.ScrollUpButton>
              <Select.Viewport className="SelectViewport">
                {drivers.map((driver) => (
                  <Select.Item
                    key={driver.ID}
                    value={driver.ID!}
                    className={"SelectItem"}
                  >
                    <Select.ItemText>{driver.name}</Select.ItemText>
                    <Select.ItemIndicator className="SelectItemIndicator">
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
              <Select.ScrollDownButton className="SelectScrollButton">
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </Form.Field>
      <div className="flex justify-between">
        <Form.Submit asChild>
          <button
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : "Отправить"}
          </button>
        </Form.Submit>
        <button
          onClick={onClose}
          className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          disabled={isLoading}
        >
          Закрыть
        </button>
      </div>
    </Form.Root>
  );
};

export default TruckForm;
