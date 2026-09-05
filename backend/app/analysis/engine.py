import io
import math
import numpy as np
import pandas as pd

def analyze_dataframe(df: pd.DataFrame) -> dict:
    total_rows, total_cols = df.shape
    dup_rows = int(df.duplicated().sum())
    dup_pct = round((dup_rows / total_rows * 100), 2) if total_rows > 0 else 0.0
    
    num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    cat_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()
    
    total_cells = total_rows * total_cols
    missing_cells = int(df.isna().sum().sum())
    missing_pct = round((missing_cells / total_cells * 100), 2) if total_cells > 0 else 0.0
    
    # Overview
    overview = {
        "rows": total_rows,
        "columns": total_cols,
        "numeric_columns": len(num_cols),
        "categorical_columns": len(cat_cols),
        "missing_values": missing_cells,
        "missing_percentage": missing_pct,
        "duplicate_rows": dup_rows,
        "duplicate_percentage": dup_pct,
    }
    
    # Data Preview (first 100 rows, max 100)
    preview_df = df.head(100).fillna("")
    preview = {
        "columns": list(df.columns),
        "rows": preview_df.to_dict(orient="records")
    }
    
    # Column profiling & quality
    columns_profile = []
    quality_issues = {
        "missing": [],
        "constant": [],
        "id_columns": []
    }
    
    for col in df.columns:
        series = df[col]
        n_missing = int(series.isna().sum())
        missing_pct_col = round((n_missing / total_rows * 100), 2) if total_rows > 0 else 0.0
        n_unique = int(series.nunique(dropna=True))
        
        col_type = "numeric" if col in num_cols else "categorical"
        
        # Check ID column
        is_id = False
        col_lower = col.lower()
        if ("id" in col_lower or col_lower.endswith("_id") or n_unique == total_rows) and n_unique > 0.8 * total_rows:
            is_id = True
            quality_issues["id_columns"].append({"column": col, "reason": "High unique count / ID pattern"})
            
        # Check constant
        if n_unique <= 1 and total_rows > 1:
            quality_issues["constant"].append({"column": col, "value": str(series.dropna().iloc[0]) if n_unique == 1 else "None"})
            
        # Check missing
        if n_missing > 0:
            severity = "low"
            if missing_pct_col > 50:
                severity = "high"
            elif missing_pct_col > 15:
                severity = "moderate"
            quality_issues["missing"].append({
                "column": col,
                "missing_count": n_missing,
                "missing_percentage": missing_pct_col,
                "severity": severity
            })
            
        sample_vals = series.dropna().astype(str).unique()[:5].tolist()
        
        profile = {
            "name": col,
            "type": col_type,
            "is_id": is_id,
            "unique_count": n_unique,
            "missing_count": n_missing,
            "missing_percentage": missing_pct_col,
            "sample_values": sample_vals,
            "stats": {}
        }
        
        if col_type == "numeric":
            clean_s = series.dropna()
            if not clean_s.empty:
                profile["stats"] = {
                    "mean": round(float(clean_s.mean()), 2),
                    "std": round(float(clean_s.std()), 2) if len(clean_s) > 1 else 0.0,
                    "median": round(float(clean_s.median()), 2),
                    "min": round(float(clean_s.min()), 2),
                    "q25": round(float(clean_s.quantile(0.25)), 2),
                    "q50": round(float(clean_s.quantile(0.50)), 2),
                    "q75": round(float(clean_s.quantile(0.75)), 2),
                    "max": round(float(clean_s.max()), 2),
                }
        else:
            vc = series.value_counts(dropna=True).head(5)
            profile["stats"] = {
                "top_categories": [{"category": str(k), "count": int(v)} for k, v in vc.items()]
            }
        
        columns_profile.append(profile)
        
    # Descriptive Statistics Table for numerical columns
    desc_stats = []
    for col in num_cols:
        p = next(c for c in columns_profile if c["name"] == col)
        if p["stats"]:
            desc_stats.append({
                "variable": col,
                "count": total_rows - p["missing_count"],
                **p["stats"]
            })
            
    # Correlation matrix for non-ID numerical columns
    valid_num_cols = [c for c in num_cols if not next(p for p in columns_profile if p["name"] == c)["is_id"]]
    correlations = []
    if len(valid_num_cols) > 1:
        corr_matrix = df[valid_num_cols].corr(method="pearson")
        pairs = []
        for i in range(len(valid_num_cols)):
            for j in range(i + 1, len(valid_num_cols)):
                col1, col2 = valid_num_cols[i], valid_num_cols[j]
                val = corr_matrix.loc[col1, col2]
                if not np.isnan(val):
                    pairs.append({
                        "var1": col1,
                        "var2": col2,
                        "correlation": round(float(val), 2)
                    })
        pairs.sort(key=lambda x: abs(x["correlation"]), reverse=True)
        correlations = pairs

    # Outlier Detection (IQR)
    outliers = []
    for col in valid_num_cols:
        clean_s = df[col].dropna()
        if len(clean_s) > 4:
            q25 = clean_s.quantile(0.25)
            q75 = clean_s.quantile(0.75)
            iqr = q75 - q25
            lower_bound = q25 - 1.5 * iqr
            upper_bound = q75 + 1.5 * iqr
            outlier_mask = (clean_s < lower_bound) | (clean_s > upper_bound)
            outlier_cnt = int(outlier_mask.sum())
            outlier_pct = round((outlier_cnt / len(clean_s) * 100), 2)
            outliers.append({
                "column": col,
                "outlier_count": outlier_cnt,
                "outlier_percentage": outlier_pct,
                "lower_bound": round(float(lower_bound), 2),
                "upper_bound": round(float(upper_bound), 2)
            })

    # Visualizations metadata / data generator
    visualizations = []
    # 1. Distribution for numericals (max 6 columns)
    for col in valid_num_cols[:6]:
        clean_s = df[col].dropna()
        if not clean_s.empty:
            counts, bin_edges = np.histogram(clean_s, bins=10)
            bins_data = []
            for i in range(len(counts)):
                bins_data.append({
                    "range": f"{round(bin_edges[i], 1)}-{round(bin_edges[i+1], 1)}",
                    "count": int(counts[i])
                })
            visualizations.append({
                "type": "histogram",
                "column": col,
                "title": f"Distribution of {col}",
                "data": bins_data
            })

    # 2. Categorical Bar Charts (max 4 columns)
    for col in cat_cols[:4]:
        p = next(c for c in columns_profile if c["name"] == col)
        if p["is_id"]:
            continue
        vc = df[col].value_counts(dropna=True).head(10)
        chart_data = [{"category": str(k), "count": int(v)} for k, v in vc.items()]
        visualizations.append({
            "type": "bar",
            "column": col,
            "title": f"Top Categories in {col}",
            "data": chart_data,
            "high_cardinality": p["unique_count"] > 10
        })

    # 3. Top Scatter plots (top 2 correlations)
    for corr in correlations[:2]:
        var1, var2 = corr["var1"], corr["var2"]
        sample_pts = df[[var1, var2]].dropna().head(200)
        pts_data = [{"x": float(row[var1]), "y": float(row[var2])} for _, row in sample_pts.iterrows()]
        visualizations.append({
            "type": "scatter",
            "var1": var1,
            "var2": var2,
            "title": f"{var1} vs {var2} (r={corr['correlation']})",
            "data": pts_data
        })

    return {
        "overview": overview,
        "preview": preview,
        "columns": columns_profile,
        "quality": quality_issues,
        "statistics": desc_stats,
        "correlations": correlations,
        "outliers": outliers,
        "visualizations": visualizations
    }
