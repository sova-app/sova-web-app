import { Loader } from "@/components/molecules/loader";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCarrierService } from "@/contexts/TrucksContext";
import { Company, Truck } from "@/data/repositories/IRepository";
import { CreateOrderDto } from "@/dto/createOrderDto";
import { Loader2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CompanyOrderFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CompanyOrderFormModal({
  open,
  onOpenChange,
  onSuccess,
}: CompanyOrderFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [carrierCompanies, setCarrierCompanies] = useState<Company[]>([]);
  const [selectedCompanyIDs, setSelectedCompanyIDs] = useState<string[]>([
    "new",
  ]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  const [companyTrucks, setCompanyTrucks] = useState<Record<string, Truck[]>>(
    {}
  );
  const [selectedTruckIDs, setSelectedTruckIDs] = useState<string[]>([]);
  const [, setLoadingTrucks] = useState(false);

  const [orderName, setOrderName] = useState("");
  const [comment, setComment] = useState("");

  const service = useCarrierService();

  useEffect(() => {
    const fetchCarrierCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const companies = await service.getCarrierCompanies();
        setCarrierCompanies(companies);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(
            err.message || `An error occurred while fetching carrier companies`
          );
        }
      } finally {
        setLoadingCompanies(false);
      }
    };
    fetchCarrierCompanies();
  }, [service]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData: CreateOrderDto = {
      name: orderName,
      truckIDs: selectedTruckIDs,
      comment: comment,
      companyIDs: selectedCompanyIDs.filter((companyID) => companyID !== "new"),
    };
    const addOrder = async () => {
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
    addOrder();
    console.log("Форма отправлена:", formData);
  };

  const handleAddEmptyCompany = () => {
    const updatedSelectedCompanies = [...selectedCompanyIDs, "new"];
    setSelectedCompanyIDs(updatedSelectedCompanies);
  };

  const handleRemoveCompany = (companyID: string) => {
    const updatedSelectedCompanies = [...selectedCompanyIDs].filter(
      (cID) => cID !== companyID
    );
    const forbiddenTruckIDs = companyTrucks[companyID].map((truck) => truck.ID);
    const updatedSelectedTrucks = [...selectedTruckIDs].filter(
      (tID) => !forbiddenTruckIDs.includes(tID)
    );
    setSelectedCompanyIDs(updatedSelectedCompanies);
    setSelectedTruckIDs(updatedSelectedTrucks);
  };

  const handleUpdateCompany = async (companyID: string, index: number) => {
    const fetchCompanyTrucks = async () => {
      try {
        setLoadingTrucks(true);
        const trks = await service.getTrucksByCompany(companyID);
        const updatedCompanyTrucks = { ...companyTrucks };
        updatedCompanyTrucks[companyID] = trks;
        setCompanyTrucks(updatedCompanyTrucks);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(
            err.message ||
              `An error occurred while fetching trucks for ${companyID}`
          );
        }
      } finally {
        setLoadingTrucks(false);
      }
    };
    const updatedSelectedCompanies = [...selectedCompanyIDs];
    updatedSelectedCompanies[index] = companyID;
    const updatedCompanyTrucks = { ...companyTrucks };
    updatedCompanyTrucks[companyID] = [];
    setCompanyTrucks(updatedCompanyTrucks);
    setSelectedCompanyIDs(updatedSelectedCompanies);
    fetchCompanyTrucks();
  };

  const toggleTruck = (id: string) => {
    setSelectedTruckIDs(
      selectedTruckIDs.includes(id)
        ? selectedTruckIDs.filter((t) => t !== id)
        : [...selectedTruckIDs, id]
    );
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
              {selectedCompanyIDs.map((companyID, index) => (
                <React.Fragment key={companyID}>
                  <Label htmlFor="company" className="text-right">
                    Компания
                  </Label>

                  <div className="col-span-2">
                    {loadingCompanies ? (
                      <Loader />
                    ) : (
                      <Select
                        value={companyID}
                        onValueChange={(value) =>
                          handleUpdateCompany(value, index)
                        }
                      >
                        <SelectTrigger className="w-full" id="company">
                          <SelectValue placeholder="Выберите компанию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {carrierCompanies.map((carrCompany) => (
                              <SelectItem
                                key={carrCompany.ID}
                                disabled={selectedCompanyIDs.includes(
                                  carrCompany.ID
                                )}
                                value={carrCompany.ID}
                              >
                                {carrCompany.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveCompany(companyID)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {companyID !== "new" && (
                    <div className="col-span-4 grid grid-cols-4 items-center gap-4 pl-8 border-l border-muted">
                      <Label
                        htmlFor="truck"
                        className="text-right text-muted-foreground"
                      >
                        Машины
                      </Label>
                      <Popover>
                        <PopoverTrigger className="col-span-3" asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            Выберите машины
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandGroup>
                              {companyTrucks[companyID].map((truck) => (
                                <CommandItem
                                  key={truck.ID}
                                  onSelect={() => toggleTruck(truck.ID)}
                                >
                                  <Checkbox
                                    checked={selectedTruckIDs.includes(
                                      truck.ID
                                    )}
                                    className="mr-2"
                                  />
                                  {truck.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={() => handleAddEmptyCompany()}
            // className="col-span-3"
            disabled={
              isSubmitting ||
              selectedCompanyIDs.length >= carrierCompanies.length
            }
          >
            Добавить компанию
          </Button>

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
