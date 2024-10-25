import { IRepository, Truck, TruckLocation } from "./IRepository";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

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
}
