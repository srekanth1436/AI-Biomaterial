import React, { useState } from 'react';
import { AutoAwesome, CheckCircle, ArrowForward } from '@mui/icons-material';

const USE_CASES = [
  { id: 'orthopedic', name: 'Orthopedic Bone Screws & Structural Fixation', icon: '🦴', tag: 'High Mechanical Load' },
  { id: 'scaffold', name: 'Tissue Engineering Scaffolds', icon: '🧫', tag: 'Cell Adhesion & Porosity' },
  { id: 'wound', name: 'Wound Care Patches & Barrier Membranes', icon: '🩹', tag: 'Antibacterial & Flexibility' },
  { id: 'drug', name: 'Controlled Drug Delivery Matrices', icon: '💊', tag: 'Sustained Resorption' },
  { id: 'packaging', name: 'Eco-Friendly Biodegradable Bioplastics', icon: '🌱', tag: 'Rapid Soil Degradation' },
];

export default function UseCaseRecommender() {
  const [selectedUseCase, setSelectedUseCase] = useState('orthopedic');
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchRecommendation = async (useCaseId) => {
    setSelectedUseCase(useCaseId);
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/recommendations/${useCaseId}`);
      if (res.ok) {
        const data = await res.json();
        setRecommendation(data);
      }
    } catch (e) {
      // Fallback response
      setRecommendation({
        use_case: "Orthopedic Bone Screws & Structural Fixation",
        recommended_polymer: "PLA / PLLA",
        recommended_fiber: "Bamboo",
        optimal_fiber_ratio: "30% - 35%",
        target_tensile_range: "65 - 85 MPa",
        target_degradation_range: "250 - 365 Days",
        biocompatibility_index: "A+",
        rationale: "High tensile strength matrix reinforced with oriented bamboo microfibers provides maximum load support while resorbing slowly during bone healing."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <AutoAwesome className="text-emerald-400" /> AI Medical & Industrial Use-Case Recommender
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Select a target clinical or commercial application to receive AI-optimized biopolymer matrix & natural fiber recommendations.
          </p>
        </div>
      </div>

      {/* Target Application Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {USE_CASES.map((uc) => (
          <button
            key={uc.id}
            onClick={() => handleFetchRecommendation(uc.id)}
            className={`p-5 rounded-2xl border text-left transition flex flex-col justify-between space-y-3 cursor-pointer ${
              selectedUseCase === uc.id
                ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{uc.icon}</span>
              <span className="bg-slate-800 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
                {uc.tag}
              </span>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm leading-snug">{uc.name}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* Recommendation Output Card */}
      {recommendation && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs text-emerald-400 font-bold tracking-wider uppercase">AI Recommendation Engine Output</span>
              <h3 className="text-xl font-bold text-white mt-0.5">{recommendation.use_case}</h3>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle className="text-sm" /> Biocompatibility Rating: {recommendation.biocompatibility_index}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-1">
              <span className="text-slate-400 text-xs font-semibold">Recommended Polymer</span>
              <div className="text-white font-bold text-base">{recommendation.recommended_polymer}</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-1">
              <span className="text-slate-400 text-xs font-semibold">Recommended Fiber</span>
              <div className="text-white font-bold text-base">{recommendation.recommended_fiber}</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-1">
              <span className="text-slate-400 text-xs font-semibold">Optimal Fiber Ratio</span>
              <div className="text-emerald-400 font-bold text-base">{recommendation.optimal_fiber_ratio}</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-1">
              <span className="text-slate-400 text-xs font-semibold">Target Tensile Range</span>
              <div className="text-cyan-400 font-bold text-base">{recommendation.target_tensile_range}</div>
            </div>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Scientific Rationale & Mechanics</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{recommendation.rationale}</p>
          </div>
        </div>
      )}
    </div>
  );
}
