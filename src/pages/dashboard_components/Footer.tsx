import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Powered by SalesScope | Built with React, TypeScript, Tailwind wth Shadcn UI | &copy; 2025
        </p>
      </div>
    </footer>
  );
}