import { calculatePrice, extras, type ExtraSelection } from "@workspace/service-catalog";
import type { QuotePricing } from "@workspace/db";

/** Never trust totals from the browser. Persist the price at request time. */
export function buildQuotePricing(
  serviceId: string,
  carType: string,
  selections: ExtraSelection[] = [],
): QuotePricing {
  const totals = calculatePrice(serviceId, carType, selections);
  return {
    ...totals,
    extras: selections.map((selection) => {
      const extra = extras.find((item) => item.id === selection.id)!;
      const variant = extra.variants.find((item) => item.id === selection.variantId)!;
      return {
        ...selection,
        name: { ...extra.name },
        variantLabel: { ...variant.label },
        price: variant.price,
      };
    }),
  };
}
