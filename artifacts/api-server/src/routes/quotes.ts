import { Router, type IRouter } from "express";
import { db, quotesTable } from "@workspace/db";
import { SubmitQuoteBody } from "@workspace/api-zod";
import { sendQuoteEmails } from "../lib/quote-emails";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.post("/quotes", async (req, res): Promise<void> => {
  const parsed = SubmitQuoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const {
    name,
    email,
    phone,
    canton,
    serviceType,
    carType,
    message,
    language,
  } = parsed.data;

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

  const response = {
    id: quote.id,
    name: quote.name,
    email: quote.email,
    phone: quote.phone,
    canton: quote.canton,
    serviceType: quote.serviceType,
    carType: quote.carType,
    message: quote.message,
    createdAt: quote.createdAt.toISOString(),
  };

  try {
    const deliveryResults = await sendQuoteEmails(quote, language);
    for (const delivery of deliveryResults) {
      if (delivery.result.status === "fulfilled") continue;
      logger.error(
        {
          quoteId: quote.id,
          notification: delivery.recipient,
          errorType:
            delivery.result.reason instanceof Error &&
            delivery.result.reason.name
              ? delivery.result.reason.name
              : "unknown",
        },
        "Quote email notification failed",
      );
    }
  } catch (error) {
    logger.error(
      {
        quoteId: quote.id,
        errorType:
          error instanceof Error && error.name ? error.name : "unknown",
      },
      "Quote saved but email notifications failed",
    );
  }

  res.status(201).json(response);
});

export default router;
