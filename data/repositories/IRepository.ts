import { CreateOrderDto } from "@/dto/createOrderDto";
import { CreateTruckDto } from "@/dto/createTruckDto";

export interface IRepository {
  getTruckLocations(userID: string): Promise<TruckLocation[]>;

  getTrucks(): Promise<Truck[]>;
  getTruckById(truckID: string): Promise<Truck>;
  getTrucksByCompany(companyID: string): Promise<Truck[]>;
  addTruckToCompany(companyID: string, truck: CreateTruckDto): Promise<Truck>;
  removeTruckFromCompany(companyID: string): Promise<Truck[]>;
  updateTruckFromCompany(companyID: string): Promise<Truck[]>;

  getDrivers(companyID: string): Promise<Driver[]>;
  getDriversByCompany(companyID: string): Promise<Driver[]>;
  addDriver(companyID: string, driver: Driver): Promise<Driver>;
  getOrdersByCompany(companyID: string): Promise<Order[]>;
  getOrderById(orderID: string): Promise<Order>;
  getOrderTrucks(orderID: string): Promise<OrderTruck[]>;
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
  status: OrderStatus;
};

export type OrderTruck = {
  truckID: string;
  orderID: string;
  status: OrderTruckStatus;
  start_date: Date;
};

export type OrderStatus =
  | "INITIATED"
  | "CANCELLED"
  | "DONE"
  | "ACTIVE"
  | "INITIATED";

export type OrderTruckStatus = "ACTIVE" | "DONE" | "INITIATED" | "CANCELLED";
