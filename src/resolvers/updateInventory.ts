import SQL from "sql-template-strings";
import { UpdateInventoryArgs } from "../schemas";
import { query } from "../services/db";

export async function updateInventory(
  _: any,
  { product_id, quantity, name, category, sub_category }: UpdateInventoryArgs
) {
  await query(
    SQL`UPDATE  main.product

        SET     quantity = ${quantity}, 
                name = COALESCE(${name}, name),
                category = COALESCE(${category}, category),
                sub_category = COALESCE(${sub_category}, sub_category)

        WHERE   product_id = ${product_id}`
  );

  const result = await query(
    SQL`SELECT      p.*, 
                    COALESCE(jsonb_agg(o.*) FILTER (WHERE o.product_id IS NOT NULL), '[]') AS orders
        
        FROM        main.product p

        LEFT JOIN   main.order o 
        
        ON          p.product_id = o.product_id
        
        WHERE       p.product_id = ${product_id}
        
        GROUP BY    p.product_id`
  );

  return result.rows[0];
}
