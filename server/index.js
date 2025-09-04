import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { MikroORM } from "@mikro-orm/sqlite";
import mikroConfig from "./mikro-orm.config.js";
import { RequestHistory } from "./entities/RequestHistory.js";
import "dotenv/config";

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

let orm;

app.post("/api/save-request", async (req, res) => {
  const em = orm.em.fork();
  const history = em.create(RequestHistory, req.body);
  await em.persistAndFlush(history);
  console.log(history);
  res.json({ success: true });
});

app.get("/api/history", async (req, res) => {
  const page = parseInt(req.query.page || "1");
  const limit = 10;

  const em = orm.em.fork();
  const [items, count] = await em.findAndCount(
    RequestHistory,
    {},
    {
      limit,
      offset: (page - 1) * limit,
      orderBy: { timestamp: "DESC" },
    }
  );

  res.json({ items, total: count, page });
});

// DELETE one request
app.delete("/api/history/:id", async (req, res) => {
  const em = orm.em.fork();
  await em.nativeDelete(RequestHistory, { id: req.params.id });
  res.json({ success: true });
});

// DELETE all requests
app.delete("/api/history", async (req, res) => {
  const em = orm.em.fork();
  await em.nativeDelete(RequestHistory, {}); // delete all
  res.json({ success: true });
});

(async () => {
  orm = await MikroORM.init(mikroConfig);
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema(); // creates tables automatically

  app.listen(PORT, () =>
    console.log("Server running on http://localhost:" + PORT)
  );
})();
