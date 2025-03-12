import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCarrierService } from "@/contexts/TrucksContext";
import { Truck } from "@/data/repositories/IRepository";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface OrderFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function OrderFormModal({
  open,
  onOpenChange,
  onSuccess,
}: OrderFormModalProps) {
  // const { hasRole } = use()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [trucks, setTrucks] = useState<Truck[]>([]);

  // const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [orderName, setOrderName] = useState("");
  const [comment, setComment] = useState("");

  const service = useCarrierService();

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ e });
    setIsSubmitting(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Создать заказ</DialogTitle>
            {/* <DialogDescription>
              Fill in the details to create a new delivery order.
            </DialogDescription> */}
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
            <Button size="sm" type="submit" disabled={isSubmitting}>
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
