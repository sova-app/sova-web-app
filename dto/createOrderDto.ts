export type CreateOrderDto = {
  name: string;
  truckIDs: string[];
  companyIDs?: string[];
  comment?: string;
};
