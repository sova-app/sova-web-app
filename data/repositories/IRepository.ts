export interface IRepository {
  getTruckLocations(userID: string): Promise<TruckLocation[]>;
  getTrucks(): Promise<Truck[]>;
}

export type TruckLocation = {
  lat: number;
  lng: number;
  timestamp: Date;
};

export type Truck = {
  name: string;
  ID: string;
};
