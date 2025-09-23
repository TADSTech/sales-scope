import { SaleFeatures } from "./utils";

// -----------------------------
// Generic helpers
// -----------------------------
function sumBy<T>(arr: T[], accessor: (d: T) => number): number {
  return arr.reduce((acc, d) => acc + accessor(d), 0);
}

function groupSum<T>(
  arr: T[],
  keyFn: (d: T) => string,
  valueFn: (d: T) => number
): Record<string, number> {
  return arr.reduce((acc, d) => {
    const key = keyFn(d);
    acc[key] = (acc[key] || 0) + valueFn(d);
    return acc;
  }, {} as Record<string, number>);
}

// -----------------------------
// High-level KPIs
// -----------------------------
export function getKpis(data: SaleFeatures[]) {
  const totalSales = sumBy(data, d => d.sales);
  const totalProfit = sumBy(data, d => d.profit);
  const totalOrders = new Set(data.map(d => d.order_id)).size;
  const totalShippingCost = sumBy(data, d => d.shipping_cost);

  return {
    totalSales,
    totalProfit,
    avgOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
    profitMargin: totalSales > 1e-6 ? totalProfit / totalSales : 0,
    totalOrders,
    totalRecords: data.length,
    totalShippingCost,
    avgShippingCost: data.length > 0 ? totalShippingCost / data.length : 0,
  };
}

// -----------------------------
// Aggregations
// -----------------------------
export const salesByCategory = (data: SaleFeatures[]) =>
  groupSum(data, d => d.category, d => d.sales);

export const salesByRegion = (data: SaleFeatures[]) =>
  groupSum(data, d => d.region, d => d.sales);

export const salesByMonth = (data: SaleFeatures[]) =>
  groupSum(data, d => d.order_month, d => d.sales);

export const salesByPaymentType = (data: SaleFeatures[]) =>
  groupSum(data, d => d.payment_type, d => d.sales);

export const salesByShippingDuration = (data: SaleFeatures[]) =>
  groupSum(data, d => String(d.shipping_duration), d => d.sales);

export const shippingCostByCategory = (data: SaleFeatures[]) =>
  groupSum(data, d => d.category, d => d.shipping_cost);

// -----------------------------
// Rankings
// -----------------------------
export function topProducts(data: SaleFeatures[], n = 5) {
  const productMap = groupSum(data, d => d.product_name, d => d.sales);

  return Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([product, sales]) => ({ product, sales }));
}

export function topCustomers(data: SaleFeatures[], n = 5) {
  const customerMap = groupSum(data, d => d.customer_name, d => d.sales);

  return Object.entries(customerMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([customer, sales]) => ({ customer, sales }));
}

// -----------------------------
// Misc metrics
// -----------------------------
export function averageDiscount(data: SaleFeatures[]): number {
  return data.length > 0 ? sumBy(data, d => d.discount) / data.length : 0;
}

export function averageShippingDuration(data: SaleFeatures[]): number {
  return data.length > 0 ? sumBy(data, d => d.shipping_duration) / data.length : 0;
}