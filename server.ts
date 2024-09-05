import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { ZodError } from "zod";
import {
    PortfolioCreateSchema,
    PortfolioSchema,
    type CreatePortfolio,
    type Portfolio,
} from "./types";
import fs from "node:fs/promises";

const app = new Hono();

app.use("/*", cors());

// portfolioData array
const portfolioData: Portfolio[] = [
  {
    id: crypto.randomUUID(),
    title: "Prosject",
    body: "Eksempelkode",
    url: "https://github.com/example",
    createdAt: new Date("2024-01-01"),
  },
];

app.get("/json", async (c) => {
  const data = await fs.readFile("./static/data.json", "utf8");
  const dataAsJson = JSON.parse(data);
  return c.json(dataAsJson);
});

app.post("/add", async (c) => {
  const newProject = await c.req.json();
  // Validerer at dataen vi mottar er en gyldig
  const project = PortfolioSchema.parse(newProject);
  // Sjekker et prosjekt er gyldig, returnerer en feilmelding
  if (!project) return c.json({ error: "Invalid habit" }, { status: 400 });
  console.log(project);
  portfolioData.push(project);

  // Returnerer en liste med alle projects
  return c.json<Portfolio[]>(portfolioData, { status: 201 });
});

app.get("/", (c) => {
  // Returnerer en liste med alle projects
  return c.json<Portfolio[]>(portfolioData);
});

const port = 3999;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});