import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Moon, Sun, Menu, Filter } from "lucide-react";
import "./Nav.css";

interface NavProps {
  children?: React.ReactNode;
}

interface NavItem {
  path: string;
  label: string;
}

export default function Nav({ children }: NavProps) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/reports", label: "Reports" },
  ];

  // Theme management
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleThemeChange);
    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  // Handle body scroll locking when sheet is open
  useEffect(() => {
    const body = document.body;
    if (isMenuOpen) {
      body.classList.add("sheet-open");
    } else {
      body.classList.remove("sheet-open");
    }
    return () => body.classList.remove("sheet-open");
  }, [isMenuOpen]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const resetToSystemPreference = () => {
    localStorage.removeItem("theme");
    setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  };

  const isDashboard = location.pathname === "/dashboard";
  const isActive = (path: string) => location.pathname === path;

  const closeMenu = () => setIsMenuOpen(false);

  // Desktop navigation links
  const DesktopNav = () => (
    <nav className="hidden md:flex space-x-6 md:ml-8 min-w-0" aria-label="Main navigation">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive(item.path)
              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  // Mobile navigation links
  const MobileNav = () => (
    <div className="mobile-nav-list">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`mobile-nav-link ${isActive(item.path) ? "active" : ""}`}
          onClick={closeMenu}
          aria-current={isActive(item.path) ? "page" : undefined}
        >
          <span className="mobile-nav-icon" aria-hidden="true">
            {item.label.charAt(0)}
          </span>
          {item.label}
        </Link>
      ))}
    </div>
  );

  // Theme controls component
  const ThemeControls = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={isMobile ? "theme-section" : "hidden md:flex items-center space-x-3"}>
      {isMobile && (
        <h3 className="theme-title">Theme Preferences</h3>
      )}
      <div className={isMobile ? "theme-controls" : "flex items-center space-x-2"}>
        <div className="theme-switch-container">
          <Sun className="theme-icon text-slate-600 dark:text-slate-400" aria-hidden="true" />
          <Switch
            checked={isDarkMode}
            onCheckedChange={toggleDarkMode}
            className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500"
            aria-label="Toggle dark mode"
          />
          <Moon className="theme-icon text-slate-600 dark:text-slate-400" aria-hidden="true" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetToSystemPreference}
          className="AutoBtn"
          aria-label="Reset to system theme"
        >
          Auto
        </Button>
      </div>
      {isMobile && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Match your system's appearance
        </p>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between nav-inner">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 nav-logo min-w-0 group"
          onClick={closeMenu}
          aria-label="SalesScope Home"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">
            <span className="highlight group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
              SalesScope
            </span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <DesktopNav />

        {/* Right Controls */}
        <div className="flex items-center space-x-3 min-w-0">
          {/* Desktop Theme Controls */}
          <ThemeControls />

          {/* Mobile Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="md:hidden text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                {isDashboard ? <Filter className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-80 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 flex flex-col p-0"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <h2 className="font-semibold text-lg">
                  {isDashboard ? "Dashboard Controls" : "Navigation"}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                {/* Navigation Section */}
                <div>
                  <h3 className="mobile-nav-title">Pages</h3>
                  <MobileNav />
                </div>

                {/* Filters Section (Dashboard only) */}
                {isDashboard && children && (
                  <div>
                    <h3 className="mobile-nav-title">Dashboard Filters</h3>
                    <div className="space-y-3">{children}</div>
                  </div>
                )}

                {/* Theme Controls */}
                <ThemeControls isMobile={true} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}