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
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  CarrierOrderExtended,
  Company,
  Driver,
  IRepository,
  Order,
  OrderStatus,
  OrderTruckExtended,
  OrderTruckStatus,
  Truck,
  TruckFull,
  TruckLocation,
} from "./IRepository";
import { CreateTruckDto } from "@/dto/createTruckDto";
import { CreateOrderDto } from "@/dto/createOrderDto";
import { CreateCompanyDto } from "@/dto/createCompanyDto";
import { UpdateCompanyDto } from "@/dto/updateCompanyDto";

const generate_id = () => {
  const ID = Math.random().toString(36).substring(7);
  return ID;
};

export class FirestoreRepository implements IRepository {
  updateCarrierOrderStatus(orderID: string): Promise<Order> {
    throw new Error("Method not implemented.");
  }
  getDrivers(companyID: string): Promise<Driver[]> {
    throw new Error("Method not implemented.");
  }
  async getOrderById(orderID: string): Promise<Order> {
    console.log(`*** calling 'getOrderById' with ${orderID} ***`);
    try {
      const querySnapshot = await getDoc(doc(db, "orders", orderID));

      if (querySnapshot.exists()) {
        const orderData = querySnapshot.data();
        return {
          ID: orderData.id,
          companyID: orderData.companyid,
          name: orderData.name,
          status: orderData.status,
          comment: orderData.comment,
        };
      } else {
        throw new ApiError(404, "Order not found", "404", {});
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      throw new ApiError(500, "Failed to fetch order", "500", {});
    }
  }

  async getCarrierOrderById(orderID: string): Promise<CarrierOrderExtended> {
    console.log(`*** calling 'getCarrierOrderById' with ${orderID} ***`);
    try {
      const orderRed = collection(db, "carrier_orders");
      const q = query(orderRed, where("id", "==", orderID));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const orderDoc = querySnapshot.docs[0];
        const orderData = orderDoc.data();
        const order = await this.getOrderById(orderData.orderid);
        return {
          ID: orderData.id,
          orderID: orderData.orderid,
          companyID: orderData.companyid,
          status: orderData.status,
          end_date: orderData.end_date ? orderData.end_date.toDate() : null,
          orderName: order.name,
          orderCompanyID: order.companyID,
          start_date: orderData.start_date
            ? orderData.start_date.toDate()
            : null,
        };
      } else {
        throw new ApiError(404, "Carrier order not found", "404", {});
      }
    } catch (error) {
      console.error("Error fetching Carrier order:", error);
      throw new ApiError(500, "Failed to fetch Carrier order", "500", {});
    }
  }

  async getTruckById(truckID: string): Promise<Truck> {
    try {
      const trucksRef = collection(db, "trucks");
      const q = query(trucksRef, where("id", "==", truckID));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const truckDoc = querySnapshot.docs[0];
        const truckData = truckDoc.data();
        return {
          ID: truckData.id,
          name: truckData.truck,
        };
      } else {
        throw new ApiError(404, "Truck not found", "404", {});
      }
    } catch (error) {
      console.error("Error fetching truck:", error);
      throw new ApiError(500, "Failed to fetch truck", "500", {});
    }
  }

  async getOrderTrucks(orderID: string): Promise<OrderTruckExtended[]> {
    try {
      const orderTrucksRef = collection(db, "order_trucks");
      const q = query(orderTrucksRef, where("orderid", "==", orderID));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return [];
      }

      const orderTrucks: OrderTruckExtended[] = [];
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        const truck = await this.getTruckById(data.truckid);
        orderTrucks.push({
          truckID: data.truckid,
          truckName: truck.name,
          orderID: data.orderid,
          companyID: data.companyid,
          status: data.status as OrderTruckStatus,
          start_date: data.end_date ? data.start_date.toDate() : null,
          end_date: data.end_date ? data.end_date.toDate() : null,
        });
      }
      return orderTrucks;
    } catch (error) {
      console.error("Error fetching order trucks:", error);
      throw new ApiError(500, "Failed to fetch order trucks", "500", {});
    }
  }
  async getCarrierOrderTrucks(
    carrierOrderID: string
  ): Promise<OrderTruckExtended[]> {
    try {
      const carrierOrder = await this.getCarrierOrderById(carrierOrderID);
      const orderTrucksRef = collection(db, "order_trucks");
      const q = query(
        orderTrucksRef,
        where("orderid", "==", carrierOrder.ID),
        where("companyid", "==", carrierOrder.companyID)
      );
      const orderTrucksSnapshot = await getDocs(q);

      if (orderTrucksSnapshot.empty) {
        return [];
      }

      const orderTrucks: OrderTruckExtended[] = [];
      for (const doc of orderTrucksSnapshot.docs) {
        const data = doc.data();
        const truck = await this.getTruckById(data.truckid);
        orderTrucks.push({
          truckID: data.truckid,
          truckName: truck.name,
          orderID: data.orderid,
          companyID: carrierOrder.companyID,
          status: data.status as OrderTruckStatus,
          start_date: data.end_date ? data.start_date.toDate() : null,
          end_date: data.end_date ? data.end_date.toDate() : null,
        });
      }
      return orderTrucks;
    } catch (error) {
      console.error("Error fetching order trucks:", error);
      throw new ApiError(500, "Failed to fetch order trucks", "500", {});
    }
  }

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
        ID: data.id,
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
        companyType: data.type,
        bin: data.bin,
      };
    });

    return companies;
  }

  async getCarrierCompanies(): Promise<Company[]> {
    const q = query(
      collection(db, "companies"),
      where("type", "==", "carrier")
    );
    const querySnapshot = await getDocs(q);

    const companies: Company[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      companies.push({
        ID: data.id,
        name: data.name,
        companyType: data.type,
        bin: data.bin,
      });
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
    const truckDrivers = driverTrucksSnapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      acc[data.truckid] = data.driverid;
      return acc;
    }, {} as Record<string, string>);
    console.log("Fetching truck drivers", truckDrivers);

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

  async getTruckData(truckID: string): Promise<TruckFull> {
    const q = query(collection(db, "trucks"), where("id", "==", truckID));
    const truckQuerySnapshot = await getDocs(q);
    const truckData = truckQuerySnapshot.docs[0].data();

    // Driver Data
    const driverTruckQuery = query(
      collection(db, "driver_trucks"),
      where("truckid", "==", truckID)
    );
    const driverTruckQuerySnapshot = await getDocs(driverTruckQuery);
    const driverTruckData = driverTruckQuerySnapshot.docs[0].data();
    const driverData = await this.getDriverById(driverTruckData.driverid);

    // Company data
    const companyTruckQuery = query(
      collection(db, "company_trucks"),
      where("truckid", "==", truckID)
    );
    const companyTruckQuerySnapshot = await getDocs(companyTruckQuery);
    const companyTruckData = companyTruckQuerySnapshot.docs[0].data();
    const companyData = await this.getCompanyById(companyTruckData.companyid);

    return {
      ID: truckData.truckid,
      name: truckData.name,
      company: companyData,
      driver: driverData,
    };
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
    throw new Error("Method not implemented.");
  }
  async updateTruckFromCompany(companyID: string): Promise<Truck[]> {
    throw new Error("Method not implemented.");
  }
  async getDriversByCompany(companyID: string): Promise<Driver[]> {
    const companyTrucksQuery = query(
      collection(db, "company_drivers"),
      where("companyid", "==", companyID)
    );
    const companyTrucksSnapshot = await getDocs(companyTrucksQuery);

    const driverIDs = companyTrucksSnapshot.docs.map(
      (doc) => doc.data().driverid
    );

    if (driverIDs.length === 0) {
      return [];
    }

    const driversQuery = query(
      collection(db, "drivers"),
      where("id", "in", driverIDs)
    );
    const querySnapshot = await getDocs(driversQuery);

    const drivers: Driver[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      drivers.push({
        name: data.name,
        ID: data.id,
      });
    });
    console.log("Fetching company Drivers", drivers);
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

  async getDriverById(driverID: string): Promise<Driver | null> {
    // Если водителя нет в кеше, делаем запрос в базу данных
    const q = query(collection(db, "drivers"), where("id", "==", driverID));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const driverData = querySnapshot.docs[0].data();
    const driver: Driver = {
      ID: driverData.id,
      name: driverData.name,
    };

    return driver;
  }

  async getCompanyById(companyID: string): Promise<Company | null> {
    // Если водителя нет в кеше, делаем запрос в базу данных
    const q = query(collection(db, "companies"), where("id", "==", companyID));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const companyData = querySnapshot.docs[0].data();
    const company: Company = {
      ID: companyData.id,
      name: companyData.name,
      companyType: companyData.type,
      bin: companyData.bin,
    };

    return company;
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

  async getOrdersByCompany(companyID: string): Promise<Order[]> {
    const q = query(
      collection(db, "orders"),
      where("companyid", "==", companyID)
    );
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    for (const docum of querySnapshot.docs) {
      const data = docum.data();
      orders.push({
        ID: docum.id,
        name: data.name,
        comment: data.comment,
        status: data.status,
        companyID: data.companyid,
      });
    }
    console.log("Orders", orders);
    return orders;
  }

  async getTrucksByOrder(orderID: string): Promise<TruckFull[]> {
    const orderTrucksQuery = query(
      collection(db, "order_trucks"),
      where("orderid", "==", orderID)
    );
    const orderTrucksSnapshot = await getDocs(orderTrucksQuery);

    const trucks: TruckFull[] = [];
    for (const orderTruckDoc of orderTrucksSnapshot.docs) {
      const orderTruckData = orderTruckDoc.data();
      const truckID = orderTruckData.truckid;
      const truck = await this.getTruckData(truckID);
      trucks.push(truck);
    }
    return trucks;
  }

  async getCarrierOrdersByCompany(
    companyID: string
  ): Promise<CarrierOrderExtended[]> {
    const carrierOrderQuery = query(
      collection(db, "carrier_orders"),
      where("companyid", "==", companyID)
    );
    const carrierOrderSnapshot = await getDocs(carrierOrderQuery);

    const carrierOrders: CarrierOrderExtended[] = [];
    for (const carrierOrder of carrierOrderSnapshot.docs) {
      const carrierOrderData = carrierOrder.data();
      const q = query(
        collection(db, "orders"),
        where("id", "==", carrierOrderData.orderid)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const orderData = docSnap.data();
        carrierOrders.push({
          ID: carrierOrderData.id,
          orderID: orderData.id,
          orderName: orderData.name,
          orderCompanyID: orderData.companyid,
          end_date: carrierOrderData.end_date
            ? carrierOrderData.end_date.toDate()
            : null,
          start_date: carrierOrderData.start_date
            ? carrierOrderData.start_date.toDate()
            : null,
          status: orderData.status,
          companyID: companyID,
        });
      }
    }
    return carrierOrders;
  }

  async addOrderToCompany(
    companyID: string,
    order: CreateOrderDto
  ): Promise<Order> {
    console.log(`*** calling 'addOrderToCompany' ***`);
    // Order Creation
    const orderRef = await addDoc(collection(db, "orders"), {
      id: generate_id(),
      name: order.name,
      companyid: companyID,
      status: "INITIATED",
      comment: order.comment || "",
      start_date: null,
      end_date: null,
    });
    const createdOrder = await getDoc(orderRef);
    const createdOrderData = createdOrder.data();
    const trucksBatch = order.truckIDs.map((truckID: string) => {
      const orderTruckData = {
        id: generate_id(),
        orderid: createdOrderData!.id,
        truckid: truckID,
        companyid: companyID,
        status: "IDLE",
        start_date: null,
        end_date: null,
      };
      const orderTruckRef = doc(db, "order_trucks", orderTruckData.id);
      return setDoc(orderTruckRef, orderTruckData);
    });

    const carrierOrdersBatch = order.companyIDs?.map(
      (carrierCompID: string) => {
        const orderTruckData = {
          id: generate_id(),
          orderid: createdOrderData!.id,
          companyid: carrierCompID,
          status: "INITIATED",
          comment: order.comment || "",
          start_date: null,
          end_date: null,
        };
        const orderTruckRef = doc(db, "carrier_orders", orderTruckData.id);
        return setDoc(orderTruckRef, orderTruckData);
      }
    );

    await Promise.all(trucksBatch);
    if (carrierOrdersBatch) {
      await Promise.all(carrierOrdersBatch);
    }

    console.log(`*** returning from 'addOrderToCompany' ***`);

    return {
      ID: createdOrderData!.id,
      name: createdOrderData!.name,
      comment: createdOrderData!.comment,
      status: createdOrderData!.status,
      companyID: createdOrderData!.companyid,
    };
  }

  // admin shit
  async getCompanies(): Promise<Company[]> {
    const q = query(collection(db, "companies"));
    const querySnapshot = await getDocs(q);

    const companies: Company[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      companies.push({
        ID: data.id,
        name: data.name,
        companyType: data.type,
        bin: data.bin,
      });
    });

    return companies;
  }

  async createCompany(companyDto: CreateCompanyDto): Promise<Company> {
    try {
      const companyID = generate_id();
      const companyRef = doc(db, "companies", companyID);
      setDoc(companyRef, {
        id: companyID,
        name: companyDto.name,
        type: companyDto.companyType,
        bin: companyDto.bin,
      });

      return { ...companyDto, ID: companyID };
    } catch (error) {
      console.error("Ошибка при добавлении компании:", error);
      throw new Error("Не удалось добавить компании");
    }
  }

  async updateCompany(companyDto: UpdateCompanyDto): Promise<Company> {
    try {
      // will not work
      const companyRef = doc(db, "companies", companyDto.ID);
      setDoc(companyRef, {
        id: companyDto.ID,
        name: companyDto.name,
        type: companyDto.companyType,
        bin: companyDto.bin,
      });

      return { ...companyDto };
    } catch (error) {
      console.error("Ошибка при обновлении компании:", error);
      throw new Error("Не удалось обновить компанию");
    }
  }

  async updateOrderStatus(
    orderID: string,
    status: OrderStatus
  ): Promise<Order> {
    try {
      console.log("updating", orderID, status);
      const order = await this.getOrderById(orderID);
      await updateDoc(doc(db, "orders", orderID), { status });
      console.log("updated", { ...order, status: status });
      return { ...order, status: status };
    } catch (error) {
      console.error("Ошибка при обновлении заказа:", error);
      throw new Error("Не удалось обновить статус заказа");
    }
  }
}
