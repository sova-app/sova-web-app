// TruckLocationService.ts
import { CreateTruckDto } from "@/dto/createTruckDto";
import { DataSourceFactory } from "../data/DataSourceFactory";
import {
  Driver,
  Order,
  OrderTruck,
  Truck,
  TruckFull,
} from "../data/repositories/IRepository";
import { CreateOrderDto } from "@/dto/createOrderDto";

export class CarrierCompanyService {
  private repository = DataSourceFactory.getRepository();

  getTrucksByCompany = async (companyID: string): Promise<TruckFull[]> => {
    return await this.repository.getTrucksByCompany(companyID);
  };

  addTruckToCompany = async (
    companyID: string,
    truck: CreateTruckDto
  ): Promise<Truck> => {
    return await this.repository.addTruckToCompany(companyID, truck);
  };

  removeTruck = async (companyID: string): Promise<Truck[]> => {
    return await this.repository.removeTruckFromCompany(companyID);
  };

  updateTruck = async (companyID: string): Promise<Truck[]> => {
    return await this.repository.updateTruckFromCompany(companyID);
  };

  getDrivers = async (companyID: string): Promise<Driver[]> => {
    return await this.repository.getDrivers(companyID);
  };

  getDriversByCompany = async (companyID: string): Promise<Driver[]> => {
    return await this.repository.getDriversByCompany(companyID);
  };

  addDriver = async (companyID: string, driver: Driver): Promise<Driver> => {
    return await this.repository.addDriver(companyID, driver);
  };

  getOrdersByCompany = async (companyID: string): Promise<Order[]> => {
    return await this.repository.getOrdersByCompany(companyID);
  };

  getOrderById = async (orderID: string): Promise<Order> => {
    return await this.repository.getOrderById(orderID);
  };

  getOrderTrucks = async (orderID: string): Promise<OrderTruck[]> => {
    return await this.repository.getOrderTrucks(orderID);
  };

  getCarrierOrdersByCompany = async (companyID: string): Promise<Order[]> => {
    return await this.repository.getCarrierOrdersByCompany(companyID);
  };
  addOrderToCompany = async (
    companyID: string,
    order: CreateOrderDto
  ): Promise<Order> => {
    return await this.repository.addOrderToCompany(companyID, order);
  };
}
