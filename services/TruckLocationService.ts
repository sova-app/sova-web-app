// TruckLocationService.ts
import { DataSourceFactory } from "../data/DataSourceFactory";
import { Truck, TruckLocation } from "../data/repositories/IRepository";

export class TruckLocationService {
  private repository = DataSourceFactory.getRepository();

  getTruckLocations = async (userID: string): Promise<TruckLocation[]> => {
    return await this.repository.getTruckLocations(userID);
  };

  getTrucks = async (): Promise<Truck[]> => {
    return await this.repository.getTrucks();
  };
}
