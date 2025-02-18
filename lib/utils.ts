import { useGetInventoryIncomeByProductId } from "@/features/inventories/api/use-get-inventories";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function CalculateCost({
  productId,
  quantity,
  dashboardId,
  method,
}: {
  productId?: string;
  quantity: number;
  dashboardId: string;
  method?: "FIFO" | "LIFO" | "CUMP" | "HPP" | "LPP" | "MANUAL";
}) {

  const { ascInventoryIncome, descInventoryIncome, ascInventoryOutcome } = useGetInventoryIncomeByProductId(
    dashboardId,
    productId
  );

  if (!productId) {
    return { totalCost: 0, error: "Select a product" };
  }

  if (!ascInventoryIncome?.length) {
    return { totalCost: 0, error: "No stock available" };
  }

  switch (method) {
    case "FIFO": {
      const totalOutcomeQty =
        ascInventoryOutcome?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;
      const incomeBatches = ascInventoryIncome.map((batch) => ({ ...batch }));

      let outcomeRemaining = totalOutcomeQty;
      for (const batch of incomeBatches) {
        if (outcomeRemaining <= 0) break;
        if (batch.quantity <= outcomeRemaining) {
          outcomeRemaining -= batch.quantity;
          batch.quantity = 0;
        } else {
          batch.quantity -= outcomeRemaining;
          outcomeRemaining = 0;
        }
      }

      let remainingQty = quantity;
      let totalCost = 0;
      for (const batch of incomeBatches) {
        if (remainingQty <= 0) break;
        const deductedQty = Math.min(batch.quantity, remainingQty);
        totalCost += deductedQty * batch.costPrice;
        remainingQty -= deductedQty;
      }

      if (remainingQty > 0) {
        return { totalCost, error: "Insufficient stock" };
      }

      return { totalCost };
    }

    case "LIFO": {
      if (!descInventoryIncome?.length) {
        return { totalCost: 0, error: "No stock available" };
      }
      const totalOutcomeQty = ascInventoryOutcome.reduce(
        (sum, batch) => sum + batch.quantity,
        0
      );
      const incomeBatches = descInventoryIncome.map((batch) => ({ ...batch }));

      let outcomeRemaining = totalOutcomeQty;
      for (const batch of incomeBatches) {
        if (outcomeRemaining <= 0) break;
        if (batch.quantity <= outcomeRemaining) {
          outcomeRemaining -= batch.quantity;
          batch.quantity = 0;
        } else {
          batch.quantity -= outcomeRemaining;
          outcomeRemaining = 0;
        }
      }

      let remainingQty = quantity;
      let totalCost = 0;
      for (const batch of incomeBatches) {
        if (remainingQty <= 0) break;
        const deductedQty = Math.min(batch.quantity, remainingQty);
        totalCost += deductedQty * batch.costPrice;
        remainingQty -= deductedQty;
      }

      if (remainingQty > 0) {
        return { totalCost, error: "Insufficient stock" };
      }

      return { totalCost };
    }

    case "CUMP": {
      const totalIncomeQty = ascInventoryIncome.reduce(
        (sum, batch) => sum + batch.quantity,
        0
      );
      const totalCostFromIncomes = ascInventoryIncome.reduce(
        (sum, batch) => sum + batch.quantity * batch.costPrice,
        0
      );
      const totalOutcomeQty = ascInventoryOutcome.reduce(
        (sum, batch) => sum + batch.quantity,
        0
      );

      const availableQty = totalIncomeQty - totalOutcomeQty;
      if (availableQty < quantity) {
        return { totalCost: 0, error: "Insufficient stock" };
      }

      const weightedAverageCost = totalCostFromIncomes / totalIncomeQty;
      const totalCost = quantity * weightedAverageCost;
      return { totalCost };
    }

    case "HPP": {
      const totalIncomeQty = ascInventoryIncome.reduce(
        (sum, batch) => sum + batch.quantity,
        0
      );
      const totalOutcomeQty = ascInventoryOutcome.reduce(
        (sum, batch) => sum + batch.quantity,
        0
      );
      const availableQty = totalIncomeQty - totalOutcomeQty;
      if (availableQty < quantity) {
        return { totalCost: 0, error: "Insufficient stock" };
      }

      const highestCost = Math.max(...ascInventoryIncome.map((batch) => batch.costPrice));
      const totalCost = quantity * highestCost;
      return { totalCost };
    }

    case "LPP": {
      const totalIncomeQty = ascInventoryIncome.reduce(
        (sum, batch) => sum + batch.quantity,
        0
      );
      const totalOutcomeQty = ascInventoryOutcome.reduce(
        (sum, batch) => sum + batch.quantity,
        0
      );
      const availableQty = totalIncomeQty - totalOutcomeQty;
      if (availableQty < quantity) {
        return { totalCost: 0, error: "Insufficient stock" };
      }

      const lowestCost = Math.min(...ascInventoryIncome.map((batch) => batch.costPrice));
      const totalCost = quantity * lowestCost;
      return { totalCost };
    }

    case "MANUAL": {
      const totalIncomeQty = ascInventoryIncome.reduce(
        (sum, batch) => sum + batch.quantity,
        0
      );
      const totalOutcomeQty = ascInventoryOutcome.reduce(
        (sum, batch) => sum + batch.quantity,
        0
      );
      const availableQty = totalIncomeQty - totalOutcomeQty;

      if (availableQty < quantity) {
        return { totalCost: 0, error: "Insufficient stock" };
      }

      return { totalCost: 0 };
    }

    default:
      return { totalCost: 0, error: "Unknown calculation method" };
  }
}