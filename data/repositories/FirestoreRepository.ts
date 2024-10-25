import { IRepository, Truck, TruckLocation } from "./IRepository";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { ApiError } from "@/apiError";

export class FirestoreRepository implements IRepository {
  async getTruckLocations(truckID: string): Promise<TruckLocation[]> {
    const q = query(
      collection(db, "geos"),
      where("truck", "==", truckID),
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
    return locations;
  }

  async getTrucks(): Promise<Truck[]> {
    throw new ApiError(500, "fuck", "101", {});
    // const q = query(collection(db, "trucks"));
    // const querySnapshot = await getDocs(q);
    // const trucks: Truck[] = [];
    // querySnapshot.forEach((doc) => {
    //   const data = doc.data();
    //   trucks.push({
    //     name: data.truck,
    //     ID: data.truckid,
    //   });
    // });
    // return trucks;
  }
}
