import { ApiError } from "@/apiError";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import {
  Company,
  Driver,
  IRepository,
  Order,
  Truck,
  TruckFull,
  TruckLocation,
} from "./IRepository";
import { CreateTruckDto } from "@/dto/createTruckDto";
import { CreateOrderDto } from "@/dto/createOrderDto";

const generate_id = () => {
  const ID = Math.random().toString(36).substring(7);
  return ID;
};

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
      });
    });
    return trucks;
  }

  async getCompaniesByIds(
    companyIDs: string[]
  ): Promise<Record<string, Company>> {
    if (companyIDs.length === 0) return {};

    const q = query(collection(db, "companies"), where("id", "in", companyIDs));
    const querySnapshot = await getDocs(q);

    const companies: Record<string, Company> = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      companies[data.id] = {
        ID: data.id,
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
    const companyTrucksQuery = query(
      collection(db, "company_trucks"),
      where("companyid", "==", companyID)
    );
    const companyTrucksSnapshot = await getDocs(companyTrucksQuery);

    const truckIDs = companyTrucksSnapshot.docs.map(
      (doc) => doc.data().truckid
    );

    if (truckIDs.length === 0) {
      return [];
    }

    const trucksQuery = query(
      collection(db, "trucks"),
      where("id", "in", truckIDs)
    );
    const trucksSnapshot = await getDocs(trucksQuery);

    const trucks: Truck[] = trucksSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ID: data.id,
        name: data.truck,
      } as Truck;
    });
    console.log("Fetching trucks by company", trucks);

    const driverTrucksQuery = query(
      collection(db, "driver_trucks"),
      where("truckid", "in", truckIDs)
    );
    const driverTrucksSnapshot = await getDocs(driverTrucksQuery);
    const driverIDs = driverTrucksSnapshot.docs.map(
      (doc) => doc.data().driverid
    );
    console.log("Fetching driver IDs", driverIDs);
    // I think i want a map [truckID: driverID]
    const truckDrivers = driverTrucksSnapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      acc[data.truckid] = data.driverid;
      return acc;
    }, {} as Record<string, string>);
    console.log("Fetching truck drivers", truckDrivers);

    // Получаем все записи из drivers, фильтруя по driverid
    const drivers = await this.getDriversByIds(driverIDs as string[]);
    console.log("Fetching drivers by IDs", drivers);
    const companies = await this.getCompaniesByIds([companyID]);
    console.log("Fetching companies by IDs", companies);

    return await Promise.all(
      trucks.map(async (truck) => ({
        ...truck,
        driver: drivers[truckDrivers[truck.ID]],
        company: companies[companyID],
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
        id: truckID,
      });
      console.log("Created truck with ID:", truckRef.id);

      const createdTruck = await getDoc(truckRef);
      const createdTruckData = createdTruck.data();

      await addDoc(collection(db, "company_trucks"), {
        truckid: createdTruckData!.id,
        companyid: companyID,
      });
      console.log("Added truck to company");

      if (truck.driverID) {
        await addDoc(collection(db, "driver_trucks"), {
          driverid: truck.driverID,
          truckid: createdTruckData!.id,
        });
      }
      console.log(
        "Added driver to truck",
        truck.driverID,
        createdTruckData!.id
      );

      return { ID: createdTruckData!.id, name: truck.name };
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

    const q = query(collection(db, "drivers"), where("id", "in", driverIDs));
    const querySnapshot = await getDocs(q);

    const drivers: Record<string, Driver> = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      drivers[data.id] = {
        ID: data.id,
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

  // Orders
  async getOrdersByCompany(companyID: string): Promise<Order[]> {
    const q = query(
      collection(db, "orders"),
      where("companyid", "==", companyID)
    );
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        ID: data.id,
        name: data.name,
        comment: data.comment,
        status: data.status,
      });
    });
    return orders;
  }

  async addOrderToCompany(
    companyID: string,
    order: CreateOrderDto
  ): Promise<Order> {
    const driverRef = await addDoc(collection(db, "orders"), {
      id: generate_id(),
      name: order.name,
      companyid: companyID,
      status: "INITIATED",
      comment: order.comment || "",
      start_date: serverTimestamp(),
    });
    const createdOrder = await getDoc(driverRef);
    const createdOrderData = createdOrder.data();
    console.log("Created order:", createdOrderData);

    const batch = order.trucks.map((truck: string) => {
      const orderTruckData = {
        id: generate_id(),
        orderid: createdOrderData!.id,
        truckid: truck,
        status: "IDLE",
        start_date: serverTimestamp(),
        end_date: null,
      };
      const orderTruckRef = doc(db, "order_trucks", orderTruckData.id);
      console.log("Created order_truck:", truck);
      return setDoc(orderTruckRef, orderTruckData);
    });

    await Promise.all(batch);

    // 4. Возвращаем заказ
    return {
      ID: createdOrderData!.id,
      name: createdOrderData!.name,
      comment: createdOrderData!.comment,
      status: createdOrderData!.status,
    };
  }
}
