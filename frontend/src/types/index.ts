export interface Overview {
  rows: number;
  columns: number;
  numeric_columns: number;
  categorical_columns: number;
  missing_values: number;
  missing_percentage: number;
  duplicate_rows: number;
  duplicate_percentage: number;
}

export interface Preview {
  columns: string[];
  rows: Record<string, any>[];
}

export interface ColumnProfile {
  name: string;
  type: 'numeric' | 'categorical';
  is_id: boolean;
  unique_count: number;
  missing_count: number;
  missing_percentage: number;
  sample_values: string[];
  stats: Record<string, any>;
}

export interface QualityIssueMissing {
  column: string;
  missing_count: number;
  missing_percentage: number;
  severity: 'low' | 'moderate' | 'high';
}

export interface QualityIssueConstant {
  column: string;
  value: string;
}

export interface QualityIssueID {
  column: string;
  reason: string;
}

export interface QualityIssues {
  missing: QualityIssueMissing[];
  constant: QualityIssueConstant[];
  id_columns: QualityIssueID[];
}

export interface StatRow {
  variable: string;
  count: number;
  mean: number;
  std: number;
  min: number;
  q25: number;
  q50: number;
  q75: number;
  max: number;
}

export interface Correlation {
  var1: string;
  var2: string;
  correlation: number;
}

export interface OutlierItem {
  column: string;
  outlier_count: number;
  outlier_percentage: number;
  lower_bound: number;
  upper_bound: number;
}

export interface Visualization {
  type: 'histogram' | 'bar' | 'scatter';
  column?: string;
  var1?: string;
  var2?: string;
  title: string;
  data: any[];
  high_cardinality?: boolean;
}

export interface AnalysisData {
  filename: string;
  file_size_bytes: number;
  overview: Overview;
  preview: Preview;
  columns: ColumnProfile[];
  quality: QualityIssues;
  statistics: StatRow[];
  correlations: Correlation[];
  outliers: OutlierItem[];
  visualizations: Visualization[];
}

export interface AIInsights {
  summary: string;
  key_findings: string[];
  data_quality: string[];
  recommendations: string[];
  conclusion: string;
}
