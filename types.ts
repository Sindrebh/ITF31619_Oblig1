import { z } from "zod";

export const PortfolioSchema = z.object({
    id: z.string(),
    title: z.string(),
    body: z.string(),
    url: z.string().url(),
    createdAt: z.coerce.date(),
});

export const PortfolioCreateSchema = PortfolioSchema.pick({id: true, title: true, body: true, url: true});

export const PortfolioArraySchema = z.array(PortfolioSchema);

export type Portfolio = z.infer<typeof PortfolioSchema>;

export type CreatePortfolio = z.infer<typeof PortfolioCreateSchema>;