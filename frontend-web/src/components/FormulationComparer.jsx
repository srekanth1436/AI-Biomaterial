import React, { useState } from 'react';
import { CompareArrows, Bolt, CheckCircle, Science, Speed, Timer } from '@mui/icons-material';

export default function FormulationComparer() {
  const [formA, setFormA] = useState({
    polymer_type: 'PLA',
    natural_fiber: 'Bamboo',
    fiber_percentage: 30,
    molecular_weight: 150000,
    moisture_content: 8.0,
    ph: 7.4,
    temperature: 37,
    density: 1.25
  });

  const [formB, setFormB] = useState({
    polymer_type: 'Chitosan',
    natural_fiber: 'Hemp',
    fiber_percentage: 25,
    molecular_weight: 120000,
    moisture_content: 6.5,
    ph: 6.8,
    temperature: 37,
    density: 1.30
  });

  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data_a: formA,
          data_b: formB
        })
      });
      if (res.ok) {
        const data = await res.json();
        setComparison(data);
      } else {
        throw new Error('API Error');
      }
    } catch (e) {
      // Fallback comparison calculations
      const tA = (20 + (formA.molecular_weight / 10000) + (formA.fiber_percentage * 0.8) - (formA.moisture_content * 1.2));
      const tB = (20 + (formB.molecular_weight / 10000) + (formB.fiber_percentage * 0.8) - (formB.moisture_content * 1.2));
      const dA = (365 - (formA.fiber_percentage * 1.8) - (formA.moisture_content * 4.5));
      const dB = (365 - (formB.fiber_percentage * 1.8) - (formB.moisture_content * 4.5));

      setComparison({
        formulation_a: {
          polymer_type: formA.polymer_type,
          natural_fiber: formA.natural_fiber,
          fiber_percentage: formA.fiber_percentage,
          mechanical: { tensile_strength: tA.toFixed(2), elastic_modulus: (formA.density * 1.8).toFixed(2) },
          degradation: { degradation_time: dA.toFixed(1), weight_loss: (100 * (180 / dA)).toFixed(2) }
        },
        formulation_b: {
          polymer_type: formB.polymer_type,
          natural_fiber: formB.natural_fiber,
          fiber_percentage: formB.fiber_percentage,
          mechanical: { tensile_strength: tB.toFixed(2), elastic_modulus: (formB.density * 1.8).toFixed(2) },
          degradation: { degradation_time: dB.toFixed(1), weight_loss: (100 * (180 / dB)).toFixed(2) }
        },
        comparison: {
          tensile_delta_mpa: (tB - tA).toFixed(2),
          tensile_delta_pct: (((tB - tA) / tA) * 100).toFixed(1),
          stronger_formulation: tB > tA ? "B" : "A",
          degradation_delta_days: (dB - dA).toFixed(1),
          longer_lasting_formulation: dB > dA ? "B" : "A"
        }
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
            <CompareArrows className="text-emerald-400" /> Side-by-Side Formulation Comparer
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Compare two biomaterial formulation matrices side-by-side to evaluate mechanical load and resorption deltas.
          </p>
        </div>
      </div>

      {/* Input Selection Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulation A */}
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <Science /> Formulation Matrix A
            </h3>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/40">
              Primary Selection
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs font-bold block mb-1">Polymer Matrix</label>
              <select
                value={formA.polymer_type}
                onChange={(e) => setFormA({ ...formA, polymer_type: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 text-sm focus:border-emerald-500"
              >
                <option value="PLA">PLA</option>
                <option value="Chitosan">Chitosan</option>
                <option value="PHBV">PHBV</option>
                <option value="PCL">PCL</option>
                <option value="Starch">Starch</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs font-bold block mb-1">Natural Fiber</label>
              <select
                value={formA.natural_fiber}
                onChange={(e) => setFormA({ ...formA, natural_fiber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 text-sm focus:border-emerald-500"
              >
                <option value="Bamboo">Bamboo</option>
                <option value="Hemp">Hemp</option>
                <option value="Flax">Flax</option>
                <option value="Jute">Jute</option>
                <option value="Sisal">Sisal</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
              <span>Fiber Load Percentage</span>
              <span className="text-emerald-400">{formA.fiber_percentage}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              value={formA.fiber_percentage}
              onChange={(e) => setFormA({ ...formA, fiber_percentage: parseFloat(e.target.value) })}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>

        {/* Formulation B */}
        <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
              <Science /> Formulation Matrix B
            </h3>
            <span className="bg-cyan-500/20 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/40">
              Challenger Selection
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs font-bold block mb-1">Polymer Matrix</label>
              <select
                value={formB.polymer_type}
                onChange={(e) => setFormB({ ...formB, polymer_type: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 text-sm focus:border-cyan-500"
              >
                <option value="Chitosan">Chitosan</option>
                <option value="PLA">PLA</option>
                <option value="PHBV">PHBV</option>
                <option value="PCL">PCL</option>
                <option value="Starch">Starch</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs font-bold block mb-1">Natural Fiber</label>
              <select
                value={formB.natural_fiber}
                onChange={(e) => setFormB({ ...formB, natural_fiber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 text-sm focus:border-cyan-500"
              >
                <option value="Hemp">Hemp</option>
                <option value="Bamboo">Bamboo</option>
                <option value="Flax">Flax</option>
                <option value="Jute">Jute</option>
                <option value="Sisal">Sisal</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
              <span>Fiber Load Percentage</span>
              <span className="text-cyan-400">{formB.fiber_percentage}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              value={formB.fiber_percentage}
              onChange={(e) => setFormB({ ...formB, fiber_percentage: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Compare Button */}
      <button
        onClick={handleCompare}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-lg rounded-2xl shadow-xl hover:brightness-110 transition flex items-center justify-center gap-2"
      >
        <Bolt /> {loading ? 'Evaluating Formulations...' : 'Run Side-by-Side Benchmark Comparison'}
      </button>

      {/* Comparison Results Output */}
      {comparison && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-fadeIn">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle className="text-emerald-400" /> Benchmark Comparison Analysis
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form A Outcome */}
            <div className="bg-slate-950/80 border border-emerald-500/20 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-emerald-400 font-bold text-sm">Matrix A ({comparison.formulation_a.polymer_type} + {comparison.formulation_a.natural_fiber})</span>
                {comparison.comparison.stronger_formulation === 'A' && (
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full">★ Stronger</span>
                )}
              </div>
              <div className="text-2xl font-black text-white">{comparison.formulation_a.mechanical?.tensile_strength} MPa</div>
              <div className="text-slate-400 text-xs">Degradation: {comparison.formulation_a.degradation?.degradation_time} Days</div>
            </div>

            {/* Form B Outcome */}
            <div className="bg-slate-950/80 border border-cyan-500/20 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-cyan-400 font-bold text-sm">Matrix B ({comparison.formulation_b.polymer_type} + {comparison.formulation_b.natural_fiber})</span>
                {comparison.comparison.stronger_formulation === 'B' && (
                  <span className="bg-cyan-500/20 text-cyan-400 text-xs font-bold px-2.5 py-0.5 rounded-full">★ Stronger</span>
                )}
              </div>
              <div className="text-2xl font-black text-white">{comparison.formulation_b.mechanical?.tensile_strength} MPa</div>
              <div className="text-slate-400 text-xs">Degradation: {comparison.formulation_b.degradation?.degradation_time} Days</div>
            </div>
          </div>

          {/* Delta Summary */}
          <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="text-slate-300 text-sm font-semibold">Tensile Strength Difference:</span>
            <span className={`text-base font-black ${comparison.comparison.tensile_delta_mpa >= 0 ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {comparison.comparison.tensile_delta_mpa >= 0 ? `+${comparison.comparison.tensile_delta_mpa} MPa (${comparison.comparison.tensile_delta_pct}%)` : `${comparison.comparison.tensile_delta_mpa} MPa (${comparison.comparison.tensile_delta_pct}%)`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
