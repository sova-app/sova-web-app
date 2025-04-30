"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { PlusIcon, Loader2, MoreHorizontal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Company } from "@/data/repositories/IRepository";
import { toast } from "react-toastify";
import { useCompanyService } from "@/contexts/CompanyContext";
import { CompanyModalForm } from "../company-model-form";

export function CompaniesTable() {
  const service = useCompanyService();

  const [companyToEdit, setCompanyToEdit] = useState<Company | undefined>(
    undefined
  );
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const res = await service.getCompanies();
      setCompanies(res);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(
          error.message || "An error occurred while fetching companies."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const [loading, setLoading] = useState(false);
  const getCompanyTypeColor = (companyType: string) => {
    switch (companyType) {
      case "carrier":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case "expeditor":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  const onUpdateCompanyPressed = (company: Company) => {
    console.log("company passed", company);
    setCompanyToEdit(company);
    setIsModalOpen(true);
  };
  const onCreateCompanyPressed = () => {
    setCompanyToEdit(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="rounded-md border flex-1 p-4 md:p-6 ">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        Список компании
      </h2>
      <CompanyModalForm
        companyToEdit={companyToEdit}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={() => {
          loadCompanies();
          setIsModalOpen(false);
        }}
      />
      <Table>
        <TableHeader>
          <div className="my-2">
            <Button onClick={onCreateCompanyPressed} size="sm">
              <PlusIcon className="h-4 w-4" />
              <span>Создать компанию</span>
            </Button>
          </div>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>БИН</TableHead>

            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              </TableCell>
            </TableRow>
          ) : companies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            companies.map((company) => (
              <TableRow key={company.ID}>
                <TableCell className="font-medium">{company.name}</TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={getCompanyTypeColor(company.companyType)}
                  >
                    {company.companyType}
                  </Badge>
                </TableCell>
                <TableCell>{company.bin}</TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Действия</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => onUpdateCompanyPressed(company)}
                      >
                        Редактировить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
