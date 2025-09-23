import { useState, useEffect } from "react";
import { loadSalesData } from "../utils/dataLoader";
import { SaleFeatures } from "../utils/utils";
import Nav from "./dashboard_components/Nav";
import KPICards from "./dashboard_components/KPICards";
import ChartsAndGraphs from "./dashboard_components/ChartsAndGraphs";
import DataTable from "./dashboard_components/DataTable";
import SidebarFilters from "./dashboard_components/SidebarFilters";
import Footer from "./dashboard_components/Footer";

export default function Dashboard() {
  const [data, setData] = useState<SaleFeatures[]>([]);
  const [filteredData, setFilteredData] = useState<SaleFeatures[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSalesData()
      .then((loadedData) => {
        setData(loadedData);
        setFilteredData(loadedData); // Initialize filtered data with full dataset
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Pass filters as children to Nav for mobile */}
      <Nav>
        <SidebarFilters 
          data={data} 
          setFilteredData={setFilteredData} 
          isMobile={true}
        />
      </Nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <SidebarFilters 
              data={data} 
              setFilteredData={setFilteredData} 
              isMobile={false}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Sales Dashboard
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Analyze your sales performance with interactive charts and filters
              </p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-slate-600 dark:text-slate-400 mt-4">Loading sales data...</p>
                </div>
              </div>
            ) : (
              <>
                <KPICards data={filteredData} />
                <ChartsAndGraphs data={filteredData} />
                <DataTable data={filteredData} />
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}