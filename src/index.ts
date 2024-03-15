import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { listInventory } from "./resolvers/listInventory";
import { updateInventory } from "./resolvers/updateInventory";
import { typeDefs } from "./schemas";
import { close } from "./services/db";

const resolvers = {
  Query: {
    listInventory,
  },
  Mutation: {
    updateInventory,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function start() {
  const { url } = await startStandaloneServer(server);
  console.log(`🚀 Server ready at ${url}`);
}

process.on("SIGINT", () => {
  close();
  process.exit();
});

start().catch(console.error);
