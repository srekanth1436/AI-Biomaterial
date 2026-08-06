import React, { useState, useEffect } from 'react';
import { Science, Verified, Speed, AutoAwesome, Timeline, Storage, Assessment } from '@mui/icons-material';

export default function Dashboard({ onNavigateToPredict, onNavigateToHistory }) {
  const [totalPredictionsCount, setTotalPredictionsCount] = useState(0);
  const [sampleDatasetCount, setSampleDatasetCount] = useState(2500);

  useEffect(() => {
    // Fetch live total prediction records from MySQL database
    fetch('http://localhost:8000/predictions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTotalPredictionsCount(data.length);
        }
      })
      .catch(err => {
        console.log('Backend offline or fetching local history count');
        const localHist = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
        setTotalPredictionsCount(localHist.length);
      });
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <AutoAwesome className="text-xs" /> Production AI Inference Engine Active
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            AI-Enabled Prediction of Mechanical & Degradation Properties
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Predict tensile strength, elastic modulus, degradation rates, and weight loss of natural biomaterial composites before physical laboratory manufacturing.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onNavigateToPredict}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Science /> Start New Prediction
            </button>
            <button
              onClick={onNavigateToHistory}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Timeline /> View History Database
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Science />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Predictions</p>
            <p className="text-2xl font-black text-white">{totalPredictionsCount}</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Verified />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Model R² Accuracy</p>
            <p className="text-2xl font-black text-blue-400">0.984 <span className="text-xs text-slate-400">(98.4%)</span></p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Speed />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Inference Time</p>
            <p className="text-2xl font-black text-white">12 ms</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Storage />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Training Dataset</p>
            <p className="text-2xl font-black text-white">{sampleDatasetCount.toLocaleString()} Samples</p>
          </div>
        </div>
      </div>

      {/* Relatable Use Cases Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Assessment className="text-emerald-400" /> Biomedical & Biomaterial Target Applications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
            <span className="bg-blue-500/10 text-blue-400 text-xs px-2.5 py-1 rounded-md font-bold">Orthopedic Scaffolds</span>
            <h4 className="text-base font-bold text-white">Bone Screws & Structural Fixation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Requires high tensile strength (&gt; 50 MPa) and long degradation period (180–365 days) for load bearing.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-md font-bold">Tissue Engineering</span>
            <h4 className="text-base font-bold text-white">Wound Healing & Matrix Dressings</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Requires high water absorption and fast to moderate degradation (30–90 days) for cell infiltration.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
            <span className="bg-purple-500/10 text-purple-400 text-xs px-2.5 py-1 rounded-md font-bold">Controlled Drug Release</span>
            <h4 className="text-base font-bold text-white">Biodegradable Nanoparticles & Films</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fine-tuned degradation kinetics for controlled molecular release over specific daily timeframes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
