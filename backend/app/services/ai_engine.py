import os
import json
import httpx

AI_API_KEY = os.getenv("AI_API_KEY", "")
AI_API_BASE_URL = os.getenv("AI_API_BASE_URL", "https://api.openai.com/v1").rstrip("/")
AI_MODEL = os.getenv("AI_MODEL", "gpt-4o-mini")

SYSTEM_PROMPT = """You are an expert AI data analyst. You analyze dataset summary data and provide clear, objective, human-readable insights.

CRITICAL RULES:
1. ONLY use supplied analysis results.
2. NEVER fabricate statistics or numbers not in the analysis.
3. NEVER claim causation from correlation (correlation does not imply causation).
4. Clearly distinguish observations from recommendations.
5. Use simple, direct language accessible to non-programmers.
6. Mention uncertainty where appropriate.
7. Return raw strict JSON matching this exact structure without markdown formatting:
{
  "summary": "Short overview of the dataset content",
  "key_findings": ["Finding 1", "Finding 2", "Finding 3"],
  "data_quality": ["Data quality issue or confirmation 1", "Data quality issue 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "conclusion": "Final concluding thought"
}"""

async def generate_ai_insights(analysis_summary: dict) -> dict:
    if not AI_API_KEY:
        return _fallback_insights(analysis_summary, "AI_API_KEY is not configured on the server.")
        
    payload = {
        "model": AI_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Analyze this dataset summary:\n{json.dumps(analysis_summary, indent=2)}"}
        ],
        "temperature": 0.2
    }
    
    headers = {
        "Authorization": f"Bearer {AI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(f"{AI_API_BASE_URL}/chat/completions", json=payload, headers=headers)
            if resp.status_code != 200:
                return _fallback_insights(analysis_summary, f"API error HTTP {resp.status_code}: {resp.text[:100]}")
            
            data = resp.json()
            content = data["choices"][0]["message"]["content"].strip()
            if content.startswith("```"):
                content = content.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
                
            parsed = json.loads(content)
            return parsed
    except Exception as e:
        return _fallback_insights(analysis_summary, f"Failed to generate AI insights: {str(e)}")

def _fallback_insights(analysis_summary: dict, reason: str) -> dict:
    ov = analysis_summary.get("overview", {})
    cols = analysis_summary.get("columns", [])
    num_cnt = ov.get("numeric_columns", 0)
    cat_cnt = ov.get("categorical_columns", 0)
    missing_cnt = ov.get("missing_values", 0)
    dup_cnt = ov.get("duplicate_rows", 0)
    
    return {
        "summary": f"Dataset contains {ov.get('rows', 0):,} rows and {ov.get('columns', 0)} columns ({num_cnt} numeric, {cat_cnt} categorical). [System Note: {reason}]",
        "key_findings": [
            f"The dataset holds a total of {ov.get('rows', 0):,} records across {ov.get('columns', 0)} variables.",
            f"Found {num_cnt} numerical variables and {cat_cnt} categorical variables for analysis.",
            f"Correlation and distribution profiling completed successfully."
        ],
        "data_quality": [
            f"Missing values: {missing_cnt} missing cells detected ({ov.get('missing_percentage', 0)}% overall).",
            f"Duplicate rows: {dup_cnt} exact duplicate rows identified ({ov.get('duplicate_percentage', 0)}%)."
        ],
        "recommendations": [
            "Review missing value patterns to decide on imputation or dropping incomplete rows.",
            "Verify duplicate records to ensure they represent distinct real-world events.",
            "Investigate identified numerical outliers before building predictive models."
        ],
        "conclusion": "Automated statistical analysis completed. Configure a valid AI API Key for deeper LLM insights."
    }
