import csv from "csv-parser";
import { createReadStream } from "fs";
import { resolve } from "path";
import { close, init, query } from "../src/services/db";

async function loadFile(path: string): Promise<Record<string, any>[]> {
  return new Promise((resolve, reject) => {
    const results: Record<string, any>[] = [];

    createReadStream(path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results));
  });
}

async function start() {
  try {
    await init();

    await query("DROP TABLE main.order");
    await query("DROP TABLE main.product");

    await query(`CREATE TABLE IF NOT EXISTS main.product (
      product_id TEXT PRIMARY KEY, 
      name TEXT,
      quantity INTEGER,
      category TEXT,
      sub_category TEXT)`);

    await query(`CREATE TABLE IF NOT EXISTS main.order (
      order_id TEXT, 
      product_id TEXT REFERENCES main.product(product_id),
      currency TEXT,
      quantity INTEGER,
      shipping_cost DECIMAL,
      amount DECIMAL,
      channel TEXT,
      channel_group TEXT,
      campaign TEXT,
      date_time TIMESTAMPTZ(3))`);

    const products = await loadFile(resolve("./data/inventory.csv"));

    await Promise.all(
      products.map((product) => {
        const sql = `INSERT INTO main.product (product_id, name, quantity, category, sub_category)
      VALUES ($1, $2, $3, $4, $5)`;
        return query(sql, Object.values(product));
      })
    );

    const orders = await loadFile(resolve("./data/orders.csv"));

    await Promise.all(
      orders.map((order) => {
        const sql = `INSERT INTO main.order (order_id, product_id, currency, quantity, shipping_cost, amount, channel, channel_group, campaign, date_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
        return query(sql, Object.values(order));
      })
    );
  } catch (err) {
    console.error(`Error running the script: ${err}`);
  } finally {
    close();
  }
}

start().catch(console.error);
