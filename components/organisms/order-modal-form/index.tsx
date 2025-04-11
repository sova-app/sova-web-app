import { Loader } from "@/components/molecules/loader";
import { TruckMultiSelect } from "@/components/molecules/truck-multi-select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCarrierService } from "@/contexts/TrucksContext";
import { Truck } from "@/data/repositories/IRepository";
import { CreateOrderDto } from "@/dto/createOrderDto";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface OrderFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function OrderFormModal({
  open,
  onOpenChange,
  onSuccess,
}: OrderFormModalProps) {
  // const { hasRole } = use()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTrucks, setLoadingTrucks] = useState(false);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [selectedTrucks, setSelectedTrucks] = useState<string[]>([]);

  const [orderName, setOrderName] = useState("");
  const [comment, setComment] = useState("");

  const service = useCarrierService();

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        setLoadingTrucks(true);
        // TODO SA-100, SA-101: Replace "some-id-1" with the actual company ID
        const data = await service.getTrucksByCompany("some-id-1");
        setTrucks(data);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(
            err.message || "An error occurred while fetching trucks."
          );
        }
      } finally {
        setLoadingTrucks(false);
      }
    };
    fetchTrucks();
  }, [service]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData: CreateOrderDto = {
      name: orderName,
      trucks: selectedTrucks,
      comment: comment,
    };
    const addTruck = async () => {
      setIsSubmitting(true);
      try {
        // TODO SA-100, SA-101: Replace "some-id-1" with the actual company ID
        await service.addOrderToCompany("some-id-1", formData);
        onSuccess();
      } catch (err) {
        if (err instanceof Error) {
          toast.error(
            err.message || "An error occurred while adding the truck."
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    };
    addTruck();
    console.log("Форма отправлена:", formData);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Создать заказ</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orderName" className="text-right">
                Название заказа
              </Label>
              <Input
                value={orderName}
                onChange={(e) => setOrderName(e.target.value)}
                id="orderName"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comment" className="text-right">
                Комментарий
              </Label>
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                id="comment"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orderName" className="text-right">
                Машины
              </Label>
              {loadingTrucks ? (
                <Loader />
              ) : (
                <TruckMultiSelect
                  trucks={trucks}
                  selectedTrucks={selectedTrucks}
                  onChange={setSelectedTrucks}
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              size="sm"
              type="submit"
              disabled={isSubmitting}
              onClick={(event) => handleSubmit(event)}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Загрузка...
                </>
              ) : (
                "Создать"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
