# AI Dataset Analyzer

## 1. Product Overview

**Product Name:** AI Dataset Analyzer

**Product Type:** Web-based AI Data Analysis Tool

**Target Users:**
- University students
- Data science beginners
- Researchers
- Developers
- Business analysts
- Anyone who needs quick exploratory data analysis

**Core Value Proposition:**

> Upload a CSV dataset and automatically receive data-quality analysis, statistics, visualizations, correlations, outlier detection, and AI-generated insights.

The product must transform a raw CSV file into an understandable analytical report without requiring the user to write Python or SQL code.

---

# 2. Product Goals

The primary goals are:

1. Allow users to upload a CSV dataset.
2. Automatically inspect and profile the dataset.
3. Detect data-quality problems.
4. Generate descriptive statistics.
5. Generate useful visualizations automatically.
6. Calculate correlations between numerical variables.
7. Detect potential outliers.
8. Generate human-readable insights using an AI API.
9. Generate an analytical report.
10. Provide a polished interface suitable for a commercial AI tool.
11. Make the application responsive on desktop and mobile.
12. Provide a clear upgrade path for future monetization.

---

# 3. Non-Goals

The first version must NOT attempt to become a complete statistical software package.

Do not implement:

- Advanced machine learning training
- Deep learning
- Real-time collaborative analysis
- Complex database administration
- Full statistical research automation
- Automatic causal inference
- Medical or financial decision-making
- Automatic publication of research papers

The first release focuses on:

**CSV → EDA → Visualization → AI Insights → Report**

---

# 4. Target User Flow

The primary user flow is:

```text
Landing Page
      ↓
Upload Dataset
      ↓
Dataset Validation
      ↓
Dataset Overview
      ↓
Data Quality Analysis
      ↓
Descriptive Statistics
      ↓
Visualization
      ↓
Correlation Analysis
      ↓
Outlier Detection
      ↓
AI Insights
      ↓
Generate Report
      ↓
Export Report
```

The user should never need to understand programming to complete this workflow.

---

# 5. Core Features

## 5.1 Landing Page

Create a professional SaaS-style landing page.

Sections:

### Hero

Headline:

> Understand Your Data in Seconds.

Subheadline:

> Upload a CSV dataset and get automatic statistics, visualizations, data-quality checks, and AI-powered insights.

Primary CTA:

**Analyze Dataset**

Secondary CTA:

**Try Sample Dataset**

---

### Feature Section

Display the major capabilities:

- Automatic Data Profiling
- Data Quality Detection
- Smart Visualizations
- Correlation Analysis
- Outlier Detection
- AI-Powered Insights
- Exportable Reports

---

### How It Works

Three steps:

```text
1. Upload
Upload your CSV dataset.

2. Analyze
The system automatically performs exploratory data analysis.

3. Understand
Get charts, statistics, and AI-generated insights.
```

---

### Sample Analysis

Show an example dashboard using a bundled sample dataset.

This allows users to understand the product before uploading their own dataset.

---

# 6. Dataset Upload

The upload interface must support:

- `.csv`
- Drag and drop
- File picker
- Sample dataset

Display:

- Filename
- File size
- Number of rows after parsing
- Number of columns
- Upload status

Validation:

- Reject unsupported file types.
- Reject empty files.
- Reject malformed CSV files.
- Show a clear error message.
- Prevent analysis when the dataset is invalid.

For MVP, prioritize CSV.

Do not require Excel support in version 1.

---

# 7. Dataset Overview

After uploading a dataset, display an overview card.

Metrics:

```text
Rows
Columns
Numeric Columns
Categorical Columns
Missing Values
Duplicate Rows
```

Example:

```text
Rows              5,000
Columns              12
Numeric Columns       8
Categorical Columns   4
Missing Values       127
Duplicate Rows        23
```

---

# 8. Data Preview

Display the first rows of the dataset.

Requirements:

- Table layout
- Horizontal scrolling
- Sticky header
- Pagination
- Column names
- Data values

Do not render extremely large datasets entirely into the DOM.

Only render the required visible rows.

---

# 9. Column Profiling

Every column should receive an automatic profile.

For each column determine:

- Column name
- Data type
- Number of unique values
- Missing values
- Missing percentage
- Example values

For numerical columns:

- Mean
- Median
- Minimum
- Maximum
- Standard deviation
- Quartiles

For categorical columns:

- Unique count
- Most frequent values
- Frequency distribution

---

# 10. Data Quality Analysis

Create a dedicated Data Quality section.

Detect:

### Missing Values

Show:

```text
Column
Missing Count
Missing Percentage
```

Classify severity:

- No missing values
- Low
- Moderate
- High

Do not automatically delete missing data.

The application should only report the issue and provide recommendations.

---

### Duplicate Rows

Calculate:

- Total duplicate rows
- Duplicate percentage

Example:

```text
23 duplicate rows detected
0.46% of the dataset
```

---

### Potential Constant Columns

Detect columns where almost every value is identical.

Example:

```text
status = active
status = active
status = active
...
```

Recommend reviewing whether the column is useful for analysis.

---

### Potential ID Columns

Detect columns that appear to be identifiers.

Examples:

- user_id
- customer_id
- transaction_id

Do not treat ID columns as meaningful numerical variables for correlation analysis.

---

# 11. Descriptive Statistics

Create a statistics table for numerical variables.

Columns:

```text
Variable
Count
Mean
Median
Std Dev
Min
25%
50%
75%
Max
```

Allow users to sort the table.

Use appropriate numerical formatting.

Avoid excessive decimal places.

---

# 12. Automatic Visualization

The application should automatically select useful charts based on column types.

## Numerical Distribution

For numerical variables:

- Histogram
- Box plot

## Categorical Variables

For categorical variables:

- Bar chart

Only show a reasonable number of categories.

If a categorical variable has hundreds or thousands of unique values, do not generate a massive chart.

Instead display:

> High-cardinality categorical variable. Visualization limited to top categories.

---

## Numerical vs Numerical

Generate:

- Scatter plot

Example:

```text
Area vs Price
Age vs Income
Hours Studied vs Score
```

---

## Categorical vs Numerical

Generate:

- Box plot
- Grouped summary

Example:

```text
Department vs Salary
Category vs Price
Region vs Revenue
```

---

# 13. Correlation Analysis

Calculate Pearson correlation for appropriate numerical columns.

Display:

- Correlation matrix
- Ranked strongest positive correlations
- Ranked strongest negative correlations

Example:

```text
Strongest Positive Correlation

area ↔ price
r = 0.81

Strongest Negative Correlation

age ↔ income
r = -0.42
```

Important:

The UI must clearly state that correlation does not imply causation.

Do not generate causal claims from correlation values.

---

# 14. Outlier Detection

For numerical variables, implement the IQR method.

Formula:

```text
IQR = Q3 - Q1

Lower Bound = Q1 - 1.5 × IQR
Upper Bound = Q3 + 1.5 × IQR
```

Display:

```text
Variable
Outlier Count
Outlier Percentage
```

Example:

```text
price
47 outliers
0.94%
```

Outliers should not automatically be deleted.

The application should identify them and explain that they require contextual review.

---

# 15. AI Insight Engine

After statistical analysis is complete, send a structured analysis summary to the AI API.

Do NOT send the entire raw dataset by default.

Instead send aggregated information such as:

```json
{
  "dataset": {
    "rows": 5000,
    "columns": 12
  },
  "columns": [],
  "missing_values": {},
  "statistics": {},
  "correlations": [],
  "outliers": []
}
```

The AI should generate:

### Dataset Summary

A short explanation of what the dataset appears to contain.

### Key Findings

Generate 3–7 meaningful observations.

### Data Quality Findings

Explain important missing values, duplicates, unusual columns, and potential quality problems.

### Statistical Findings

Explain notable distributions and relationships.

### Recommended Next Steps

Suggest reasonable next analyses.

The AI must not invent facts that are not present in the supplied analysis data.

---

# 16. AI Prompt Requirements

The AI system prompt must enforce:

1. Only use supplied analysis results.
2. Never fabricate statistics.
3. Never claim causation from correlation.
4. Clearly distinguish observations from recommendations.
5. Use simple language.
6. Mention uncertainty where appropriate.
7. Do not provide unsupported conclusions.
8. Do not expose API keys.
9. Return structured output.

Expected response structure:

```json
{
  "summary": "...",
  "key_findings": [
    "...",
    "...",
    "..."
  ],
  "data_quality": [
    "..."
  ],
  "recommendations": [
    "..."
  ],
  "conclusion": "..."
}
```

Validate the AI response before displaying it.

If the AI response is invalid, show a graceful fallback rather than crashing the application.

---

# 17. Analysis Dashboard

Create a central dashboard with tabs or sections:

```text
Overview
Data Preview
Data Quality
Statistics
Visualizations
Correlations
Outliers
AI Insights
Report
```

The dashboard must have a clear visual hierarchy.

Use cards for high-level metrics.

Use charts for analytical information.

Avoid unnecessary animations.

---

# 18. Report Generator

Create a report from the completed analysis.

Report sections:

```text
AI Dataset Analyzer Report

1. Dataset Overview

2. Data Quality

3. Descriptive Statistics

4. Visualizations

5. Correlation Analysis

6. Outlier Analysis

7. AI-Generated Insights

8. Recommendations

9. Conclusion
```

The report must include the dataset filename and analysis timestamp.

---

# 19. Export

MVP should support:

### PDF

Generate a downloadable PDF report.

### CSV

Allow users to export relevant statistical tables.

Future:

- Excel
- Markdown
- JSON
- PowerPoint

Do not prioritize future formats during MVP implementation.

---

# 20. Sample Dataset

Include at least one sample dataset inside the project.

Recommended dataset:

```text
sample_sales.csv
```

Example columns:

```text
date
product
category
region
quantity
unit_price
revenue
customer_age
```

The sample dataset must contain enough variation to demonstrate:

- Numerical variables
- Categorical variables
- Missing values
- Correlations
- Outliers
- Different distributions

The "Try Sample Dataset" button should immediately launch an analysis using this dataset.

---

# 21. UI / UX Requirements

Design direction:

**Modern analytical SaaS dashboard.**

Visual characteristics:

- Clean
- Minimal
- Professional
- Data-focused
- Responsive
- Accessible

Avoid:

- Excessive gradients
- Excessive glassmorphism
- Excessive animations
- Huge decorative elements
- Cluttered dashboards

Use a consistent spacing system.

Charts must remain readable.

Tables must work on smaller screens.

---

# 22. Responsive Design

Desktop:

```text
Sidebar + Main Content
```

Mobile:

```text
Top navigation
Stacked cards
Horizontally scrollable tables
Full-width charts
```

The application must remain usable at:

- 1440px
- 1280px
- 1024px
- 768px
- 390px

---

# 23. Loading States

Every expensive operation must have a loading state.

Examples:

```text
Parsing dataset...
Profiling columns...
Calculating statistics...
Generating visualizations...
Analyzing correlations...
Detecting outliers...
Generating AI insights...
Building report...
```

Do not freeze the UI without feedback.

---

# 24. Error Handling

Every major operation requires error handling.

Possible errors:

- Invalid CSV
- Empty dataset
- Dataset too large
- Parsing failure
- Unsupported data type
- AI API failure
- Network failure
- Report generation failure

Errors must be human-readable.

Bad:

```text
Error: undefined
```

Good:

```text
We couldn't analyze this dataset.

The CSV appears to contain inconsistent column formatting.
Please check the file and try again.
```

---

# 25. Privacy

The application must clearly communicate how uploaded data is handled.

For MVP:

- Do not permanently store uploaded datasets.
- Process data only for the current analysis session where possible.
- Do not send raw datasets to the AI API unless explicitly necessary.
- Prefer sending aggregated analysis results to the AI.
- Never expose API keys in frontend code.

Add a small privacy notice near the upload interface.

---

# 26. Security

Requirements:

- API keys must remain server-side.
- Validate uploaded files.
- Limit file size.
- Prevent arbitrary file execution.
- Sanitize generated content.
- Do not trust uploaded filenames.
- Do not expose server environment variables.
- Implement basic request rate limiting if a backend is used.

---

# 27. Recommended Architecture

Use a frontend + backend architecture.

```text
Frontend
React + TypeScript
        │
        ▼
Backend API
        │
        ├── Dataset Parser
        ├── Statistical Engine
        ├── Visualization Data Generator
        ├── Correlation Engine
        ├── Outlier Engine
        ├── AI Insight Engine
        └── Report Generator
```

Recommended stack:

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts

### Backend

Preferred:

- Python
- FastAPI
- pandas
- numpy
- scipy

Reason:

Python has mature libraries for dataset analysis and statistical computation.

### AI

Use an OpenAI-compatible API abstraction.

The AI provider must be configurable through environment variables.

Do not hard-code provider credentials.

---

# 28. Backend API

Implement endpoints similar to:

```text
POST /api/analyze
POST /api/insights
POST /api/report
GET  /api/health
```

## POST /api/analyze

Input:

```text
CSV file
```

Output:

```json
{
  "dataset": {},
  "columns": [],
  "quality": {},
  "statistics": {},
  "correlations": [],
  "outliers": [],
  "visualizations": []
}
```

---

## POST /api/insights

Input:

```json
{
  "analysis": {}
}
```

Output:

```json
{
  "summary": "",
  "key_findings": [],
  "data_quality": [],
  "recommendations": [],
  "conclusion": ""
}
```

---

## POST /api/report

Input:

```json
{
  "analysis": {},
  "insights": {}
}
```

Output:

A downloadable PDF report.

---

# 29. Performance Requirements

The application should remain responsive for typical student/business datasets.

MVP target:

```text
Maximum recommended CSV size: 25 MB
```

For large datasets:

- Avoid rendering every row.
- Use pagination.
- Limit chart points where necessary.
- Perform heavy computation server-side.

The UI should display progress during analysis.

---

# 30. Project Structure

Use a clean monorepo structure:

```text
ai-dataset-analyzer/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── analysis/
│   │   ├── models/
│   │   └── utils/
│   ├── requirements.txt
│   └── main.py
│
├── sample-data/
│   └── sample_sales.csv
│
├── README.md
├── PRD.md
└── .gitignore
```

Keep frontend and backend responsibilities separated.

---

# 31. Environment Variables

Example:

```env
AI_API_KEY=
AI_API_BASE_URL=
AI_MODEL=
BACKEND_URL=
```

Never commit `.env`.

Create:

```text
.env.example
```

with placeholder values.

---

# 32. Accessibility

Implement:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible labels
- Sufficient contrast
- Meaningful error messages
- Chart descriptions where practical

Do not rely solely on color to communicate meaning.

---

# 33. Monetization Architecture

The architecture should allow future monetization without requiring a major rewrite.

Potential plans:

### Free

- Limited dataset size
- Basic statistics
- Basic charts
- Limited AI analyses

### Pro

- Larger datasets
- AI insights
- PDF reports
- More visualizations
- Advanced analysis

### Future

- User accounts
- Usage limits
- Payment integration
- Analysis history
- Saved projects

Do not implement payment processing in MVP unless explicitly requested.

---

# 34. Analytics

For future product analytics, track only non-sensitive events such as:

```text
dataset_upload_started
dataset_analysis_completed
report_generated
sample_dataset_used
```

Do not collect raw dataset contents as analytics data.

---

# 35. SEO

Create basic SEO metadata:

Title:

```text
AI Dataset Analyzer — Analyze CSV Data with AI
```

Description:

```text
Upload a CSV dataset and automatically generate statistics, visualizations, data-quality analysis, and AI-powered insights.
```

Use semantic headings.

---

# 36. README Requirements

README.md must contain:

1. Product overview
2. Features
3. Tech stack
4. Project structure
5. Installation
6. Environment variables
7. Development commands
8. API documentation
9. Sample dataset
10. Deployment instructions
11. Limitations
12. Future roadmap

Include screenshots once the UI is complete.

---

# 37. Development Phases

## Phase 1 — Project Setup

- Initialize repository
- Setup frontend
- Setup backend
- Setup TypeScript
- Setup Tailwind
- Setup FastAPI
- Setup linting
- Setup environment configuration

Deliverable:

Application starts successfully.

---

## Phase 2 — Upload System

Implement:

- CSV upload
- Drag and drop
- Validation
- File size validation
- CSV parsing
- Error states

Deliverable:

User can upload a valid CSV.

---

## Phase 3 — Dataset Analysis

Implement:

- Dataset overview
- Column profiling
- Missing values
- Duplicate detection
- Data types
- Descriptive statistics

Deliverable:

Uploaded dataset produces structured analysis data.

---

## Phase 4 — Visualization

Implement:

- Histogram
- Bar chart
- Scatter plot
- Box plot
- Correlation matrix

Deliverable:

Charts are automatically generated based on dataset structure.

---

## Phase 5 — Outlier Detection

Implement IQR-based outlier detection.

Deliverable:

Outlier statistics are displayed for numerical columns.

---

## Phase 6 — AI Insights

Implement:

- Analysis summarization
- AI request
- Structured response validation
- Error fallback
- Insight display

Deliverable:

User receives AI-generated insights based only on computed analysis.

---

## Phase 7 — Report

Implement:

- Report preview
- PDF generation
- Download

Deliverable:

Complete analysis can be exported.

---

## Phase 8 — UI Polish

Improve:

- Responsive design
- Empty states
- Loading states
- Error states
- Typography
- Spacing
- Navigation
- Accessibility

Deliverable:

Production-quality UI.

---

## Phase 9 — Testing

Test:

### Dataset Tests

- Empty CSV
- One-column CSV
- Numeric-only CSV
- Categorical-only CSV
- Mixed dataset
- Missing values
- Duplicate rows
- Large dataset
- Invalid CSV

### UI Tests

- Upload
- Navigation
- Dashboard
- Charts
- Report generation
- Mobile layout

### API Tests

- `/api/health`
- `/api/analyze`
- `/api/insights`
- `/api/report`

---

## Phase 10 — Deployment

Deploy frontend and backend separately if required.

Production requirements:

- HTTPS
- Environment variables
- CORS configuration
- Upload limits
- Error logging
- Health endpoint

Before deployment verify:

```text
npm run build
```

and backend startup successfully.

---

# 38. Definition of Done

The project is considered complete only when:

- [ ] Frontend runs successfully.
- [ ] Backend runs successfully.
- [ ] CSV upload works.
- [ ] Invalid CSV is handled.
- [ ] Dataset overview works.
- [ ] Data preview works.
- [ ] Column profiling works.
- [ ] Missing-value analysis works.
- [ ] Duplicate detection works.
- [ ] Descriptive statistics work.
- [ ] Automatic charts work.
- [ ] Correlation analysis works.
- [ ] Outlier detection works.
- [ ] AI insights work.
- [ ] AI failures are handled gracefully.
- [ ] PDF report generation works.
- [ ] Sample dataset works.
- [ ] Responsive layout works.
- [ ] Loading states exist.
- [ ] Error states exist.
- [ ] No API keys are exposed in frontend.
- [ ] `.env` is excluded from Git.
- [ ] README is complete.
- [ ] Production build succeeds.
- [ ] Application is deployable.

---

# 39. Important Implementation Rules for Hermes

You are responsible for implementing the application, not merely describing it.

Follow these rules:

1. Inspect the existing repository before making changes.
2. Do not overwrite working code unnecessarily.
3. Build the application incrementally.
4. After each major phase, verify that the application still runs.
5. Fix errors before moving to the next phase.
6. Do not leave placeholder functionality where a real implementation is expected.
7. Do not create fake AI responses.
8. Do not hard-code analysis results.
9. Do not expose API credentials.
10. Do not use mock data for the user's uploaded dataset.
11. Use the bundled sample dataset only for the sample/demo mode.
12. Handle edge cases explicitly.
13. Keep the code modular.
14. Keep frontend and backend responsibilities separated.
15. Prefer simple, maintainable implementations over unnecessary complexity.

---

# 40. Final Acceptance Test

Before declaring the project complete, perform this exact workflow:

```text
1. Start backend.
2. Start frontend.
3. Open the application.
4. Click "Try Sample Dataset".
5. Verify the complete analysis dashboard.
6. Verify statistics.
7. Verify charts.
8. Verify correlations.
9. Verify outliers.
10. Generate AI insights.
11. Generate PDF report.
12. Download the report.
13. Return to upload.
14. Upload a different CSV.
15. Verify that the analysis changes according to the new dataset.
16. Test an invalid CSV.
17. Verify graceful error handling.
18. Test mobile responsive layout.
19. Run production build.
20. Fix all remaining errors.
```

Do not report the project as complete if any core acceptance test fails.

---

# 41. Future Roadmap

After MVP:

### V1.1

- Excel `.xlsx` support
- Markdown export
- More chart types
- Better automatic chart selection

### V1.2

- User accounts
- Analysis history
- Saved datasets
- Saved reports

### V1.3

- Pro subscription
- Usage limits
- Payment integration

### V2

- AI-assisted data cleaning
- Statistical hypothesis testing
- Regression analysis
- ANOVA
- Time-series analysis
- Automated research report generation
- PowerPoint export

The roadmap must not interfere with MVP development.

---

# 42. Product Principle

The core principle of the product is:

> **Make data analysis understandable without requiring the user to know how to code.**

Every feature should reduce the amount of technical knowledge required from the user while maintaining analytical transparency and avoiding unsupported conclusions.