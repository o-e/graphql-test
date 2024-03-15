import SQL from "sql-template-strings";
import { InventorySortArgs, ListInventoryArgs } from "../schemas";
import { query } from "../services/db";

function getSortField(field: InventorySortArgs["field"]) {
  switch (field) {
    case "QUANTITY":
      return "p.quantity";
    case "ORDER_COUNT":
      return "count(o.product_id)";
    default:
      return "p.product_id";
  }
}

export async function listInventory(
  _: any,
  { offset = 0, limit = 10, filters = {}, sort = {} }: ListInventoryArgs
) {
  const result = await query(
    SQL`
    SELECT      p.*, 
                COALESCE(jsonb_agg(o.*) FILTER (WHERE o.product_id IS NOT NULL), '[]') AS orders

    FROM        main.product p

    LEFT JOIN   main.order o 
    ON          p.product_id = o.product_id

    WHERE       (p.category = ${filters.category}::TEXT OR ${filters.category}::TEXT IS NULL)
                AND (p.sub_category = ${filters.sub_category}::TEXT OR ${filters.sub_category}::TEXT IS NULL)
                AND (
                  ${filters.in_stock}::BOOLEAN IS NULL
                  OR (p.quantity > 0 AND ${filters.in_stock}::BOOLEAN = true)
                  OR (p.quantity = 0 AND ${filters.in_stock}::BOOLEAN = false)
                )
    
    GROUP BY    p.product_id 
    
    ORDER BY    `
      .append(getSortField(sort.field))
      .append(sort.direction || "ASC").append(SQL`
  
    LIMIT       ${limit} 
    
    OFFSET      ${offset}`)
  );

  return result.rows;
}
