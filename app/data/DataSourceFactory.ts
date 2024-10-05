import { IRepository } from "./repositories/IRepository";
import { FirestoreRepository } from "./repositories/FirestoreRepository";

export class DataSourceFactory {
  static getRepository(): IRepository {
    // TODO: change it, so api url will be given inside .env file
    return new FirestoreRepository();
  }
}
