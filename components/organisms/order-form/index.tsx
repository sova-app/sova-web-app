import * as React from "react";
import { useState } from "react";
import * as Form from "@radix-ui/react-form";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import "./index.css";
import { CheckIcon } from "lucide-react";
import { toast } from "react-toastify";
import { Truck } from "@/data/repositories/IRepository";
import { useCarrierService } from "@/contexts/TrucksContext";
import { OrderFormProps } from "./types";
import { CreateOrderDto } from "@/dto/createOrderDto";

const OrderForm = (props: OrderFormProps) => {
  const [name, setOrderName] = useState("");
  const [comment, setComment] = useState("");
  const [selectedTrucks, setSelectedTrucks] = useState<string[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const service = useCarrierService();
  const { onClose, onOrderAdded: onTruckAdded } = props;

  React.useEffect(() => {
    const fetchTrucks = async () => {
      try {
        // TODO SA-100, SA-101: Replace "some-id-1" with the actual company ID
        const data = await service.getTrucksByCompany("some-id-1");
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

  const handleAddTruck = () => {
    setSelectedTrucks([...selectedTrucks, ""]);
  };

  const handleTruckChange = (index: number, value: string) => {
    const newSelectedTrucks = [...selectedTrucks];
    newSelectedTrucks[index] = value;
    setSelectedTrucks(newSelectedTrucks);
  };

  const handleRemoveTruck = (index: number) => {
    const newSelectedTrucks = [...selectedTrucks];
    newSelectedTrucks.splice(index, 1);
    setSelectedTrucks(newSelectedTrucks);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData: CreateOrderDto = {
      name,
      trucks: selectedTrucks,
      comment: comment,
    };
    const addTruck = async () => {
      setIsLoading(true);
      try {
        // TODO SA-100, SA-101: Replace "some-id-1" with the actual company ID
        await service.addOrderToCompany("some-id-1", formData);
        onTruckAdded();
        onClose();
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
      <Form.Field name="orderName" className="mb-4">
        <Form.Label className="block text-sm font-medium">
          Название заказа
        </Form.Label>
        <Form.Control asChild>
          <input
            type="text"
            value={name}
            onChange={(e) => setOrderName(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </Form.Control>
      </Form.Field>

      {selectedTrucks.map((truckID, index) => (
        <Form.Field key={index} name={`truck-${index}`} className="mb-4">
          <Form.Label className="block text-sm font-medium">
            Выберите машину
          </Form.Label>
          <div className="flex items-center">
            <Select.Root
              value={truckID}
              onValueChange={(value) => handleTruckChange(index, value)}
              disabled={isLoading}
            >
              <Select.Trigger className="SelectTrigger" aria-label="Truck">
                <Select.Value placeholder="Выберите машину…" />
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
                    {trucks
                      .filter(
                        (truck) =>
                          !selectedTrucks.includes(truck.ID) ||
                          truck.ID === truckID
                      )
                      .map((truck) => (
                        <Select.Item
                          key={truck.ID}
                          value={truck.ID}
                          className={"SelectItem"}
                        >
                          <Select.ItemText>{truck.name}</Select.ItemText>
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
            <button
              type="button"
              onClick={() => handleRemoveTruck(index)}
              className="ml-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              disabled={isLoading}
            >
              Удалить
            </button>
          </div>
        </Form.Field>
      ))}

      <button
        type="button"
        onClick={handleAddTruck}
        className="mb-4 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        disabled={isLoading}
      >
        Добавить машину
      </button>
      <Form.Field name="orderName" className="mb-4">
        <Form.Label className="block text-sm font-medium">
          Комментарий
        </Form.Label>
        <Form.Control asChild>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </Form.Control>
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

export default OrderForm;
