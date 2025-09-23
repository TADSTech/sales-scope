import { useState, useCallback, useRef } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts"
import html2canvas from "html2canvas-pro"
import FileSaver from "file-saver"
import {
  salesByMonth,
  salesByCategory,
  salesByRegion,
  salesByPaymentType,
  shippingCostByCategory,
} from "../../utils/metrics"
import { SaleFeatures, REGIONS, CUSTOMER_SEGMENTS, PAYMENT_TYPES } from "../../utils/utils"
import type { PieLabelRenderProps } from "recharts"

interface ChartsAndGraphsProps {
  data: SaleFeatures[]
}

export default function ChartsAndGraphs({ data }: ChartsAndGraphsProps) {
  const [salesTrendType, setSalesTrendType] = useState<"sales" | "profit">("sales")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // === A. Sales Trends ===
  const monthlySales = salesByMonth(data)
  const monthlyProfit = data.reduce((acc, d) => {
    acc[d.order_month] = (acc[d.order_month] || 0) + d.profit
    return acc
  }, {} as Record<string, number>)

  const trendData = Object.keys(monthlySales)
    .sort()
    .map((month) => ({
      month,
      sales: monthlySales[month] || 0,
      profit: monthlyProfit[month] || 0,
    }))

  const trendConfig = {
    sales: { label: "Sales", color: "#2563eb" }, // Blue
    profit: { label: "Profit", color: "#10b981" }, // Green
  } satisfies ChartConfig

  const trendRef = useRef<HTMLDivElement>(null)
  const [isTrendLoading, setIsTrendLoading] = useState(false)

  const handleTrendDownload = useCallback(async () => {
    if (trendRef.current) {
      setIsTrendLoading(true)
      try {
        const canvas = await html2canvas(trendRef.current)
        canvas.toBlob((blob) => {
          if (blob) {
            FileSaver.saveAs(blob, 'sales-trends.png')
          }
        })
      } finally {
        setIsTrendLoading(false)
      }
    }
  }, [])

  // === B. Category Breakdown ===
  const categorySales = salesByCategory(data)
  const subcategorySales = selectedCategory
    ? data
        .filter((d) => d.category === selectedCategory)
        .reduce((acc, d) => {
          acc[d.subcategory] = (acc[d.subcategory] || 0) + d.sales
          return acc
        }, {} as Record<string, number>)
    : {}

  const categoryData = Object.entries(categorySales).map(([category, sales]) => ({
    category,
    sales,
  }))
  const subcategoryData = Object.entries(subcategorySales).map(
    ([subcategory, sales]) => ({
      subcategory,
      sales,
    })
  )

  const categoryConfig = {
    sales: { label: "Sales", color: "#f59e0b" }, // Amber
  } satisfies ChartConfig

  const categoryRef = useRef<HTMLDivElement>(null)
  const [isCategoryLoading, setIsCategoryLoading] = useState(false)

  const handleCategoryDownload = useCallback(async () => {
    if (categoryRef.current) {
      setIsCategoryLoading(true)
      try {
        const canvas = await html2canvas(categoryRef.current)
        canvas.toBlob((blob) => {
          if (blob) {
            FileSaver.saveAs(blob, 'category-breakdown.png')
          }
        })
      } finally {
        setIsCategoryLoading(false)
      }
    }
  }, [])

  // === C. Regional Performance ===
  const regionSales = salesByRegion(data)
  const regionData = REGIONS.map((region) => ({
    region,
    sales: regionSales[region] || 0,
  }))

  const regionConfig = {
    sales: { label: "Sales", color: "#8b5cf6" }, // Purple
  } satisfies ChartConfig

  const regionRef = useRef<HTMLDivElement>(null)
  const [isRegionLoading, setIsRegionLoading] = useState(false)

  const handleRegionDownload = useCallback(async () => {
    if (regionRef.current) {
      setIsRegionLoading(true)
      try {
        const canvas = await html2canvas(regionRef.current)
        canvas.toBlob((blob) => {
          if (blob) {
            FileSaver.saveAs(blob, 'regional-performance.png')
          }
        })
      } finally {
        setIsRegionLoading(false)
      }
    }
  }, [])

  // === D. Customer Segments ===
  const segmentSales = CUSTOMER_SEGMENTS.reduce((acc, segment) => {
    acc[segment] = data
      .filter((d) => d.customer_segment === segment)
      .reduce((sum, d) => sum + d.sales, 0)
    return acc
  }, {} as Record<string, number>)

  const palette = ["#ef4444", "#8b5cf6", "#22c55e", "#facc15", "#3b82f6", "#ec4899", "#f97316"] // Red, Purple, Green, Yellow, Blue, Pink, Orange

  const segmentConfig: ChartConfig = {}
  const segmentData = CUSTOMER_SEGMENTS.map((segment, index) => {
    const key = segment.toLowerCase().replace(/\s+/g, "-")
    const color = palette[index % palette.length]
    segmentConfig[key] = { label: segment, color }
    return {
      segment,
      key,
      sales: segmentSales[segment] || 0,
    }
  })

  const segmentRef = useRef<HTMLDivElement>(null)
  const [isSegmentLoading, setIsSegmentLoading] = useState(false)

  const handleSegmentDownload = useCallback(async () => {
    if (segmentRef.current) {
      setIsSegmentLoading(true)
      try {
        const canvas = await html2canvas(segmentRef.current)
        canvas.toBlob((blob) => {
          if (blob) {
            FileSaver.saveAs(blob, 'customer-segments.png')
          }
        })
      } finally {
        setIsSegmentLoading(false)
      }
    }
  }, [])

  // === E. Discounts vs Profitability ===
  const discountProfitData = data.map((d) => ({
    discount: d.discount * 100,
    profit: d.profit,
    sales: d.sales,
  }))

  const discountConfig = {
    profit: { label: "Profit", color: "#ec4899" }, // Pink
  } satisfies ChartConfig

  const discountRef = useRef<HTMLDivElement>(null)
  const [isDiscountLoading, setIsDiscountLoading] = useState(false)

  const handleDiscountDownload = useCallback(async () => {
    if (discountRef.current) {
      setIsDiscountLoading(true)
      try {
        const canvas = await html2canvas(discountRef.current)
        canvas.toBlob((blob) => {
          if (blob) {
            FileSaver.saveAs(blob, 'discounts-vs-profitability.png')
          }
        })
      } finally {
        setIsDiscountLoading(false)
      }
    }
  }, [])

  // === F. Payment Type Distribution ===
  const paymentSales = salesByPaymentType(data)
  const paymentConfig: ChartConfig = {}
  const paymentData = PAYMENT_TYPES.map((payment, index) => {
    const key = payment.toLowerCase().replace(/\s+/g, "-")
    const color = palette[index % palette.length]
    paymentConfig[key] = { label: payment, color }
    return {
      payment,
      key,
      sales: paymentSales[payment] || 0,
    }
  })

  const paymentRef = useRef<HTMLDivElement>(null)
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)

  const handlePaymentDownload = useCallback(async () => {
    if (paymentRef.current) {
      setIsPaymentLoading(true)
      try {
        const canvas = await html2canvas(paymentRef.current)
        canvas.toBlob((blob) => {
          if (blob) {
            FileSaver.saveAs(blob, 'payment-type-distribution.png')
          }
        })
      } finally {
        setIsPaymentLoading(false)
      }
    }
  }, [])

  // === G. Shipping Cost vs Sales ===
  const shippingCostSalesData = data.map((d) => ({
    shipping_cost: d.shipping_cost,
    sales: d.sales,
    category: d.category,
  }))

  const shippingConfig = {
    sales: { label: "Sales", color: "#3b82f6" }, // Blue
  } satisfies ChartConfig

  const shippingRef = useRef<HTMLDivElement>(null)
  const [isShippingLoading, setIsShippingLoading] = useState(false)

  const handleShippingDownload = useCallback(async () => {
    if (shippingRef.current) {
      setIsShippingLoading(true)
      try {
        const canvas = await html2canvas(shippingRef.current)
        canvas.toBlob((blob) => {
          if (blob) {
            FileSaver.saveAs(blob, 'shipping-cost-vs-sales.png')
          }
        })
      } finally {
        setIsShippingLoading(false)
      }
    }
  }, [])

  // === H. Shipping Costs by Category ===
  const shippingCostCategory = shippingCostByCategory(data)
  const shippingCostCategoryData = Object.entries(shippingCostCategory).map(([category, shipping_cost]) => ({
    category,
    shipping_cost,
  }))

  const shippingCostCategoryConfig = {
    shipping_cost: { label: "Shipping Cost", color: "#f97316" }, // Orange
  } satisfies ChartConfig

  const shippingCostCategoryRef = useRef<HTMLDivElement>(null)
  const [isShippingCostCategoryLoading, setIsShippingCostCategoryLoading] = useState(false)

  const handleShippingCostCategoryDownload = useCallback(async () => {
    if (shippingCostCategoryRef.current) {
      setIsShippingCostCategoryLoading(true)
      try {
        const canvas = await html2canvas(shippingCostCategoryRef.current)
        canvas.toBlob((blob) => {
          if (blob) {
            FileSaver.saveAs(blob, 'shipping-costs-by-category.png')
          }
        })
      } finally {
        setIsShippingCostCategoryLoading(false)
      }
    }
  }, [])

  return (
    <div className="grid grid-cols-1 gap-8">
      {/* A. Sales Trends */}
      <Card className="chart-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Sales Trends
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              Monthly {salesTrendType} overview
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={salesTrendType === "sales" ? "default" : "outline"}
              onClick={() =>
                setSalesTrendType(salesTrendType === "sales" ? "profit" : "sales")
              }
              className="chart-toggle"
            >
              Toggle to {salesTrendType === "sales" ? "Profit" : "Sales"}
            </Button>
            <Button
              variant="outline"
              onClick={handleTrendDownload}
              disabled={isTrendLoading}
              className="chart-toggle"
            >
              {isTrendLoading ? 'Downloading...' : 'Download'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer ref={trendRef} config={trendConfig} className="chart-container min-h-[400px] w-full">
            <AreaChart data={trendData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis tickLine={false} tickMargin={10} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey={salesTrendType}
                type="monotone"
                stroke={salesTrendType === "sales" ? "#2563eb" : "#10b981"}
                fill={salesTrendType === "sales" ? "#60a5fa" : "#34d399"}
                fillOpacity={0.5}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* B. Category Breakdown */}
      <Card className="chart-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Category Breakdown
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              Sales by {selectedCategory ? 'subcategory' : 'category'} - Click bars to drill down
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {selectedCategory && (
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory(null)}
                className="chart-toggle"
              >
                Back to Categories
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleCategoryDownload}
              disabled={isCategoryLoading}
              className="chart-toggle"
            >
              {isCategoryLoading ? 'Downloading...' : 'Download'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer ref={categoryRef} config={categoryConfig} className="chart-container min-h-[400px] w-full">
            <BarChart data={selectedCategory ? subcategoryData : categoryData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={selectedCategory ? "subcategory" : "category"}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis 
                tickLine={false} 
                tickMargin={10} 
                axisLine={false}
                tickFormatter={(v) => `$${v.toLocaleString()}`} 
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent payload={undefined} />} />
              <Bar
                dataKey="sales"
                fill="#f59e0b"
                radius={8}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-in-out"
                onClick={(data) =>
                  setSelectedCategory(selectedCategory ? null : data.payload.category)
                }
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* C. Regional Performance */}
      <Card className="chart-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Regional Performance
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              Sales distribution across regions
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={handleRegionDownload}
            disabled={isRegionLoading}
            className="chart-toggle"
          >
            {isRegionLoading ? 'Downloading...' : 'Download'}
          </Button>
        </CardHeader>
        <CardContent>
          <ChartContainer ref={regionRef} config={regionConfig} className="chart-container min-h-[400px] w-full">
            <BarChart data={regionData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="region" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis 
                tickLine={false} 
                tickMargin={10} 
                axisLine={false}
                tickFormatter={(v) => `$${v.toLocaleString()}`} 
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent payload={undefined} />} />
              <Bar
                dataKey="sales"
                fill="#8b5cf6"
                radius={8}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* D. Customer Segments */}
      <Card className="chart-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Customer Segments
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              Sales share by customer type
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={handleSegmentDownload}
            disabled={isSegmentLoading}
            className="chart-toggle"
          >
            {isSegmentLoading ? 'Downloading...' : 'Download'}
          </Button>
        </CardHeader>
        <CardContent>
          <ChartContainer ref={segmentRef} config={segmentConfig} className="chart-container min-h-[400px] w-full">
            <PieChart>
              <Pie
                data={segmentData}
                dataKey="sales"
                nameKey="segment"
                outerRadius={150}
                label={(props: PieLabelRenderProps) => {
                  const { name, percent } = props
                  const safePercent = typeof percent === "number" ? percent : 0
                  return `${name ?? ""} (${(safePercent * 100).toFixed(1)}%)`
                }}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-in-out"
              >
                {segmentData.map((entry, index) => (
                  <Cell key={entry.key} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent payload={undefined} />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* E. Discounts vs Profitability */}
      <Card className="chart-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Discounts vs Profitability
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              Relationship between discount rates and profit margins
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={handleDiscountDownload}
            disabled={isDiscountLoading}
            className="chart-toggle"
          >
            {isDiscountLoading ? 'Downloading...' : 'Download'}
          </Button>
        </CardHeader>
        <CardContent>
          <ChartContainer ref={discountRef} config={discountConfig} className="chart-container min-h-[400px] w-full">
            <ScatterChart data={discountProfitData}>
              <CartesianGrid />
              <XAxis
                dataKey="discount"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                dataKey="profit"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(v) => `$${v.toLocaleString()}`}
              />
              <ZAxis dataKey="sales" range={[50, 500]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Scatter
                dataKey="profit"
                fill="#ec4899"
                shape="circle"
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            </ScatterChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* F. Payment Type Distribution */}
      <Card className="chart-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Payment Type Distribution
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              Sales share by payment method
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={handlePaymentDownload}
            disabled={isPaymentLoading}
            className="chart-toggle"
          >
            {isPaymentLoading ? 'Downloading...' : 'Download'}
          </Button>
        </CardHeader>
        <CardContent>
          <ChartContainer ref={paymentRef} config={paymentConfig} className="chart-container min-h-[400px] w-full">
            <PieChart>
              <Pie
                data={paymentData}
                dataKey="sales"
                nameKey="payment"
                outerRadius={150}
                label={(props: PieLabelRenderProps) => {
                  const { name, percent } = props
                  const safePercent = typeof percent === "number" ? percent : 0
                  return `${name ?? ""} (${(safePercent * 100).toFixed(1)}%)`
                }}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-in-out"
              >
                {paymentData.map((entry, index) => (
                  <Cell key={entry.key} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent payload={undefined} />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* G. Shipping Cost vs Sales */}
      <Card className="chart-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Shipping Cost vs Sales
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              Relationship between shipping costs and sales amounts
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={handleShippingDownload}
            disabled={isShippingLoading}
            className="chart-toggle"
          >
            {isShippingLoading ? 'Downloading...' : 'Download'}
          </Button>
        </CardHeader>
        <CardContent>
          <ChartContainer ref={shippingRef} config={shippingConfig} className="chart-container min-h-[400px] w-full">
            <ScatterChart data={shippingCostSalesData}>
              <CartesianGrid />
              <XAxis
                dataKey="shipping_cost"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(v) => `$${v.toLocaleString()}`}
              />
              <YAxis
                dataKey="sales"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(v) => `$${v.toLocaleString()}`}
              />
              <ZAxis dataKey="sales" range={[50, 500]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Scatter
                dataKey="sales"
                fill="#3b82f6"
                shape="circle"
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            </ScatterChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* H. Shipping Costs by Category */}
      <Card className="chart-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Shipping Costs by Category
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              Total shipping costs by product category
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={handleShippingCostCategoryDownload}
            disabled={isShippingCostCategoryLoading}
            className="chart-toggle"
          >
            {isShippingCostCategoryLoading ? 'Downloading...' : 'Download'}
          </Button>
        </CardHeader>
        <CardContent>
          <ChartContainer ref={shippingCostCategoryRef} config={shippingCostCategoryConfig} className="chart-container min-h-[400px] w-full">
            <BarChart data={shippingCostCategoryData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis 
                tickLine={false} 
                tickMargin={10} 
                axisLine={false}
                tickFormatter={(v) => `$${v.toLocaleString()}`} 
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent payload={undefined} />} />
              <Bar
                dataKey="shipping_cost"
                fill="#f97316"
                radius={8}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}