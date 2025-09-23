import { Sale, SaleFeatures, enrichSale } from "./utils";

// Cache sales data in memory so multiple calls don't refetch
let cachedData: SaleFeatures[] | null = null;

export async function loadSalesData(forceRefresh = false): Promise<SaleFeatures[]> {
  if (cachedData && !forceRefresh) {
    return cachedData;
  }

  try {
    const res = await fetch("/sales.json", {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache" // ensure updated in dev
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to load sales data: ${res.status} ${res.statusText}`);
    }

    // Stream + parse
    const rawData: Sale[] = await res.json();

    // Map → enrich → cache
    cachedData = rawData.map(enrichSale);

    return cachedData;
  } catch (err) {
    console.error("❌ Error loading sales data:", err);
    throw err; // propagate so caller can handle gracefully
  }
}
