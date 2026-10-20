import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export type QuotePricing = {
  packagePrice: number;
  extrasPrice: number;
  total: number;
  variablePrice: boolean;
  extras: {
    id: string;
    variantId: string;
    name: Record<"de" | "en" | "fr", string>;
    variantLabel: Record<"de" | "en" | "fr", string>;
    price: number;
  }[];
};

export const quotesTable = pgTable("quotes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  canton: text("canton").notNull(),
  serviceType: text("service_type").notNull(),
  carType: text("car_type").notNull(),
  message: text("message"),
  pricing: jsonb("pricing").$type<QuotePricing>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuoteSchema = createInsertSchema(quotesTable).omit({ id: true, createdAt: true });
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotesTable.$inferSelect;
