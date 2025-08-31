import { EntitySchema } from "@mikro-orm/core";

export const RequestHistory = new EntitySchema({
  name: "RequestHistory",
  tableName: "request_history",
  properties: {
    id: { type: "string", primary: true }, // change from number → string
    method: { type: "string" },
    url: { type: "string" },
    headers: { type: "json", nullable: true },
    body: { type: "json", nullable: true },
    timestamp: { type: "date" }, // keep as date
    response: { type: "json", nullable: true },
  },
});
