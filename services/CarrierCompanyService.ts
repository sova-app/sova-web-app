// TruckLocationService.ts
import { CreateTruckDto } from "@/dto/createTruckDto";
import { DataSourceFactory } from "../data/DataSourceFactory";
import { Driver, Truck, TruckFull } from "../data/repositories/IRepository";

export class CarrierCompanyService {
  private repository = DataSourceFactory.getRepository();

  getTrucks = async (companyID: string): Promise<TruckFull[]> => {
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

  addDriver = async (companyID: string, driver: Driver): Promise<Driver> => {
    return await this.repository.addDriver(companyID, driver);
  };
}
