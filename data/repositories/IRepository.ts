import { CreateOrderDto } from "@/dto/createOrderDto";
import { CreateTruckDto } from "@/dto/createTruckDto";

export interface IRepository {
  getTruckLocations(userID: string): Promise<TruckLocation[]>;

  getTrucks(): Promise<Truck[]>;
  getTrucksByCompany(companyID: string): Promise<Truck[]>;
  addTruckToCompany(companyID: string, truck: CreateTruckDto): Promise<Truck>;
  removeTruckFromCompany(companyID: string): Promise<Truck[]>;
  updateTruckFromCompany(companyID: string): Promise<Truck[]>;

  getDrivers(companyID: string): Promise<Driver[]>;
  addDriver(companyID: string, driver: Driver): Promise<Driver>;
  getOrdersByCompany(companyID: string): Promise<Order[]>;
  getCarrierOrdersByCompany(companyID: string): Promise<Order[]>;
  addOrderToCompany(companyID: string, order: CreateOrderDto): Promise<Order>;
}

export type TruckLocation = {
  lat: number;
  lng: number;
  timestamp: Date;
};

export type Truck = {
  ID: string;
  name: string;
};

export type Driver = {
  ID?: string;
  name: string;
};

export type Company = {
  ID: string;
  name: string;
};

export type TruckFull = Truck & {
  driver?: Driver;
  company?: Company;
  status?: string;
};

export type Order = {
  ID: string;
  name: string;
  comment?: string;
  status: string;
};
