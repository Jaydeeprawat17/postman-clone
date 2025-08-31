import { defineConfig } from "@mikro-orm/sqlite";
import { RequestHistory } from "./entities/RequestHistory.js";

export default defineConfig({
  dbName: "mydb.sqlite", // file in project root
  entities: [RequestHistory], // <-- point to JS class directly
});
