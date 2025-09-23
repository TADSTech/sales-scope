import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Nav from "./dashboard_components/Nav";
import Footer from "./dashboard_components/Footer";
import "./Home.css";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Nav />
      
      {/* Hero Section */}
      <header className="relative flex flex-col items-center justify-center min-h-[60vh] px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-100 dark:from-slate-800 to-transparent">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="title text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Unlock Insights with <span className="highlight">SalesScope</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            SalesScope empowers you to analyze sales performance with intuitive dashboards and detailed reports. Track revenue, profit, customer trends, and more in one seamless platform.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="cta-button bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600">
              <Link to="/dashboard">Explore Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="cta-button border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
              <Link to="/reports">View Reports</Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent"></div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-100 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-slate-100">
            Why Choose SalesScope?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="feature-card bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Key Metrics at a Glance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Monitor total sales, profit, orders, and discounts with concise, visually appealing KPI cards tailored for quick insights.
                </p>
              </CardContent>
            </Card>
            <Card className="feature-card bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Interactive Visualizations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Explore trends with dynamic charts, including sales over time, category breakdowns, and regional performance, all with drill-down capabilities.
                </p>
              </CardContent>
            </Card>
            <Card className="feature-card bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Detailed Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Access narrative insights on performance, discounts, and regional trends, with actionable recommendations to optimize your strategy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Insights Preview Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-slate-100">
            Actionable Insights
          </h2>
          <Card className="insight-card bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Sample Insight: Discount Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                High discounts can drive sales but may erode profit margins. SalesScope’s reports analyze discount impacts, highlighting orders with negative profits to help you refine pricing strategies. Visit the Reports page to uncover tailored recommendations for your data.
              </p>
              <Button asChild variant="link" className="mt-4 text-blue-600 dark:text-blue-500 p-0">
                <Link to="/reports">Explore Reports</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-100 dark:bg-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-900 dark:text-slate-100">Start Exploring Today</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Dive into your sales data with SalesScope’s intuitive dashboard and in-depth reports. Uncover trends, optimize performance, and make data-driven decisions.
          </p>
          <Button asChild size="lg" className="cta-button bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600">
            <Link to="/dashboard">Get Started</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}