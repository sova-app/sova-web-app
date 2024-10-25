import { FirestoreRepository } from "./repositories/FirestoreRepository";
import { IRepository } from "./repositories/IRepository";

export class DataSourceFactory {
  static getRepository(): IRepository {
    // TODO: change it, so api url will be given inside .env file
    return new FirestoreRepository();
  }
}
