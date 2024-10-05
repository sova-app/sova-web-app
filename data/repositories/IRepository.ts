export interface IRepository {
  getTruckLocations(userID: string): Promise<TruckLocation[]>;
}

export type TruckLocation = {
  lat: number;
  lng: number;
  timestamp: Date;
};
