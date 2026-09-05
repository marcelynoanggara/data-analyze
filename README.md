# AI Dataset Analyzer

An automated Web-based AI Data Analysis Tool built with FastAPI, React, TypeScript, and Tailwind CSS.

## Features
- **CSV Data Upload & Parsing:** Drag and drop or browse CSV files (up to 25 MB).
- **Sample Dataset Demo:** Bundled sample dataset available for instant try-out.
- **Dataset Overview & Schema:** Column typing, sample values, missing counts, and duplicate detection.
- **Data Quality Alerts:** High/moderate missing value severity warnings, constant value detection, and unique ID detection.
- **Descriptive Statistics:** Automatically generated table (Mean, Std Dev, Min, 25%, Median, 75%, Max) for numerical variables.
- **Automated Visualizations:** Recharts-powered histograms, top category bar charts, and correlation scatter plots.
- **Correlation Analysis:** Pearson r correlation matrix with positive/negative ranking (with explicit anti-causation disclaimers).
- **Outlier Detection:** Interquartile Range (IQR) method outlier counts and percentage calculation.
- **AI Insights Engine:** OpenAI-compatible API integration producing structured executive summaries, findings, recommendations, and conclusions.
- **PDF Report Generator:** Export full analytical report to PDF.

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS v4, Recharts, Lucide Icons
- **Backend:** Python, FastAPI, pandas, numpy, scipy, fpdf2, httpx

## Project Structure
```text
data-analyze/
├── frontend/             # React + Vite + TypeScript UI
│   ├── src/
│   │   ├── components/   # UploadSection & Dashboard components
│   │   ├── types/        # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/           # Static assets & sample dataset
│   └── package.json
├── backend/              # FastAPI Python backend
│   ├── app/
│   │   ├── analysis/     # Engine for stats, correlations, outliers
│   │   └── services/     # AI engine & PDF report generator
│   ├── requirements.txt
│   └── main.py           # FastAPI server entry point
├── sample-data/          # Bundled sample datasets
│   └── sample_sales.csv
├── README.md
└── PRD — AI Dataset Analyzer.md
```

## Setup & Running

### 1. Environment Configuration
Copy `.env.example` to `.env` in the project root or backend directory:
```env
AI_API_KEY=your_openai_api_key
AI_API_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
BACKEND_URL=http://localhost:8000
```

### 2. Backend Dependencies & Startup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### 3. Frontend Dependencies & Startup
```bash
cd frontend
npm install
npm run dev
```

### 4. Production Build
```bash
cd frontend
npm run build
```

## API Endpoints
- `GET /api/health` - Service health status
- `POST /api/analyze` - Parses CSV and computes dataset stats/visualizations
- `POST /api/insights` - Calls LLM (or fallback) to produce structured insights
- `POST /api/report` - Generates downloadable PDF report
