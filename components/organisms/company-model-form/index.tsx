import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompanyService } from "@/contexts/CompanyContext";
import { Company } from "@/data/repositories/IRepository";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface OrderFormModalProps {
  companyToEdit?: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CompanyModalForm({
  open,
  onOpenChange,
  onSuccess,
  companyToEdit,
}: OrderFormModalProps) {
  // const { hasRole } = use()
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [bin, setBin] = useState("");

  const service = useCompanyService();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = {
      name: name,
      companyType: companyType,
      bin: bin,
    };
    const createCompany = async () => {
      setIsSubmitting(true);
      try {
        await service.createCompany(formData);
        onSuccess();
      } catch (err) {
        if (err instanceof Error) {
          toast.error(
            err.message || "An error occurred while creating a company."
          );
        }
      } finally {
        setIsSubmitting(false);
        setName("");
        setCompanyType("");
        setBin("");
        console.log("Форма отправлена:", formData);
      }
    };
    const updateCompany = async () => {
      setIsSubmitting(true);
      const formDataToUpdate = { ...formData, ID: companyToEdit!.ID };
      try {
        await service.updateCompany(formDataToUpdate);
        onSuccess();
      } catch (err) {
        if (err instanceof Error) {
          toast.error(
            err.message || "An error occurred while updating a company."
          );
        }
      } finally {
        setIsSubmitting(false);
        setName("");
        setCompanyType("");
        setBin("");
        console.log("Форма отправлена:", formDataToUpdate);
      }
    };
    if (companyToEdit) {
      updateCompany();
    } else {
      createCompany();
    }
  };

  useEffect(() => {
    if (companyToEdit) {
      setName(companyToEdit.name);
      setCompanyType(companyToEdit.companyType);
      setBin(companyToEdit.bin);
    }
  }, [companyToEdit]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {companyToEdit ? "Изменить данные компании" : "Создать компанию"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Название компании
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bin" className="text-right">
                Введите БИН компании
              </Label>
              <Input
                value={bin}
                onChange={(e) => setBin(e.target.value)}
                id="bin"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company_type" className="text-right">
                Тип компании
              </Label>
              <Select
                value={companyType}
                onValueChange={(value) => setCompanyType(value)}
              >
                <SelectTrigger className="w-full" id="company_type">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="expeditor">Expeditor</SelectItem>
                    <SelectItem value="carrier">Carrier</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
              ) : companyToEdit ? (
                "Обновить"
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
