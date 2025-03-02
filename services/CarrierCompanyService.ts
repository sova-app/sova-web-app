// TruckLocationService.ts
import { DataSourceFactory } from "../data/DataSourceFactory";
import { Truck, TruckFull } from "../data/repositories/IRepository";

export class CarrierCompanyService {
  private repository = DataSourceFactory.getRepository();

  getTrucks = async (companyID: string): Promise<TruckFull[]> => {
    return await this.repository.getTrucksByCompany(companyID);
  };

  addTruck = async (companyID: string): Promise<Truck[]> => {
    return await this.repository.addTruckToCompany(companyID);
  };

  removeTruck = async (companyID: string): Promise<Truck[]> => {
    return await this.repository.removeTruckFromCompany(companyID);
  };

  updateTruck = async (companyID: string): Promise<Truck[]> => {
    return await this.repository.updateTruckFromCompany(companyID);
  };
}
