import { Pool, PoolClient, QueryConfig } from "pg";

const pool = new Pool({
  user: process.env.POSTGRES_USERNAME,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT as string),
});

let client: PoolClient;

export async function init() {
  client = await pool.connect();
}

export async function close() {
  if (client) {
    await client.release();
  }

  if (pool) {
    await pool.end();
  }
}

export async function query(text: string | QueryConfig, params?: any[]) {
  return pool.query(text, params);
}
