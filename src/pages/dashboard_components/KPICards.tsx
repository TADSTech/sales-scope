import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, ShoppingCart, Percent, MapPin } from "lucide-react";
import { SaleFeatures } from "../../utils/utils.ts";
import { getKpis, salesByRegion } from "../../utils/metrics.ts";
import "./KPICards.css";

interface KPICardsProps {
  data: SaleFeatures[];
}

export default function KPICards({ data }: KPICardsProps) {
  // Calculate KPIs
  const kpis = getKpis(data);
  const regionSales = salesByRegion(data);
  const topRegion = Object.entries(regionSales).reduce(
    (max, [region, sales]) => (sales > max.sales ? { region, sales } : max),
    { region: "N/A", sales: 0 }
  );
  const avgDiscount = data.length > 0 ? data.reduce((acc, d) => acc + d.discount, 0) / data.length : 0;

  return (
    <div className="kpi-cards-container grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-5 lg:p-8 max-w-7xl mx-auto">
      {/* Total Sales */}
      <Card className="kpi-card sales">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Total Sales
          </CardTitle>
          <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            ${kpis.totalSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </CardContent>
      </Card>

      {/* Total Profit */}
      <Card className="kpi-card profit">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Total Profit
          </CardTitle>
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            ${kpis.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </CardContent>
      </Card>

      {/* Total Orders */}
      <Card className="kpi-card orders">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Total Orders
          </CardTitle>
          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {kpis.totalOrders.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Average Discount */}
      <Card className="kpi-card discount">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Average Discount
          </CardTitle>
          <Percent className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {(avgDiscount * 100).toFixed(1)}%
          </div>
        </CardContent>
      </Card>

      {/* Top Region */}
      <Card className="kpi-card region">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Top Region
          </CardTitle>
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 dark:text-teal-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{topRegion.region}</div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            ${topRegion.sales.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}