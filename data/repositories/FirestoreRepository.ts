import { ApiError } from "@/apiError";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  Company,
  Driver,
  IRepository,
  Truck,
  TruckFull,
  TruckLocation,
} from "./IRepository";
import { CreateTruckDto } from "@/dto/createTruckDto";

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

    const drivers = await this.getDriversByIds(driverIDs as string[]);
    const companies = await this.getCompaniesByIds(companyIDs as string[]);

    return await Promise.all(
      trucks.map(async (truck) => ({
        ...truck,
        driver: truck.driverID ? drivers[truck.driverID] : undefined,
        company: truck.companyID ? companies[truck.companyID] : undefined,
        status: await this.getTruckStatus(truck.ID),
      }))
    );
  }

  async addTruckToCompany(
    companyID: string,
    truck: CreateTruckDto
  ): Promise<Truck> {
    try {
      const truckID = Math.random().toString(36).substring(7);
      const truckRef = await addDoc(collection(db, "trucks"), {
        truck: truck.name,
        truckid: truckID,
      });
      console.log("Created truck with ID:", truckRef.id);

      const createdTruck = await getDoc(truckRef);
      const createdTruckData = createdTruck.data();

      await addDoc(collection(db, "company_trucks"), {
        truckid: createdTruckData!.truckid,
        companyid: companyID,
      });
      console.log("Added truck to company");

      if (truck.driverID) {
        await addDoc(collection(db, "driver_trucks"), {
          driverid: truck.driverID,
          truckid: createdTruckData!.truckid,
        });
      }
      console.log(
        "Added driver to truck",
        truck.driverID,
        createdTruckData!.truckid
      );

      return { ID: truckRef.id, name: truck.name };
    } catch (error) {
      console.error("Ошибка при добавлении грузовика:", error);
      throw new Error("Не удалось добавить грузовик");
    }
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

  async getDrivers(companyID: string): Promise<Driver[]> {
    // TODO SA-100: Implement filtering by companyID
    console.log(companyID);
    const q = query(collection(db, "drivers"));
    const querySnapshot = await getDocs(q);
    const drivers: Driver[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      drivers.push({
        name: data.name,
        ID: data.id,
      });
    });
    return drivers;
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

  async addDriver(companyID: string, driver: Driver): Promise<Driver> {
    try {
      const driverRef = await addDoc(collection(db, "drivers"), {
        name: driver.name,
      });

      await addDoc(collection(db, "company_drivers"), {
        driverid: driverRef.id,
        companyid: companyID,
      });
      return { ID: driverRef.id, ...driver };
    } catch (error) {
      console.error("Ошибка при добавлении водителя:", error);
      throw new Error("Не удалось добавить водителя");
    }
  }
}
