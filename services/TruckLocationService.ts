import { DataSourceFactory } from "../data/DataSourceFactory";
import { Truck, TruckLocation } from "../data/repositories/IRepository";

export class TruckLocationService {
  private repository = DataSourceFactory.getRepository();

  async getTruckLocations(userID: string): Promise<TruckLocation[]> {
    return await this.repository.getTruckLocations(userID);
  }

  async getTrucks(): Promise<Truck[]> {
    return await this.repository.getTrucks();
  }
}
