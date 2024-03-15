export const typeDefs = `#graphql
  type Order {
    order_id: String!
    product_id: String!
    currency: String!
    quantity: Int!
    shipping_cost: Int!
    amount: Float!
    channel: String!
    channel_group: String!
    campaign: String!
    date_time: String!
  }

  type Product {
    product_id: String!
    name: String!
    quantity: Int!
    category: String!
    sub_category: String!
    orders: [Order]
  }

  input InventoryFilterArgs {
    sub_category: String
    category: String
    in_stock: Boolean
  }

  enum ProductSortField {
    QUANTITY
    ORDER_COUNT
  }

  enum SortDirection {
    ASC
    DESC
  }

  input InventorySortArgs {
    field: ProductSortField!
    direction: SortDirection!
  }

  type Query {
    listInventory(offset: Int, limit: Int, filters: InventoryFilterArgs, sort: InventorySortArgs): [Product]
  }

  type Mutation {
    updateInventory(product_id: String!, quantity: Int!, name: String, category: String, sub_category: String): Product
  }  
`;

export type InventoryFilterArgs = {
  sub_category?: string;
  category?: string;
  in_stock?: boolean;
};

export type InventorySortArgs = {
  field?: "QUANTITY" | "ORDER_COUNT" | null;
  direction?: "ASC" | "DESC";
};

export type ListInventoryArgs = {
  offset?: number;
  limit?: number;
  filters?: InventoryFilterArgs;
  sort?: InventorySortArgs;
};

export type UpdateInventoryArgs = {
  product_id: string;
  quantity: number;
  name?: string;
  category?: string;
  sub_category?: string;
};
