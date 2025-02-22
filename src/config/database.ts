import { Sequelize, Transaction, QueryOptions, QueryTypes } from "sequelize";
import logger from "@utils/logger";
import { version } from "os";
import { V4MAPPED } from "dns";

interface DatabaseParams {
  host: string;
  hostReadOnly: string;
  databaseName: string;
  user: string;
  password: string;
  mysqlPoolMax: number;
  mysqlPoolMin: number;
  databasetimeout?: number;
  logging?: boolean;
}

interface QueryOptionsDTO {
  transaction?: Transaction;
  queryType: keyof typeof QueryTypes;
  replacements?: Record<string, unknown>;
  logging?: boolean;
  databasetimeout?: number;
}

class Database {
  private static instance: Database;
  private readInstance: Sequelize | null = null;
  private writeInstance: Sequelize | null = null;
  private isInitialized: boolean = false;
  private connection: Sequelize | null = null;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private checkConnection() {
    if (!this.isInitialized) {
      throw new Error("Database não foi inicializado. Chame o método connect() primeiro.");
    }
  }

  async connect(params: DatabaseParams): Promise<void> {
    const {
      host,
      hostReadOnly,
      databaseName,
      user,
      password,
      mysqlPoolMax,
      mysqlPoolMin,
      databasetimeout
    } = params;

    if (!host || !databaseName || !user || !password) {
      throw new Error("Configurações de banco inválidas");
    }

    const baseConfig = {
      dialect: 'mysql' as const,
      dialectOptions: { connectTimeout: 10000 },
      pool: {
        max: mysqlPoolMax || 5,
        min: mysqlPoolMin || 1,
        acquire: 10000,
        idle: 1000,
      },
      logging: false, 
    };

    this.writeInstance = new Sequelize(databaseName, user, password, {
      ...baseConfig,
      host,
    });

    this.readInstance = new Sequelize(databaseName, user, password, {
      ...baseConfig,
      host: hostReadOnly,
    });

    this.connection = new Sequelize({
      dialect: 'mysql',
      host: params.host,
      database: params.databaseName,
      username: params.user,
      password: params.password,
      pool: {
        max: Number(params.mysqlPoolMax),
        min: Number(params.mysqlPoolMin),
      },
      dialectOptions: {
        connectTimeout: Number(params.databasetimeout),
      },
      logging: params.logging ? console.log : false,
    });

    await this.execute("SELECT 1", { queryType: "SELECT" });
    this.isInitialized = true;
    // console.info("Conexão com banco de dados estabelecida com sucesso");
  }

  private async queryWithTimeout<T>(
    queryFn: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Query timeout: ${timeout}ms`));
      }, timeout);

      queryFn()
        .then((result) => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  async execute(sql: string, options: QueryOptionsDTO): Promise<any> {
    const {
      transaction,
      queryType,
      replacements,
      logging,
      databasetimeout = 30000,
    } = options;

    try {
      const queryOptions: QueryOptions = {
        type: QueryTypes[queryType],
        transaction,
        replacements,
        logging,
      };

      const instance =
        queryType === "SELECT" ? this.readInstance : this.writeInstance;

      if (!instance) {
        throw new Error("Database não inicializado");
      }

      return await this.queryWithTimeout(
        () => instance.query(sql, queryOptions),
        databasetimeout
      );
    } catch (error) {
      logger.error("Erro na execução da query:", error);
      if (transaction) await this.rollback(transaction);
      throw error;
    }
  }

  async query(sql: string, options: QueryOptions & { timeout?: number }): Promise<any> {
    const instance = options.type === QueryTypes.SELECT ? this.readInstance : this.writeInstance;

    if (!instance) {
      throw new Error("Database não inicializado");
    }

    return await this.queryWithTimeout(
      () => instance.query(sql, options),
      options.timeout || 30000
    );
  }

  async getTransaction(): Promise<Transaction> {
    if (!this.writeInstance) {
      throw new Error("Instância de escrita não inicializada");
    }
    return this.writeInstance.transaction();
  }

  async commit(transaction: Transaction): Promise<void> {
    if (!transaction) throw new Error("Transação inválida");
    await transaction.commit();
  }

  async rollback(transaction: Transaction): Promise<void> {
    if (!transaction) throw new Error("Transação inválida");
    await transaction.rollback();
  }

  public getSequelize(): Sequelize {
    this.checkConnection();
    if (!this.writeInstance) {
      throw new Error("Instância de escrita não está disponível");
    }
    return this.writeInstance;
  }
}

export default Database.getInstance();
