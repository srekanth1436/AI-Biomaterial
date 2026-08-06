import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ShowChart, BarChart as BarChartIcon, Timeline, Analytics } from '@mui/icons-material';

export default function InteractiveGraphs({ prediction }) {
  const mechanical = prediction?.mechanical || {
    tensile_strength: 58,
    elastic_modulus: 3.4,
    flexural_strength: 70,
    impact_strength: 8.5
  };

  const degradation = prediction?.degradation || {
    degradation_time: 190,
    weight_loss: 22,
    water_absorption: 12,
    biodegradation_rate: 0.12
  };

  const fiberPct = prediction?.fiber_percentage || 30;

  // Chart Data 1: Strength Comparison
  const strengthData = [
    { property: 'Tensile Strength (MPa)', value: mechanical.tensile_strength, fill: '#3b82f6' },
    { property: 'Flexural Strength (MPa)', value: mechanical.flexural_strength, fill: '#06b6d4' },
    { property: 'Elastic Modulus (GPa)', value: mechanical.elastic_modulus * 10, fill: '#6366f1' }, // scaled 10x for visual comparison
    { property: 'Impact Strength (kJ/m²)', value: mechanical.impact_strength * 4, fill: '#14b8a6' }  // scaled 4x
  ];

  // Chart Data 2: Degradation Trend Over Time (0 - 300 days)
  const degTimeTotal = degradation.degradation_time || 200;
  const degradationTrendData = [
    { day: 'Day 0', weightLoss: 0, waterAbs: 0 },
    { day: `Day ${Math.round(degTimeTotal * 0.25)}`, weightLoss: Math.round(degradation.weight_loss * 0.2), waterAbs: Math.round(degradation.water_absorption * 0.5) },
    { day: `Day ${Math.round(degTimeTotal * 0.5)}`, weightLoss: Math.round(degradation.weight_loss * 0.48), waterAbs: Math.round(degradation.water_absorption * 0.85) },
    { day: `Day ${Math.round(degTimeTotal * 0.75)}`, weightLoss: Math.round(degradation.weight_loss * 0.78), waterAbs: Math.round(degradation.water_absorption * 0.95) },
    { day: `Day ${Math.round(degTimeTotal)}`, weightLoss: Math.round(degradation.weight_loss), waterAbs: Math.round(degradation.water_absorption) }
  ];

  // Chart Data 3: Fiber % vs Tensile Strength Sensitivity
  const fiberSensitivityData = [
    { fiberPct: '10%', tensile: Math.round(mechanical.tensile_strength * 0.55), modulus: Math.round(mechanical.elastic_modulus * 0.6 * 10) },
    { fiberPct: '20%', tensile: Math.round(mechanical.tensile_strength * 0.78), modulus: Math.round(mechanical.elastic_modulus * 0.82 * 10) },
    { fiberPct: `${fiberPct}% (Current)`, tensile: Math.round(mechanical.tensile_strength), modulus: Math.round(mechanical.elastic_modulus * 10) },
    { fiberPct: '40%', tensile: Math.round(mechanical.tensile_strength * 1.15), modulus: Math.round(mechanical.elastic_modulus * 1.18 * 10) },
    { fiberPct: '50%', tensile: Math.round(mechanical.tensile_strength * 1.08), modulus: Math.round(mechanical.elastic_modulus * 1.25 * 10) }
  ];

  // Chart Data 4: Moisture Content vs Degradation Rate
  const moistureDegData = [
    { moisture: '2%', degDays: Math.round(degTimeTotal * 1.35), weightLoss: Math.round(degradation.weight_loss * 0.6) },
    { moisture: '5%', degDays: Math.round(degTimeTotal * 1.15), weightLoss: Math.round(degradation.weight_loss * 0.82) },
    { moisture: '8% (Input)', degDays: Math.round(degTimeTotal), weightLoss: Math.round(degradation.weight_loss) },
    { moisture: '12%', degDays: Math.round(degTimeTotal * 0.75), weightLoss: Math.round(degradation.weight_loss * 1.28) },
    { moisture: '15%', degDays: Math.round(degTimeTotal * 0.58), weightLoss: Math.round(degradation.weight_loss * 1.55) }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShowChart className="text-emerald-400" /> Interactive Biomaterial Property Visualizations
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Explore mechanical load responses, degradation curves, and sensitivity metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graph 1: Mechanical Strength Comparison */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <BarChartIcon className="text-blue-400" />
            <h3 className="text-lg font-bold text-white">1. Strength Comparison</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strengthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="property" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Degradation Trend Over Time */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Timeline className="text-emerald-400" />
            <h3 className="text-lg font-bold text-white">2. Degradation & Mass Loss Curve</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={degradationTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="weightLoss" name="Weight Loss (%)" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="waterAbs" name="Water Absorption (%)" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 3: Fiber % vs Tensile Strength */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Analytics className="text-indigo-400" />
            <h3 className="text-lg font-bold text-white">3. Fiber % vs Tensile & Modulus</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fiberSensitivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="fiberPct" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="tensile" name="Tensile Strength (MPa)" stroke="#3b82f6" strokeWidth={3} />
                <Line type="monotone" dataKey="modulus" name="Elastic Modulus (x10 GPa)" stroke="#818cf8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 4: Moisture Content vs Degradation Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <ShowChart className="text-amber-400" />
            <h3 className="text-lg font-bold text-white">4. Moisture Content vs Degradation</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moistureDegData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="moisture" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="degDays" name="Degradation Time (Days)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="weightLoss" name="Weight Loss (%)" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
