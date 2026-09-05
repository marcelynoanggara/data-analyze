import React, { useState } from 'react';
import type { AnalysisData, AIInsights } from '../types';
import { 
  BarChart2, Table as TableIcon, AlertTriangle, Calculator, 
  PieChart as ChartIcon, GitCommit, Search, Sparkles, FileText, Download, ArrowLeft 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, CartesianGrid 
} from 'recharts';

interface DashboardProps {
  data: AnalysisData;
  insights: AIInsights | null;
  onGenerateInsights: () => void;
  onGenerateReport: () => void;
  onBack: () => void;
  insightsLoading: boolean;
  reportLoading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  data,
  insights,
  onGenerateInsights,
  onGenerateReport,
  onBack,
  insightsLoading,
  reportLoading
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'preview' | 'quality' | 'stats' | 'charts' | 'correlations' | 'outliers' | 'ai' | 'report'>('overview');
  const [previewPage, setPreviewPage] = useState(0);
  const pageSize = 15;

  const totalPreviewPages = Math.ceil(data.preview.rows.length / pageSize);
  const currentRows = data.preview.rows.slice(previewPage * pageSize, (previewPage + 1) * pageSize);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition flex items-center gap-1 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              {data.filename}
              <span className="text-xs font-normal bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {(data.file_size_bytes / 1024).toFixed(1)} KB
              </span>
            </h1>
            <p className="text-xs text-slate-500">{data.overview.rows.toLocaleString()} rows • {data.overview.columns} columns</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGenerateReport}
            disabled={reportLoading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {reportLoading ? 'Building PDF...' : 'Export PDF Report'}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <nav className="flex space-x-6 overflow-x-auto text-sm font-medium text-slate-600">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart2 },
            { id: 'preview', label: 'Data Preview', icon: TableIcon },
            { id: 'quality', label: 'Data Quality', icon: AlertTriangle },
            { id: 'stats', label: 'Statistics', icon: Calculator },
            { id: 'charts', label: 'Visualizations', icon: ChartIcon },
            { id: 'correlations', label: 'Correlations', icon: GitCommit },
            { id: 'outliers', label: 'Outliers', icon: Search },
            { id: 'ai', label: 'AI Insights', icon: Sparkles },
            { id: 'report', label: 'Report Summary', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 flex items-center gap-2 border-b-2 font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-medium text-slate-500 uppercase">Rows</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{data.overview.rows.toLocaleString()}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-medium text-slate-500 uppercase">Columns</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{data.overview.columns}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-medium text-slate-500 uppercase">Numeric</div>
                <div className="text-2xl font-bold text-indigo-600 mt-1">{data.overview.numeric_columns}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-medium text-slate-500 uppercase">Categorical</div>
                <div className="text-2xl font-bold text-emerald-600 mt-1">{data.overview.categorical_columns}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-medium text-slate-500 uppercase">Missing Values</div>
                <div className="text-2xl font-bold text-amber-600 mt-1">{data.overview.missing_values}</div>
                <div className="text-xs text-slate-400 mt-0.5">{data.overview.missing_percentage}% of cells</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-medium text-slate-500 uppercase">Duplicate Rows</div>
                <div className="text-2xl font-bold text-rose-600 mt-1">{data.overview.duplicate_rows}</div>
                <div className="text-xs text-slate-400 mt-0.5">{data.overview.duplicate_percentage}%</div>
              </div>
            </div>

            {/* Column Schema Grid */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4">Column Profiling Overview</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                    <tr>
                      <th className="p-3">Column</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Unique</th>
                      <th className="p-3">Missing</th>
                      <th className="p-3">Sample Values</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.columns.map(col => (
                      <tr key={col.name} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">
                          {col.name}
                          {col.is_id && (
                            <span className="ml-2 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                              ID
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            col.type === 'numeric' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {col.type}
                          </span>
                        </td>
                        <td className="p-3">{col.unique_count.toLocaleString()}</td>
                        <td className="p-3">
                          {col.missing_count > 0 ? (
                            <span className="text-amber-600 font-medium">{col.missing_count} ({col.missing_percentage}%)</span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-500 text-xs truncate max-w-xs">
                          {col.sample_values.join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DATA PREVIEW */}
        {activeTab === 'preview' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">Data Preview (Showing first {data.preview.rows.length} rows)</h2>
              <div className="text-sm text-slate-500">
                Page {previewPage + 1} of {totalPreviewPages}
              </div>
            </div>
            
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0">
                  <tr>
                    {data.preview.columns.map(col => (
                      <th key={col} className="p-3 whitespace-nowrap border-b border-slate-200">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      {data.preview.columns.map(col => (
                        <td key={col} className="p-3 whitespace-nowrap text-slate-600">{String(row[col] ?? '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setPreviewPage(p => Math.max(0, p - 1))}
                disabled={previewPage === 0}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPreviewPage(p => Math.min(totalPreviewPages - 1, p + 1))}
                disabled={previewPage >= totalPreviewPages - 1}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* DATA QUALITY */}
        {activeTab === 'quality' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Missing Value Analysis
              </h2>
              {data.quality.missing.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                      <tr>
                        <th className="p-3">Column</th>
                        <th className="p-3">Missing Count</th>
                        <th className="p-3">Percentage</th>
                        <th className="p-3">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.quality.missing.map(m => (
                        <tr key={m.column}>
                          <td className="p-3 font-medium text-slate-900">{m.column}</td>
                          <td className="p-3">{m.missing_count}</td>
                          <td className="p-3">{m.missing_percentage}%</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              m.severity === 'high' ? 'bg-rose-100 text-rose-800' :
                              m.severity === 'moderate' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {m.severity.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No missing values detected across all columns.</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">Duplicate Rows</h3>
                <p className="text-sm text-slate-600 mb-4">
                  {data.overview.duplicate_rows} duplicate rows detected ({data.overview.duplicate_percentage}% of dataset).
                </p>
                <p className="text-xs text-slate-400">Recommendation: Inspect duplicate rows before modeling to avoid inflating variance.</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">Detected ID Columns</h3>
                {data.quality.id_columns.length > 0 ? (
                  <ul className="text-sm space-y-2">
                    {data.quality.id_columns.map(idCol => (
                      <li key={idCol.column} className="flex justify-between items-center bg-slate-50 p-2 rounded">
                        <span className="font-medium text-slate-800">{idCol.column}</span>
                        <span className="text-xs text-slate-500">{idCol.reason}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">No explicit ID columns detected.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STATISTICS */}
        {activeTab === 'stats' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Descriptive Statistics (Numerical Variables)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="p-3">Variable</th>
                    <th className="p-3">Count</th>
                    <th className="p-3">Mean</th>
                    <th className="p-3">Std Dev</th>
                    <th className="p-3">Min</th>
                    <th className="p-3">25% (Q1)</th>
                    <th className="p-3">50% (Median)</th>
                    <th className="p-3">75% (Q3)</th>
                    <th className="p-3">Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.statistics.map(row => (
                    <tr key={row.variable} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{row.variable}</td>
                      <td className="p-3">{row.count}</td>
                      <td className="p-3">{row.mean}</td>
                      <td className="p-3">{row.std}</td>
                      <td className="p-3">{row.min}</td>
                      <td className="p-3">{row.q25}</td>
                      <td className="p-3 font-medium text-indigo-600">{row.q50}</td>
                      <td className="p-3">{row.q75}</td>
                      <td className="p-3">{row.max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VISUALIZATIONS */}
        {activeTab === 'charts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.visualizations.map((v, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">{v.title}</h3>
                {v.high_cardinality && (
                  <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                    High-cardinality categorical variable. Visualization limited to top categories.
                  </div>
                )}
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {v.type === 'bar' ? (
                      <BarChart data={v.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    ) : v.type === 'histogram' ? (
                      <BarChart data={v.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    ) : (
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x" name={v.var1} />
                        <YAxis dataKey="y" name={v.var2} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter data={v.data} fill="#8b5cf6" />
                      </ScatterChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CORRELATIONS */}
        {activeTab === 'correlations' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Pearson Correlation Analysis</h2>
              <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg mt-2 inline-block font-medium">
                Note: Correlation indicates linear relationship strength and does NOT imply causation.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="p-3">Variable 1</th>
                    <th className="p-3">Variable 2</th>
                    <th className="p-3">Pearson r</th>
                    <th className="p-3">Relationship Strength</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.correlations.map(c => {
                    const absR = Math.abs(c.correlation);
                    const strength = absR > 0.7 ? 'Strong' : absR > 0.4 ? 'Moderate' : 'Weak';
                    return (
                      <tr key={`${c.var1}-${c.var2}`}>
                        <td className="p-3 font-semibold text-slate-800">{c.var1}</td>
                        <td className="p-3 font-semibold text-slate-800">{c.var2}</td>
                        <td className="p-3 font-bold text-indigo-600">{c.correlation}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            absR > 0.7 ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {strength} ({c.correlation > 0 ? 'Positive' : 'Negative'})
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* OUTLIERS */}
        {activeTab === 'outliers' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Outlier Detection (IQR Method)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                  <tr>
                    <th className="p-3">Column</th>
                    <th className="p-3">Outlier Count</th>
                    <th className="p-3">Outlier %</th>
                    <th className="p-3">Valid IQR Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.outliers.map(o => (
                    <tr key={o.column}>
                      <td className="p-3 font-semibold text-slate-800">{o.column}</td>
                      <td className="p-3 text-rose-600 font-bold">{o.outlier_count}</td>
                      <td className="p-3">{o.outlier_percentage}%</td>
                      <td className="p-3 text-slate-500 text-xs">
                        [{o.lower_bound} to {o.upper_bound}]
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI INSIGHTS */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            {!insights ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
                <Sparkles className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Generate AI Insights</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                  Let AI interpret your statistical findings, highlight data quality issues, and provide actionable recommendations.
                </p>
                <button
                  onClick={onGenerateInsights}
                  disabled={insightsLoading}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition inline-flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {insightsLoading ? 'Analyzing dataset...' : 'Generate AI Insights'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
                  <h3 className="text-base font-bold text-indigo-600 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" /> Executive Summary
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed">{insights.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">Key Findings</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {insights.key_findings.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">Recommended Next Steps</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {insights.recommendations.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm">Conclusion</h3>
                  <p className="text-slate-700 text-sm">{insights.conclusion}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* REPORT SUMMARY */}
        {activeTab === 'report' && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-bold text-slate-900">Analytical Report Preview</h2>
              <p className="text-xs text-slate-500 mt-1">Ready for PDF Export</p>
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <h3 className="font-bold text-slate-900">1. Overview</h3>
                <p>{data.overview.rows} records across {data.overview.columns} attributes. {data.overview.missing_values} missing cells.</p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">2. Key Insights</h3>
                {insights ? (
                  <p>{insights.summary}</p>
                ) : (
                  <p className="text-slate-400 italic">Generate AI Insights to populate full report insights.</p>
                )}
              </div>

              <div>
                <h3 className="font-bold text-slate-900">3. Outliers & Quality</h3>
                <p>{data.outliers.length} numerical columns analyzed for IQR outliers.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={onGenerateReport}
                disabled={reportLoading}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF Report
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
