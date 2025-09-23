import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { loadSalesData } from "../utils/dataLoader";
import { getKpis, salesByRegion, salesByCategory } from "../utils/metrics";
import { SaleFeatures, REGIONS } from "../utils/utils";
import Nav from "./dashboard_components/Nav";
import Footer from "./dashboard_components/Footer";
import "./Reports.css";

export default function Reports() {
  const [data, setData] = useState<SaleFeatures[]>([]);
  const [filteredData, setFilteredData] = useState<SaleFeatures[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [region, setRegion] = useState<string>("all");

  useEffect(() => {
    loadSalesData()
      .then((loadedData) => {
        setData(loadedData);
        setFilteredData(loadedData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const applyFilters = () => {
    let filtered = [...data];

    // Date Range Filter
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter((d) => {
        const orderDate = new Date(d.order_date);
        return orderDate >= dateRange.from! && orderDate <= dateRange.to!;
      });
    }

    // Region Filter
    if (region !== "all") {
      filtered = filtered.filter((d) => d.region === region);
    }

    setFilteredData(filtered);
  };

  const resetFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setRegion("all");
    setFilteredData(data);
  };

  // Calculate Summary Metrics
  const kpis = getKpis(filteredData);
  const regionSales = salesByRegion(filteredData);
  const topRegion = Object.entries(regionSales).reduce(
    (max, [region, sales]) => (sales > max.sales ? { region, sales } : max),
    { region: "N/A", sales: 0 }
  );
  const categorySales = salesByCategory(filteredData);
  const topCategory = Object.entries(categorySales).reduce(
    (max, [category, sales]) => (sales > max.sales ? { category, sales } : max),
    { category: "N/A", sales: 0 }
  );
  const avgDiscount = filteredData.length > 0
    ? filteredData.reduce((acc, d) => acc + d.discount, 0) / filteredData.length
    : 0;
  const negativeProfitOrders = filteredData.filter((d) => d.profit < 0).length;
  const highDiscountOrders = filteredData.filter((d) => d.discount > 0.3).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <Nav />
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="text-center text-slate-600 dark:text-slate-400">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Nav />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Sales Reports</h2>

        {/* Filters */}
        <Card className="report-filter-card mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Report Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from && dateRange.to ? (
                      `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Region</label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectItem value="all">All Regions</SelectItem>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button
                variant="default"
                className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                onClick={applyFilters}
              >
                Apply
              </Button>
              <Button
                variant="outline"
                className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                onClick={resetFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="report-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                ${kpis.totalSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Total revenue generated from all transactions in the selected period and region.
              </p>
            </CardContent>
          </Card>
          <Card className="report-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Total Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                ${kpis.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Net profit after accounting for costs, reflecting overall profitability.
              </p>
            </CardContent>
          </Card>
          <Card className="report-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top Region</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-teal-600 dark:text-teal-500">{topRegion.region}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {topRegion.region === "N/A"
                  ? "No sales data available."
                  : `Leading region with $${topRegion.sales.toLocaleString(undefined, { maximumFractionDigits: 0 })} in sales.`}
              </p>
            </CardContent>
          </Card>
          <Card className="report-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top Category</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-500">{topCategory.category}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {topCategory.category === "N/A"
                  ? "No sales data available."
                  : `Top-performing category with $${topCategory.sales.toLocaleString(undefined, { maximumFractionDigits: 0 })} in sales.`}
              </p>
            </CardContent>
          </Card>
          <Card className="report-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Average Discount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-500">
                {(avgDiscount * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Average discount applied across all transactions, impacting margins.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Insights Section */}
        <div className="space-y-6">
          <Card className="report-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The selected period shows a total of {kpis.totalOrders.toLocaleString()} orders, generating $
                {kpis.totalSales.toLocaleString(undefined, { maximumFractionDigits: 0 })} in revenue and $
                {kpis.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })} in profit. The profit margin is{" "}
                {kpis.totalSales > 0 ? ((kpis.totalProfit / kpis.totalSales) * 100).toFixed(1) : 0}%. The top-performing
                region, {topRegion.region}, contributes significantly to sales, while {topCategory.category} leads among product
                categories.
              </p>
            </CardContent>
          </Card>
          <Card className="report-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Discount Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Discounts averaging {(avgDiscount * 100).toFixed(1)}% have been applied across transactions. Notably,{" "}
                {highDiscountOrders} orders had discounts exceeding 30%, which may be impacting profitability, as{" "}
                {negativeProfitOrders} orders resulted in negative profit. Consider reviewing discount strategies for high-discount
                orders to optimize margins.
              </p>
            </CardContent>
          </Card>
          <Card className="report-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Regional Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {topRegion.region === "N/A"
                  ? "No regional data available."
                  : `${topRegion.region} leads with $${topRegion.sales.toLocaleString(undefined, { maximumFractionDigits: 0 })} in sales, 
                    indicating strong market performance. Other regions may benefit from targeted marketing to boost sales.`}
              </p>
            </CardContent>
          </Card>
          <Card className="report-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                To improve profitability, focus on reducing high discounts in underperforming categories and regions. Promote top-performing
                products in {topCategory.category} to maintain sales momentum. Consider expanding marketing efforts in underperforming regions
                to balance sales distribution.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}