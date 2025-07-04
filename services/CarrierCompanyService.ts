// TruckLocationService.ts
import { CreateTruckDto } from "@/dto/createTruckDto";
import { DataSourceFactory } from "../data/DataSourceFactory";
import {
  CarrierOrder,
  CarrierOrderExtended,
  Company,
  Driver,
  Order,
  OrderStatus,
  OrderTruckExtended,
  Truck,
  TruckFull,
} from "../data/repositories/IRepository";
import { CreateOrderDto } from "@/dto/createOrderDto";

export class CarrierCompanyService {
  private repository = DataSourceFactory.getRepository();

  getCarrierCompanies = async (): Promise<Company[]> => {
    return await this.repository.getCarrierCompanies();
  };

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

  getCarrierOrderById = async (orderID: string): Promise<CarrierOrder> => {
    return await this.repository.getCarrierOrderById(orderID);
  };

  getOrderTrucks = async (orderID: string): Promise<OrderTruckExtended[]> => {
    return await this.repository.getOrderTrucks(orderID);
  };

  getCarrierOrderTrucks = async (
    orderID: string
  ): Promise<OrderTruckExtended[]> => {
    return await this.repository.getCarrierOrderTrucks(orderID);
  };

  getCarrierOrdersByCompany = async (
    companyID: string
  ): Promise<CarrierOrderExtended[]> => {
    return await this.repository.getCarrierOrdersByCompany(companyID);
  };
  addOrderToCompany = async (
    companyID: string,
    order: CreateOrderDto
  ): Promise<Order> => {
    return await this.repository.addOrderToCompany(companyID, order);
  };

  updateOrderStatus = async (
    orderID: string,
    status: OrderStatus
  ): Promise<Order> => {
    return await this.repository.updateOrderStatus(orderID, status);
  };
  updateCarrierOrderStatus = async (
    orderID: string,
    status: OrderStatus
  ): Promise<CarrierOrderExtended> => {
    return await this.repository.updateCarrierOrderStatus(orderID, status);
  };
}
