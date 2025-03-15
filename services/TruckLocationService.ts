// TruckLocationService.ts
import { DataSourceFactory } from "../data/DataSourceFactory";
import { Truck, TruckLocation } from "../data/repositories/IRepository";

export class TruckLocationService {
  private repository = DataSourceFactory.getRepository();

  getTruckLocations = async (truckName: string): Promise<TruckLocation[]> => {
    return await this.repository.getTruckLocations(truckName);
  };

  getTrucks = async (): Promise<Truck[]> => {
    return await this.repository.getTrucks();
  };

  getTruckById = async (truckID: string): Promise<Truck> => {
    return await this.repository.getTruckById(truckID);
  };
}
