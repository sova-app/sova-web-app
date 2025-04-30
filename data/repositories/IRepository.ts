import { CreateCompanyDto } from "@/dto/createCompanyDto";
import { CreateOrderDto } from "@/dto/createOrderDto";
import { CreateTruckDto } from "@/dto/createTruckDto";
import { UpdateCompanyDto } from "@/dto/updateCompanyDto";

export interface IRepository {
  getTruckLocations(userID: string): Promise<TruckLocation[]>;
  getCarrierCompanies(): Promise<Company[]>;

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
  getCarrierOrderById(orderID: string): Promise<CarrierOrder>;
  getOrderTrucks(orderID: string): Promise<OrderTruckExtended[]>;
  getCarrierOrderTrucks(orderID: string): Promise<OrderTruckExtended[]>;
  getCarrierOrdersByCompany(companyID: string): Promise<CarrierOrderExtended[]>;
  addOrderToCompany(companyID: string, order: CreateOrderDto): Promise<Order>;

  // admin shit
  getCompanies(): Promise<Company[]>;
  createCompany(companyDto: CreateCompanyDto): Promise<Company>;
  updateCompany(companyDto: UpdateCompanyDto): Promise<Company>;
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
  companyType: string;
  bin: string;
};

export type TruckFull = Truck & {
  driver?: Driver | null;
  company?: Company | null;
  status?: string;
};

export type Order = {
  ID: string;
  name: string;
  companyID: string;
  comment?: string;
  status: OrderStatus;
  start_date?: Date | null;
  end_date?: Date | null;
};

export type OrderTruck = {
  truckID: string;
  orderID: string;
  companyID: string;
  status: OrderTruckStatus;
  start_date?: Date | null;
  end_date?: Date | null;
};
export type OrderTruckExtended = OrderTruck & {
  truckName: string;
};

export type CarrierOrder = {
  ID: string;
  orderID: string;
  companyID: string;
  status: OrderStatus;
  start_date?: Date | null;
  end_date?: Date | null;
};
export type CarrierOrderExtended = CarrierOrder & {
  orderName: string;
  orderCompanyID: string;
};

export type OrderStatus =
  | "INITIATED"
  | "CANCELLED"
  | "DONE"
  | "ACTIVE"
  | "INITIATED";

export type OrderTruckStatus = "ACTIVE" | "DONE" | "IDLE";

export enum Roles {
  admin = "admin",
  carrier = "carrier",
  expeditor = "expeditor",
  driver = "driver",
}
