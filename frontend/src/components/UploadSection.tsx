import React, { useState } from 'react';
import { Upload, AlertCircle, Sparkles } from 'lucide-react';

interface UploadProps {
  onAnalyze: (file: File) => void;
  onTrySample: () => void;
  loading: boolean;
  error: string | null;
}

export const UploadSection: React.FC<UploadProps> = ({
  onAnalyze,
  onTrySample,
  loading,
  error
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onAnalyze(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onAnalyze(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4">
          Understand Your Data in Seconds.
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Upload a CSV dataset and get automatic statistics, visualizations, data-quality checks, and AI-powered insights.
        </p>
      </div>

      {/* Upload Box */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all bg-white shadow-sm ${
          dragActive ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-300 hover:border-indigo-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          disabled={loading}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-indigo-50 rounded-full text-indigo-600">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-800">
              Drag & drop your CSV file here, or browse
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Supports CSV files up to 25 MB
            </p>
          </div>

          <div className="flex items-center space-x-4 pt-2">
            <button
              type="button"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition pointer-events-none"
            >
              Select CSV File
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTrySample();
              }}
              className="relative z-10 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition flex items-center gap-2"
              disabled={loading}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Try Sample Dataset
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-rose-800">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Upload Error</p>
            <p className="text-sm mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Features Grid */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white border border-slate-200 rounded-xl">
          <div className="font-semibold text-slate-900 mb-1">Automatic Data Profiling</div>
          <p className="text-sm text-slate-600">Instantly inspect schema, missing values, duplicates, and data types.</p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-xl">
          <div className="font-semibold text-slate-900 mb-1">Smart Visualizations</div>
          <p className="text-sm text-slate-600">Histograms, box plots, scatter plots, and category bars generated automatically.</p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-xl">
          <div className="font-semibold text-slate-900 mb-1">AI-Powered Insights</div>
          <p className="text-sm text-slate-600">Get plain-English summaries, outlier warnings, and next-step recommendations.</p>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-400">
        Privacy Note: Uploaded datasets are processed in-session and are not permanently stored on the server.
      </div>
    </div>
  );
};
