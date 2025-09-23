# 📊 SalesScope

SalesScope is a lightweight **sales analytics platform** that showcases how businesses can track, explore, and visualize sales performance.  
It combines a **Python backend** (for generating and cleaning realistic sales datasets) with a **React + TypeScript frontend** (for dashboards, KPIs, and interactive charts).

---

## 🚀 Features
- **Data Simulation**: Generate realistic sales data with products, customers, discounts, and shipping.
- **Interactive Dashboard**: Visualize KPIs, sales trends, top products/customers, and more.
- **Modern Frontend**: Built with React, TypeScript, TailwindCSS, and shadcn/ui for clean, scalable UI.
- **Modular Backend**: Python scripts for dataset generation, exports, and notebooks for analysis.
- **Scalable Design**: Architecture designed to plug into a real database or API later.

---

## 📂 Project Structure

```

.
├── backend/               # Python backend for data generation and analysis
│   ├── data/              # Raw and cleaned datasets
│   ├── exports/           # Generated CSV/JSON exports
│   └── notebooks/         # Jupyter notebooks for exploration
│
├── node\_modules/          # Frontend dependencies (auto-generated)
├── public/                # Static assets (served as-is)
├── src/                   # Frontend source code
│   ├── components/        # Reusable React components
│   ├── pages/             # Page-level views (Home, Dashboard, etc.)
│   ├── utils/             # Data helpers, metrics, loaders
│   └── index.tsx          # App entry point
│
├── dist/                  # Production build output
├── venv/                  # Python virtual environment
└── README.md              # Project documentation

````

---

## 🛠️ Tech Stack

**Frontend**
- React + TypeScript
- TailwindCSS + shadcn/ui
- Recharts (for charts/visuals)

**Backend**
- Python 3.10+
- Pandas, NumPy, Faker (data generation/cleaning)
- Jupyter Notebooks (analysis)

---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/TADSTech/sales-scope.git
cd salesscope
````

### 2. Backend Setup (Python)

```bash
cd backend
python -m venv venv
source venv\scripts\activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Generate a fresh dataset:

```bash
python generate_data.py
```

This will output CSV/JSON files into `backend/exports/`.

### 3. Frontend Setup (React)

```bash
cd ..
npm install
npm run dev
```

Frontend will be live at **[http://localhost:5173](http://localhost:5173)** (if using Vite).

### 4. Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

---

## 📈 Roadmap

* [ ] Expand dataset with more regions, product categories, and seasonal effects.
* [ ] Add authentication and user-level dashboards.
* [ ] Connect to a real database (PostgreSQL or Supabase).
* [ ] Deploy frontend + backend to production (Vercel + Render/Heroku).
* [ ] Export dashboards as PDF/Excel.

---

## 🤝 Contributing

Contributions are welcome!
Open an issue or submit a pull request to discuss improvements.

---

## 📜 License

MIT License.
Feel free to fork, modify, and use for learning or production.

---

## 👤 Author

Built by Michael — Math & Tech Enthusiast, University of Lagos.
Passionate about **data science, actuarial models, and full-stack apps**.