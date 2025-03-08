import { ApiError } from "@/apiError";
import { db } from "@/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import {
  Company,
  Driver,
  IRepository,
  Truck,
  TruckFull,
  TruckLocation,
} from "./IRepository";

export class FirestoreRepository implements IRepository {
  async getTruckLocations(truckName: string): Promise<TruckLocation[]> {
    const q = query(
      collection(db, "geos"),
      // where("truckid", "==", truckID),
      where("truck", "==", truckName),
      orderBy("timestamp", "asc")
    );

    const querySnapshot = await getDocs(q);
    const locations: TruckLocation[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      locations.push({
        lat: data.latitude,
        lng: data.longitude,
        timestamp: data.timestamp.toDate(),
      });
    });
    if (!locations || locations.length == 0) {
      throw new ApiError(
        500,
        "There are no records for this specific truck",
        "200",
        {}
      );
    }
    return locations;
  }

  async getTrucks(): Promise<Truck[]> {
    const q = query(collection(db, "trucks"));
    const querySnapshot = await getDocs(q);
    const trucks: Truck[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      trucks.push({
        name: data.truck,
        ID: data.truckid,
        driverID: data.driverid,
        companyID: data.companyid,
      });
    });
    return trucks;
  }

  async getDriversByIds(driverIDs: string[]): Promise<Record<string, Driver>> {
    if (driverIDs.length === 0) return {};

    const q = query(
      collection(db, "drivers"),
      where("driverid", "in", driverIDs)
    );
    const querySnapshot = await getDocs(q);

    const drivers: Record<string, Driver> = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      drivers[data.driverid] = {
        ID: data.driverid,
        name: data.name,
      };
    });

    return drivers;
  }

  async getCompaniesByIds(
    companyIDs: string[]
  ): Promise<Record<string, Company>> {
    if (companyIDs.length === 0) return {};

    const q = query(
      collection(db, "companies"),
      where("companyid", "in", companyIDs)
    );
    const querySnapshot = await getDocs(q);

    const companies: Record<string, Company> = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      companies[data.companyid] = {
        ID: data.companyid,
        name: data.name,
      };
    });

    return companies;
  }

  async getTruckStatus(truckID: string): Promise<string> {
    const q = query(
      collection(db, "order_trucks"),
      where("truckid", "==", truckID),
      where("status", "==", "active")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty ? "Свободный" : "На заявке";
  }

  async getTrucksByCompany(companyID: string): Promise<TruckFull[]> {
    const q = query(
      collection(db, "trucks"),
      where("companyid", "==", companyID)
    );
    const querySnapshot = await getDocs(q);

    const trucks: TruckFull[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ID: data.truckid,
        name: data.truck,
        driverID: data.driverid,
        companyID: data.companyid,
      } as Truck;
    });

    const driverIDs = Array.from(
      new Set(trucks.map((t) => t.driverID).filter(Boolean))
    );
    const companyIDs = Array.from(
      new Set(trucks.map((t) => t.companyID).filter(Boolean))
    );

    const drivers = await this.getDriversByIds(driverIDs);
    const companies = await this.getCompaniesByIds(companyIDs);

    return await Promise.all(
      trucks.map(async (truck) => ({
        ...truck,
        driver: truck.driverID ? drivers[truck.driverID] : undefined,
        company: truck.companyID ? companies[truck.companyID] : undefined,
        status: await this.getTruckStatus(truck.ID),
      }))
    );
  }

  async addTruckToCompany(companyID: string): Promise<Truck[]> {
    console.log(companyID);
    const trucks: Truck[] = [];
    return trucks;
  }
  async removeTruckFromCompany(companyID: string): Promise<Truck[]> {
    console.log(companyID);
    const trucks: Truck[] = [];
    return trucks;
  }
  async updateTruckFromCompany(companyID: string): Promise<Truck[]> {
    console.log(companyID);
    const trucks: Truck[] = [];
    return trucks;
  }
}
