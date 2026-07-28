import { Router, type IRouter } from "express";
import { db, quotesTable } from "@workspace/db";
import { SubmitQuoteBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/quotes", async (req, res): Promise<void> => {
  const parsed = SubmitQuoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, email, phone, canton, serviceType, carType, message } = parsed.data;

  const [quote] = await db
    .insert(quotesTable)
    .values({
      name,
      email,
      phone,
      canton,
      serviceType,
      carType,
      message: message ?? null,
    })
    .returning();

  res.status(201).json({
    id: quote.id,
    name: quote.name,
    email: quote.email,
    phone: quote.phone,
    canton: quote.canton,
    serviceType: quote.serviceType,
    carType: quote.carType,
    message: quote.message,
    createdAt: quote.createdAt.toISOString(),
  });
});

export default router;
