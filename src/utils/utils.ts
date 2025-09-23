// -----------------------------
// 1. Interfaces
// -----------------------------
export interface Sale {
  order_id: string;
  order_date: string;   // ISO string
  ship_date: string;
  customer_id: string;
  customer_name: string;
  customer_segment: typeof CUSTOMER_SEGMENTS[number];
  product_id: string;
  product_name: string;
  category: typeof CATEGORIES[number];
  subcategory: string;
  quantity: number;
  sales: number;
  discount: number;     // 0–0.4
  profit: number;
  region: typeof REGIONS[number];
  city: string;
  state: string;
  shipping_cost: number;
  payment_type: typeof PAYMENT_TYPES[number];
}

// Engineered features (pre-computed for charts)
export interface SaleFeatures extends Sale {
  order_month: string;     // YYYY-MM
  profit_margin: number;   // profit / sales
  order_year: number;
  order_quarter: string;   // YYYY-Qn
  shipping_duration: number; // Days between order and ship date
}

// -----------------------------
// 2. Constants
// -----------------------------
export const REGIONS = ["West", "East", "Midwest", "South", "Mountain"] as const;
export const CUSTOMER_SEGMENTS = ["Consumer", "Corporate", "Small Business", "Enterprise", "Retailer", "Online-Only"] as const;
export const PAYMENT_TYPES = ["Credit", "Cash", "Transfer", "Debit", "PayPal", "Mobile Pay", "BNPL"] as const;
export const CATEGORIES = ["Furniture", "Office Supplies", "Technology", "Apparel", "Home & Kitchen", "Health & Beauty"] as const;

// -----------------------------
// 3. Helper functions
// -----------------------------
// Parse raw record -> engineered record
export function enrichSale(sale: Sale): SaleFeatures {
  const orderDate = new Date(sale.order_date);
  const shipDate = new Date(sale.ship_date);
  const year = orderDate.getFullYear();
  const monthNum = orderDate.getMonth() + 1;
  const month = `${year}-${String(monthNum).padStart(2, "0")}`;
  const quarter = `Q${Math.floor((monthNum - 1) / 3) + 1}`;
  const shippingDuration = Math.round((shipDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

  return {
    ...sale,
    order_month: month,
    profit_margin: sale.sales > 1e-6 ? sale.profit / sale.sales : 0,
    order_year: year,
    order_quarter: `${year}-${quarter}`,
    shipping_duration: shippingDuration,
  };
}

// ---------- Generic reducers ----------
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

// ---------- Specific metrics ----------
export const getTotalSales = (data: Sale[]) => sumBy(data, d => d.sales);
export const getTotalProfit = (data: Sale[]) => sumBy(data, d => d.profit);

export function getAverageOrderValue(data: Sale[]): number {
  const uniqueOrders = new Set(data.map(d => d.order_id)).size;
  return uniqueOrders > 0 ? getTotalSales(data) / uniqueOrders : 0;
}

// Groupings (all return { key: sum })
export const groupByCategory = (data: Sale[]) =>
  groupSum(data, d => d.category, d => d.sales);

export const groupByRegion = (data: Sale[]) =>
  groupSum(data, d => d.region, d => d.sales);

export const groupSalesByMonth = (data: Sale[]) =>
  groupSum(data, d => {
    const date = new Date(d.order_date);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }, d => d.sales);

export const groupByPaymentType = (data: Sale[]) =>
  groupSum(data, d => d.payment_type, d => d.sales);

export const groupByShippingDuration = (data: SaleFeatures[]) =>
  groupSum(data, d => String(d.shipping_duration), d => d.sales);

export const groupShippingCostByCategory = (data: Sale[]) =>
  groupSum(data, d => d.category, d => d.shipping_cost);