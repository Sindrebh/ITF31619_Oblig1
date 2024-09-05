import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { serveStatic } from "hono/serve-static";
import {
    PortfolioSchema,
    type CreatePortfolio,
    type PortfolioCreateSchema,
    type Portfolio,
} from "./types";
import fs from "node:fs/promises";

const app = new Hono();

app.use("/*", cors());
//app.use("/static/*", serveStatic({ root: "./" }));


// portfolioData array
const subjects: Portfolio[] = [
  {
    id: crypto.randomUUID(),
    title: "ITF31619 Webapp oblig 1",
    body: "Første obligatoriske oppgave for webapplikasjoner 2024",
    url: "https://github.com/Sindrebh/ITF31619_Oblig1",
    createdAt: new Date("2024-05-09"),
  },
];

app.get("/json", async (c) => {
  try {
    const data = await fs.readFile("./src/data.json", "utf8");
    const dataAsJson = JSON.parse(data);
    return c.json(dataAsJson);
  } catch (error) {
    console.error("Feil ved lesing av data", error);
    return c.json({error: "Feil ved lesing av data"}, {status: 500});
  }
});

app.post("/add", async (c) => {
  // Validerer om dataen vi mottar er en gyldig
  const project = PortfolioSchema.parse(await c.req.json());
  // Sjekker om et prosjekt er gyldig
  if (!project) return c.json({ error: "Invalid subject" }, { status: 400 });
  console.log(project);
  subjects.push(project);

  // Returnerer en liste med alle projects
  return c.json<Portfolio[]>(subjects, { status: 201 });
});

app.get("/", (c) => {
  // Returnerer en liste med alle projects
  return c.json<Portfolio[]>(subjects);
});

const port = 3999;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});