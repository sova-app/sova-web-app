export interface IRepository {
  getTruckLocations(userID: string): Promise<TruckLocation[]>;

  getTrucks(): Promise<Truck[]>;
  getTrucksByCompany(companyID: string): Promise<Truck[]>;
  addTruckToCompany(companyID: string): Promise<Truck[]>;
  removeTruckFromCompany(companyID: string): Promise<Truck[]>;
  updateTruckFromCompany(companyID: string): Promise<Truck[]>;
}

export type TruckLocation = {
  lat: number;
  lng: number;
  timestamp: Date;
};

export type Truck = {
  ID: string;
  name: string;
  driverID: string;
  companyID: string;
};

export type Driver = {
  ID: string;
  name: string;
};

export type Company = {
  ID: string;
  name: string;
};

export type TruckFull = Truck & {
  driver?: Driver;
  company?: Company;
  status?: string;
};
