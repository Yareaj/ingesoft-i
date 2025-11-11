import "reflect-metadata";
import { DataSource } from "typeorm";
import { AppDataSource } from "../config/dataSource";

class Database {
  private static instance: DataSource | null = null;

  private constructor() {}

  static getInstance(): DataSource {
    if (!Database.instance) {
      Database.instance = AppDataSource;
    }
    return Database.instance;
  }

  static async initialize(): Promise<DataSource> {
    const ds = Database.getInstance();
    if (!ds.isInitialized) {
      await ds.initialize();
    }
    return ds;
  }
  static async close(): Promise<void> {
    const ds = Database.getInstance();

    if (ds && ds.isInitialized) {
      await ds.destroy();
      Database.instance = null;
    }
  }
}

export default Database;
