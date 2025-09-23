import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { SaleFeatures, REGIONS, CATEGORIES, PAYMENT_TYPES } from "../../utils/utils";
import "./SidebarFilters.css";

interface SidebarFiltersProps {
  data: SaleFeatures[];
  setFilteredData: (data: SaleFeatures[]) => void;
  isMobile?: boolean; // Add this prop to adjust styling for mobile
}

export default function SidebarFilters({ data, setFilteredData, isMobile = false }: SidebarFiltersProps) {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [region, setRegion] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [paymentType, setPaymentType] = useState<string>("all");

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

    // Category Filter
    if (category !== "all") {
      filtered = filtered.filter((d) => d.category === category);
    }

    // Payment Type Filter
    if (paymentType !== "all") {
      filtered = filtered.filter((d) => d.payment_type === paymentType);
    }

    setFilteredData(filtered);
  };

  const resetFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setRegion("all");
    setCategory("all");
    setPaymentType("all");
    setFilteredData(data);
  };

  // For mobile, render without card wrapper
  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Date Range Picker */}
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Date Range</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from && dateRange.to ? (
                  `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`
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

        {/* Region Filter */}
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Region</label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm">
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

        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Type Filter */}
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Payment Type</label>
          <Select value={paymentType} onValueChange={setPaymentType}>
            <SelectTrigger className="border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm">
              <SelectValue placeholder="Select payment type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <SelectItem value="all">All Payment Types</SelectItem>
              {PAYMENT_TYPES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Apply and Reset Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="default"
            className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 flex-1 text-sm"
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
          <Button
            variant="outline"
            className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm"
            onClick={resetFilters}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // For desktop, render with card wrapper
  return (
    <Card className="sidebar-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ... rest of your desktop filter code remains the same ... */}
        {/* Date Range Picker */}
        <div>
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

        {/* Region Filter */}
        <div>
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

        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Type Filter */}
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Payment Type</label>
          <Select value={paymentType} onValueChange={setPaymentType}>
            <SelectTrigger className="border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
              <SelectValue placeholder="Select payment type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <SelectItem value="all">All Payment Types</SelectItem>
              {PAYMENT_TYPES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Apply and Reset Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="default"
            className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
            onClick={applyFilters}
          >
            Apply Filters
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
  );
}