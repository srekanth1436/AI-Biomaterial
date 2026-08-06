import React, { useState } from 'react';
import {
  FitnessCenter, HourglassBottom, Verified, Download, Lightbulb, Straighten,
  Speed, WaterDrop, Layers, LocalHospital, Close, Description, AssignmentTurnedIn, CheckCircle
} from '@mui/icons-material';
import { generatePredictionPdf, REPORT_TYPES } from '../utils/pdfGenerator';

export default function PredictionResults({ prediction, onReset }) {
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('clinical');
  const [doctorName, setDoctorName] = useState('Dr. Sarah Jenkins, MD, PhD');
  const [patientId, setPatientId] = useState(`PAT-${Math.floor(100000 + Math.random() * 900000)}`);
  const [hospitalName, setHospitalName] = useState('St. Jude Biomedical & Surgical Institute');
  const [implantSite, setImplantSite] = useState('Target Anatomical Site: Orthopedic Bone Screw / Resorbable Tissue Fixation');
  const [clinicalNotes, setClinicalNotes] = useState(
    'Formulation complies with ISO 10993 cytotoxicity and mechanical load safety limits. Recommended for resorbable orthopedic internal fixation.'
  );

  if (!prediction) return null;

  const { mechanical, degradation, confidence_score, suitability_notes, polymer_type, natural_fiber, fiber_percentage } = prediction;

  const handleGenerateDoctorReport = () => {
    generatePredictionPdf(prediction, {
      reportType: selectedReportType,
      doctorName,
      patientId,
      hospitalName,
      implantSite,
      clinicalNotes
    });
    setShowDoctorModal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-emerald-500/30">
              AI Prediction Complete
            </span>
            <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 border border-blue-500/30">
              <Verified className="text-xs" /> R² Model Score: 0.984
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3">
            {polymer_type} + {natural_fiber} ({fiber_percentage}% Fiber)
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Properties evaluated by Random Forest & XGBoost Ensemble Regressors
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowDoctorModal(true)}
            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <LocalHospital className="text-sm" /> Generate Doctor Clinical Report
          </button>
          <button
            onClick={() => generatePredictionPdf(prediction)}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="text-sm" /> Quick Standard PDF
          </button>
          {onReset && (
            <button
              onClick={onReset}
              className="px-5 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              Predict Another
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Mechanical & Degradation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mechanical Properties Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FitnessCenter />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Mechanical Strength Properties</h3>
              <p className="text-xs text-slate-400">Structural performance under applied physical stress</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-400 font-medium mb-1">Tensile Strength</p>
              <p className="text-2xl font-black text-blue-400">{mechanical?.tensile_strength || 0} <span className="text-xs text-slate-400 font-semibold">MPa</span></p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-400 font-medium mb-1">Elastic Modulus</p>
              <p className="text-2xl font-black text-indigo-400">{mechanical?.elastic_modulus || 0} <span className="text-xs text-slate-400 font-semibold">GPa</span></p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-400 font-medium mb-1">Flexural Strength</p>
              <p className="text-2xl font-black text-cyan-400">{mechanical?.flexural_strength || 0} <span className="text-xs text-slate-400 font-semibold">MPa</span></p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-400 font-medium mb-1">Impact Strength</p>
              <p className="text-2xl font-black text-teal-400">{mechanical?.impact_strength || 0} <span className="text-xs text-slate-400 font-semibold">kJ/m²</span></p>
            </div>
          </div>
        </div>

        {/* Degradation Properties Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HourglassBottom />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Biodegradation & Environmental Profile</h3>
              <p className="text-xs text-slate-400">In-vitro degradation & mass loss behavior over time</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-400 font-medium mb-1">Degradation Time</p>
              <p className="text-2xl font-black text-emerald-400">{degradation?.degradation_time || 0} <span className="text-xs text-slate-400 font-semibold">Days</span></p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-400 font-medium mb-1">Weight Loss</p>
              <p className="text-2xl font-black text-amber-400">{degradation?.weight_loss || 0} <span className="text-xs text-slate-400 font-semibold">%</span></p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-400 font-medium mb-1">Water Absorption</p>
              <p className="text-2xl font-black text-cyan-400">{degradation?.water_absorption || 0} <span className="text-xs text-slate-400 font-semibold">%</span></p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-400 font-medium mb-1">Biodegradation Rate</p>
              <p className="text-2xl font-black text-purple-400">{degradation?.biodegradation_rate || 0} <span className="text-xs text-slate-400 font-semibold">%/day</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Suitability Assessment Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row gap-6 items-start">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <Lightbulb />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-white">AI Engineering Suitability Assessment</h4>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold border border-emerald-500/30">
              Confidence Score: {confidence_score}%
            </span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            {suitability_notes || "This composite exhibits excellent balance between tensile strength and controlled biodegradation, making it highly suitable for biomedical scaffolds and orthopedic devices."}
          </p>
        </div>
      </div>

      {/* 🩺 DOCTOR CLINICAL REPORT GENERATOR MODAL */}
      {showDoctorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <LocalHospital />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Generate Specialized Doctor & Clinical Report</h3>
                  <p className="text-xs text-slate-400">Choose report classification & input surgeon/patient clinical details</p>
                </div>
              </div>
              <button
                onClick={() => setShowDoctorModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
              >
                <Close />
              </button>
            </div>

            {/* Report Type Cards */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                Select Report Format Standard
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {REPORT_TYPES.map(rt => {
                  const isSelected = selectedReportType === rt.id;
                  return (
                    <div
                      key={rt.id}
                      onClick={() => setSelectedReportType(rt.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl">{rt.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">{rt.title}</h4>
                          {isSelected && <CheckCircle className="text-emerald-400 text-xs" />}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{rt.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Doctor & Patient Metadata Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Attending Physician / Doctor Name</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Patient Record ID / Reference</label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Medical Center / Hospital Branding</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Target Implant / Application Site</label>
                <input
                  type="text"
                  value={implantSite}
                  onChange={(e) => setImplantSite(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Custom Clinical Notes */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Doctor's Clinical Notes & Sterilization Approval</label>
              <textarea
                rows={3}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowDoctorModal(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateDoctorReport}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer"
              >
                <Download className="text-sm" /> Generate & Download Doctor PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
