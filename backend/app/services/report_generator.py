import io
import datetime
from fpdf import FPDF

def clean_text(s: str) -> str:
    return str(s).encode('latin-1', 'replace').decode('latin-1')

class PDFReport(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, "AI Dataset Analyzer - Analytical Report", border=0, new_x="LMARGIN", new_y="NEXT", align="R")
        self.line(10, 15, 200, 15)
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")

def generate_pdf_report(filename: str, analysis: dict, insights: dict) -> bytes:
    pdf = PDFReport()
    pdf.alias_nb_pages()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Title Section
    pdf.set_font("Helvetica", "B", 20)
    pdf.set_text_color(24, 43, 73)
    pdf.cell(0, 12, "Dataset Analysis Report", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(100, 100, 100)
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    pdf.cell(0, 6, clean_text(f"File: {filename}  |  Generated: {now_str}"), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)
    
    # Helper heading
    def add_section(title):
        pdf.set_font("Helvetica", "B", 13)
        pdf.set_text_color(24, 43, 73)
        pdf.cell(0, 8, clean_text(title), new_x="LMARGIN", new_y="NEXT")
        pdf.set_draw_color(200, 200, 200)
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())
        pdf.ln(4)

    # 1. Dataset Overview
    add_section("1. Dataset Overview")
    ov = analysis.get("overview", {})
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(40, 40, 40)
    pdf.cell(95, 6, clean_text(f"Total Rows: {ov.get('rows', 0):,}"), border=0)
    pdf.cell(95, 6, clean_text(f"Total Columns: {ov.get('columns', 0)}"), border=0, new_x="LMARGIN", new_y="NEXT")
    pdf.cell(95, 6, clean_text(f"Numeric Columns: {ov.get('numeric_columns', 0)}"), border=0)
    pdf.cell(95, 6, clean_text(f"Categorical Columns: {ov.get('categorical_columns', 0)}"), border=0, new_x="LMARGIN", new_y="NEXT")
    pdf.cell(95, 6, clean_text(f"Missing Cells: {ov.get('missing_values', 0)} ({ov.get('missing_percentage', 0)}%)"), border=0)
    pdf.cell(95, 6, clean_text(f"Duplicate Rows: {ov.get('duplicate_rows', 0)} ({ov.get('duplicate_percentage', 0)}%)"), border=0, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    # 2. Data Quality
    add_section("2. Data Quality Analysis")
    quality = analysis.get("quality", {})
    missing_list = quality.get("missing", [])
    if missing_list:
        pdf.set_font("Helvetica", "B", 9)
        pdf.cell(60, 6, "Column", border=1)
        pdf.cell(40, 6, "Missing Count", border=1)
        pdf.cell(40, 6, "Missing %", border=1)
        pdf.cell(50, 6, "Severity", border=1, new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 9)
        for item in missing_list[:5]:
            pdf.cell(60, 6, clean_text(str(item["column"])[:25]), border=1)
            pdf.cell(40, 6, clean_text(str(item["missing_count"])), border=1)
            pdf.cell(40, 6, clean_text(f"{item['missing_percentage']}%"), border=1)
            pdf.cell(50, 6, clean_text(str(item["severity"]).capitalize()), border=1, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(4)
    else:
        pdf.set_font("Helvetica", "", 10)
        pdf.cell(0, 6, "No missing values detected in the dataset.", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)

    # 3. Descriptive Statistics
    add_section("3. Descriptive Statistics")
    stats = analysis.get("statistics", [])
    if stats:
        pdf.set_font("Helvetica", "B", 8)
        pdf.cell(40, 6, "Variable", border=1)
        pdf.cell(25, 6, "Mean", border=1)
        pdf.cell(25, 6, "Std Dev", border=1)
        pdf.cell(25, 6, "Min", border=1)
        pdf.cell(25, 6, "Median", border=1)
        pdf.cell(25, 6, "Max", border=1, new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 8)
        for row in stats[:8]:
            pdf.cell(40, 6, clean_text(str(row["variable"])[:18]), border=1)
            pdf.cell(25, 6, clean_text(str(row["mean"])), border=1)
            pdf.cell(25, 6, clean_text(str(row["std"])), border=1)
            pdf.cell(25, 6, clean_text(str(row["min"])), border=1)
            pdf.cell(25, 6, clean_text(str(row["median"])), border=1)
            pdf.cell(25, 6, clean_text(str(row["max"])), border=1, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(4)

    # 4. Correlations
    add_section("4. Top Correlations")
    corrs = analysis.get("correlations", [])
    if corrs:
        pdf.set_font("Helvetica", "", 9)
        for c in corrs[:5]:
            pdf.cell(0, 6, clean_text(f"* {c['var1']} <--> {c['var2']}: Pearson r = {c['correlation']}"), new_x="LMARGIN", new_y="NEXT")
        pdf.ln(4)
    else:
        pdf.set_font("Helvetica", "", 9)
        pdf.cell(0, 6, "No numeric pairs available for correlation analysis.", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(4)

    # 5. Outliers
    add_section("5. Outlier Detection (IQR Method)")
    outliers = analysis.get("outliers", [])
    if outliers:
        pdf.set_font("Helvetica", "", 9)
        for o in outliers[:5]:
            pdf.cell(0, 6, clean_text(f"* {o['column']}: {o['outlier_count']} outliers ({o['outlier_percentage']}%) [Bounds: {o['lower_bound']} to {o['upper_bound']}]"), new_x="LMARGIN", new_y="NEXT")
        pdf.ln(4)

    # 6. AI Insights
    add_section("6. AI-Generated Insights")
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, "Summary:", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 9)
    pdf.multi_cell(180, 5, clean_text(insights.get("summary", "N/A")), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, "Key Findings:", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 9)
    for kf in insights.get("key_findings", []):
        pdf.multi_cell(180, 5, clean_text(f"- {kf}"), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, "Recommendations:", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 9)
    for rec in insights.get("recommendations", []):
        pdf.multi_cell(180, 5, clean_text(f"- {rec}"), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    # 7. Conclusion
    add_section("7. Conclusion")
    pdf.set_font("Helvetica", "", 9)
    pdf.multi_cell(180, 5, clean_text(insights.get("conclusion", "Analysis complete.")), new_x="LMARGIN", new_y="NEXT")

    return bytes(pdf.output())
