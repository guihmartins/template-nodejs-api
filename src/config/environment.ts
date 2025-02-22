import dotenv from "dotenv";
dotenv.config({ path: process.env.ENV_FILE_PATH || ".env.development" });

interface Environment {
  apiPort: string;
  databaseName: string;
  host: string;
  hostReadOnly: string;
  password: string;
  user: string;
  databasetimeout: number;
  mysqlPoolMax: number;
  mysqlPoolMin: number;
  logLevel: string;
  debug: string;
}

const getEnvironmentVariable = (environmentVariableName: string) => {
  const environmentVariable = process.env[environmentVariableName];
  if (!environmentVariable) return "";
  return environmentVariable;
};

export const environment: Environment = {
  apiPort: getEnvironmentVariable("API_PORT"),
  databaseName: getEnvironmentVariable("MYSQL_DATABASE_NAME"),
  host: getEnvironmentVariable("MYSQL_WRITE_DATABASE_HOST"),
  hostReadOnly: getEnvironmentVariable("MYSQL_READ_DATABASE_HOST"),
  password: getEnvironmentVariable("MYSQL_DATABASE_PASSWORD"),
  user: getEnvironmentVariable("MYSQL_DATABASE_USER"),
  databasetimeout: Number(getEnvironmentVariable("MYSQL_DATABASE_TIMEOUT")),
  mysqlPoolMax: Number(getEnvironmentVariable("MYSQL_POOL_MAX")),
  mysqlPoolMin: Number(getEnvironmentVariable("MYSQL_POOL_MIN")),
  logLevel: getEnvironmentVariable("LOG_LEVEL"),
  debug: getEnvironmentVariable("DEBUG")
};

export const getValue = (key: keyof Environment): any => {
  return environment[key];
};
