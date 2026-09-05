import React, { useState } from 'react';
import { UploadSection } from './components/UploadSection';
import { Dashboard } from './components/Dashboard';
import type { AnalysisData, AIInsights } from './types';

export const App: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (file: File) => {
    setLoading(true);
    setError(null);
    setInsights(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const resp = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ detail: 'Failed to analyze file' }));
        throw new Error(errData.detail || 'Failed to analyze CSV file.');
      }

      const data: AnalysisData = await resp.json();
      setAnalysisData(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during dataset analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrySample = async () => {
    setLoading(true);
    setError(null);
    setInsights(null);

    try {
      const sampleResp = await fetch('/sample_sales.csv');
      let blob: Blob;
      if (sampleResp.ok) {
        blob = await sampleResp.blob();
      } else {
        throw new Error('Sample dataset file not found.');
      }

      const sampleFile = new File([blob], 'sample_sales.csv', { type: 'text/csv' });
      await handleAnalyze(sampleFile);
    } catch (err: any) {
      setError(err.message || 'Failed to load sample dataset.');
      setLoading(false);
    }
  };

  const handleGenerateInsights = async () => {
    if (!analysisData) return;
    setInsightsLoading(true);

    try {
      const resp = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis: analysisData }),
      });

      if (!resp.ok) {
        throw new Error('Failed to generate AI insights.');
      }

      const res: AIInsights = await resp.json();
      setInsights(res);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch AI insights.');
    } finally {
      setInsightsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!analysisData) return;
    setReportLoading(true);

    try {
      const fallbackInsights: AIInsights = insights || {
        summary: `Dataset ${analysisData.filename} analysis report.`,
        key_findings: ['Automatic exploratory profiling completed.'],
        data_quality: ['No critical corruptions detected.'],
        recommendations: ['Perform further targeted hypotheses testing.'],
        conclusion: 'Automated statistical summary complete.'
      };

      const resp = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: analysisData.filename,
          analysis: analysisData,
          insights: fallbackInsights
        }),
      });

      if (!resp.ok) {
        throw new Error('Failed to generate PDF report.');
      }

      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${analysisData.filename}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      alert(err.message || 'Failed to download report.');
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {analysisData ? (
        <Dashboard
          data={analysisData}
          insights={insights}
          onGenerateInsights={handleGenerateInsights}
          onGenerateReport={handleGenerateReport}
          onBack={() => setAnalysisData(null)}
          insightsLoading={insightsLoading}
          reportLoading={reportLoading}
        />
      ) : (
        <UploadSection
          onAnalyze={handleAnalyze}
          onTrySample={handleTrySample}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default App;
