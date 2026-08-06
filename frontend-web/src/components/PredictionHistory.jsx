import React, { useState, useEffect } from 'react';
import { History, Search, Download, Visibility, Science, FilterList, Refresh } from '@mui/icons-material';
import { generatePredictionPdf } from '../utils/pdfGenerator';

export default function PredictionHistory({ onSelectPrediction }) {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPolymer, setSelectedPolymer] = useState('ALL');
  const [selectedPrediction, setSelectedPrediction] = useState(null);

  const fetchHistory = async () => {
    // 1. Instant Cache Load
    try {
      const cached = localStorage.getItem('cached_web_history');
      if (cached) {
        setPredictions(JSON.parse(cached));
        setLoading(false);
      }
    } catch (_) {}

    // 2. Background Fast Fetch with 1.5s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    try {
      const response = await fetch('http://localhost:8000/predictions');
      if (response.ok) {
        const data = await response.json();
        setPredictions(data);
        localStorage.setItem('cached_web_history', JSON.stringify(data));
      }
    } catch (e) {
      console.error("Backend error loading prediction history", e);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredPredictions = predictions.filter(p => {
    const matchesSearch = p.polymer_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.natural_fiber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPolymer = selectedPolymer === 'ALL' || p.polymer_type.toUpperCase() === selectedPolymer;
    return matchesSearch && matchesPolymer;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="text-emerald-400" /> Biomaterial Prediction History
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Browse, search, and download PDF reports for all previous material evaluations.
          </p>
        </div>
        <button
          onClick={fetchHistory}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 self-start cursor-pointer"
        >
          <Refresh className="text-sm" /> Refresh DB
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3.5 top-3.5 text-slate-500 text-sm" />
          <input
            type="text"
            placeholder="Search by polymer type (PLA, Chitosan) or natural fiber (Bamboo, Hemp)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedPolymer}
            onChange={e => setSelectedPolymer(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Polymer Types</option>
            <option value="PLA">PLA Matrix</option>
            <option value="CHITOSAN">Chitosan Matrix</option>
            <option value="PHBV">PHBV Matrix</option>
            <option value="PCL">PCL Matrix</option>
            <option value="STARCH">Starch Matrix</option>
          </select>
        </div>
      </div>

      {/* Predictions Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Record ID</th>
                <th className="px-6 py-4">Evaluator / Logged-in User</th>
                <th className="px-6 py-4">Material Composition</th>
                <th className="px-6 py-4">Tensile Strength</th>
                <th className="px-6 py-4">Degradation Time</th>
                <th className="px-6 py-4">Weight Loss</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-500">
                    Loading prediction history from database...
                  </td>
                </tr>
              ) : filteredPredictions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-500">
                    No prediction records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredPredictions.map((pred) => (
                  <tr key={pred.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">#BIO-{pred.id}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-white text-xs block">{pred.user_name || 'Registered Researcher'}</span>
                      <span className="text-[11px] text-emerald-400 font-mono block">{pred.user_email || 'researcher@biomaterial.ai'}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {pred.polymer_type} + {pred.natural_fiber}
                      <span className="block text-xs font-normal text-slate-400">{pred.fiber_percentage}% Fiber | {pred.molecular_weight} g/mol</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-blue-400">
                      {pred.mechanical?.tensile_strength || 0} MPa
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">
                      {pred.degradation?.degradation_time || 0} Days
                    </td>
                    <td className="px-6 py-4 text-amber-400">
                      {pred.degradation?.weight_loss || 0}%
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/20">
                        {pred.confidence_score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedPrediction(pred)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition-all cursor-pointer"
                        title="View Detailed Report"
                      >
                        <Visibility className="text-xs" /> View
                      </button>
                      <button
                        onClick={() => generatePredictionPdf(pred)}
                        className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs rounded-lg border border-emerald-500/30 font-semibold transition-all cursor-pointer"
                        title="Download PDF Report"
                      >
                        <Download className="text-xs" /> PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Modal View */}
      {selectedPrediction && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Science className="text-emerald-400" /> Prediction Report #BIO-{selectedPrediction.id}
              </h3>
              <button
                onClick={() => setSelectedPrediction(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-800/50 p-3 rounded-xl">
                <p className="text-xs text-slate-400">Polymer Matrix</p>
                <p className="font-bold text-white">{selectedPrediction.polymer_type}</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl">
                <p className="text-xs text-slate-400">Natural Fiber</p>
                <p className="font-bold text-white">{selectedPrediction.natural_fiber} ({selectedPrediction.fiber_percentage}%)</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl">
                <p className="text-xs text-slate-400">Tensile Strength</p>
                <p className="font-bold text-blue-400">{selectedPrediction.mechanical?.tensile_strength} MPa</p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl">
                <p className="text-xs text-slate-400">Degradation Time</p>
                <p className="font-bold text-emerald-400">{selectedPrediction.degradation?.degradation_time} Days</p>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl space-y-1">
              <p className="text-xs text-slate-400 font-bold">Suitability Recommendation</p>
              <p className="text-slate-300 text-xs leading-relaxed">{selectedPrediction.suitability_notes}</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => generatePredictionPdf(selectedPrediction)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="text-sm" /> Download PDF Report
              </button>
              <button
                onClick={() => setSelectedPrediction(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
