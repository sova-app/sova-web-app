import { DataSourceFactory } from "../data/DataSourceFactory";
import { TruckLocation } from "../data/repositories/IRepository";

export class TruckLocationService {
  private repository = DataSourceFactory.getRepository();

  async getTruckLocations(userID: string): Promise<TruckLocation[]> {
    return await this.repository.getTruckLocations(userID);
  }
}
