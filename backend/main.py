import os
import io
import pandas as pd
from fastapi import FastAPI, UploadFile, File, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

from app.analysis.engine import analyze_dataframe
from app.services.ai_engine import generate_ai_insights
from app.services.report_generator import generate_pdf_report

app = FastAPI(title="AI Dataset Analyzer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InsightsRequest(BaseModel):
    analysis: Dict[str, Any]

class ReportRequest(BaseModel):
    filename: Optional[str] = "dataset.csv"
    analysis: Dict[str, Any]
    insights: Dict[str, Any]

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "AI Dataset Analyzer Backend"}

@app.post("/api/analyze")
async def analyze_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
    
    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded CSV file is empty.")
    
    if len(contents) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum limit of 25MB.")
    
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {str(e)}")
    
    if df.empty:
        raise HTTPException(status_code=400, detail="Dataset has no rows or columns.")
        
    analysis_res = analyze_dataframe(df)
    analysis_res["filename"] = file.filename
    analysis_res["file_size_bytes"] = len(contents)
    
    return analysis_res

@app.post("/api/insights")
async def get_insights(req: InsightsRequest):
    if not req.analysis:
        raise HTTPException(status_code=400, detail="Analysis data is required.")
    insights = await generate_ai_insights(req.analysis)
    return insights

@app.post("/api/report")
async def create_report(req: ReportRequest):
    pdf_bytes = generate_pdf_report(req.filename, req.analysis, req.insights)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=report_{req.filename}.pdf"}
    )
