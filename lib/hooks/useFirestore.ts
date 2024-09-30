// useFirestore.ts
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";

type Location = {
  lat: number;
  lng: number;
  timestamp: Date;
};

const useFirestore = (userID: string) => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    if (!userID) return;
    const q = query(
      collection(db, "geos"),
      where("truck", "==", userID),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const locationList: Location[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        locationList.push({
          lat: data.latitude,
          lng: data.longitude,
          timestamp: data.timestamp.toDate(),
        });
      });
      setLocations(locationList);
    });
    return () => unsubscribe();
  }, [userID]);
  console.log(locations);
  return locations;
};

export default useFirestore;
