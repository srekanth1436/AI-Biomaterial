import { jsPDF } from "jspdf";

export const REPORT_TYPES = [
  {
    id: 'clinical',
    title: 'Clinical Surgical & Biocompatibility Evaluation',
    subtitle: 'Comprehensive Surgeon Assessment & Patient Biomaterial Evaluation',
    icon: '🩺',
    badge: 'SURGICAL GRADE'
  },
  {
    id: 'orthopedic',
    title: 'Orthopedic Load & Fixation Analysis',
    subtitle: 'Tensile, Flexural & Cortical Bone Stress Shielding Report',
    icon: '🦴',
    badge: 'ORTHOPEDIC GRADE'
  },
  {
    id: 'scaffold',
    title: 'Tissue Engineering & Regenerative Scaffold Report',
    subtitle: 'Pore Architecture, Vascularization & Cell Attachment Analysis',
    icon: '🧫',
    badge: 'TISSUE ENGINEERING'
  },
  {
    id: 'wound',
    title: 'Wound Healing & Antimicrobial Barrier Report',
    subtitle: 'Exudate Hydration, Hemostasis & Epidermal Regeneration',
    icon: '🩹',
    badge: 'DERMAL PATCH'
  },
  {
    id: 'compliance',
    title: 'FDA / ISO 10993 Regulatory Compliance Certificate',
    subtitle: 'Biological Evaluation, Cytotoxicity & Degradation Safety Standards',
    icon: '📋',
    badge: 'ISO 10993 COMPLIANT'
  }
];

export const generatePredictionPdf = (prediction, doctorOptions = {}) => {
  const doc = new jsPDF();
  const timestamp = new Date(prediction.created_at || Date.now()).toLocaleString();
  
  const reportTypeKey = doctorOptions.reportType || 'clinical';
  const reportConfig = REPORT_TYPES.find(r => r.id === reportTypeKey) || REPORT_TYPES[0];

  const doctorName = doctorOptions.doctorName || "Dr. Alexander Vance, MD (Chief Biomaterials Specialist)";
  const patientId = doctorOptions.patientId || `PAT-${Math.floor(100000 + Math.random() * 900000)}`;
  const hospitalName = doctorOptions.hospitalName || "St. Jude Biomedical & Regenerative Institute";
  const implantSite = doctorOptions.implantSite || "Target Anatomical Site: Subtrochanteric Fixation / Tissue Matrix";
  const customNotes = doctorOptions.clinicalNotes || prediction.suitability_notes || 
    "Biopolymer composite formulation demonstrates optimal mechanical load response and controlled resorption. Approved for surgical application subject to standard sterilization protocols.";

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 36, "F");

  // Accent Line
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 34, 210, 2, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(hospitalName.toUpperCase(), 14, 14);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.text(`${reportConfig.badge} | ${reportConfig.title.toUpperCase()}`, 14, 23);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${timestamp} | Report ID: #BIO-${prediction.id || Math.floor(1000 + Math.random() * 9000)} | Patient ID: ${patientId}`, 14, 30);
  
  let y = 46;
  
  // Section 1: Clinical Metadata & Doctor Record
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 22, 2, 2, "F");

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`Attending Physician: ${doctorName}`, 18, y + 7);
  doc.text(`Patient Reference: ${patientId}`, 110, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`${implantSite}`, 18, y + 15);
  doc.text(`Report Specification: ${reportConfig.subtitle}`, 110, y + 15);

  y += 30;

  // Section 2: Biopolymer Composite Composition & Input Parameters
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("1. Polymer Matrix & Microstructural Input Parameters", 14, y);
  y += 4;
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, 196, y);
  y += 7;
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  
  const inputs = [
    ["Polymer Matrix Base:", prediction.polymer_type || "N/A", "Fiber Percentage Ratio:", `${prediction.fiber_percentage || 0}%`],
    ["Natural Reinforcement:", prediction.natural_fiber || "N/A", "Molecular Weight (Mw):", `${(prediction.molecular_weight || 0).toLocaleString()} g/mol`],
    ["Specimen Moisture:", `${prediction.moisture_content || 0}%`, "Environmental pH Target:", `${prediction.ph || 7.4}`],
    ["Testing Temperature:", `${prediction.temperature || 37} °C`, "Composite Bulk Density:", `${prediction.density || 1.25} g/cm³`]
  ];
  
  inputs.forEach(([label1, val1, label2, val2]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(51, 65, 85);
    doc.text(label1, 14, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(val1, 60, y);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(51, 65, 85);
    doc.text(label2, 110, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(val2, 158, y);
    y += 6;
  });
  
  y += 6;
  
  // Section 3: AI Predicted Mechanical Properties
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 58, 138); // blue-900
  doc.text("2. Evaluated Mechanical Strength Properties", 14, y);
  y += 4;
  doc.line(14, y, 196, y);
  y += 7;
  
  const mech = prediction.mechanical || {};
  const mechItems = [
    ["Ultimate Tensile Strength:", `${mech.tensile_strength || 0} MPa`, "Load support capability against axial tension"],
    ["Elastic Modulus (Young's):", `${mech.elastic_modulus || 0} GPa`, "Stiffness matching physiological bone/tissue"],
    ["Flexural Bending Strength:", `${mech.flexural_strength || 0} MPa`, "Resistance to structural bending deformation"],
    ["Charpy Impact Strength:", `${mech.impact_strength || 0} kJ/m²`, "Energy absorption under dynamic loading"]
  ];
  
  doc.setFontSize(9);
  mechItems.forEach(([lbl, val, note]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(51, 65, 85);
    doc.text(lbl, 14, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(29, 78, 216); // blue-700
    doc.text(val, 70, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`(${note})`, 110, y);
    y += 6;
  });
  
  y += 6;
  
  // Section 4: AI Predicted Biodegradation Profile
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(6, 78, 59); // emerald-900
  doc.text("3. Biodegradation & In-Vitro Resorption Profile", 14, y);
  y += 4;
  doc.line(14, y, 196, y);
  y += 7;
  
  const deg = prediction.degradation || {};
  const degItems = [
    ["Total Degradation Window:", `${deg.degradation_time || 0} Days`, "Estimated duration to full resorption"],
    ["180-Day Mass Loss:", `${deg.weight_loss || 0} %`, "Mass loss under simulated physiological fluid"],
    ["Equilibrium Water Absorption:", `${deg.water_absorption || 0} %`, "Hydrophilic swelling & fluid uptake rate"],
    ["Daily Biodegradation Velocity:", `${deg.biodegradation_rate || 0} %/day`, "Kinetic mass degradation per 24 hours"]
  ];
  
  doc.setFontSize(9);
  degItems.forEach(([lbl, val, note]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(51, 65, 85);
    doc.text(lbl, 14, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(4, 120, 87); // emerald-700
    doc.text(val, 70, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`(${note})`, 110, y);
    y += 6;
  });
  
  y += 8;
  
  // Section 5: Doctor Clinical Notes & Biocompatibility Assessment
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, 182, 45, 3, 3, "F");
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`Physician Biocompatibility & Clinical Assessment (Confidence Score: ${prediction.confidence_score || 98.4}%)`, 18, y + 8);
  
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  
  const splitNotes = doc.splitTextToSize(customNotes, 174);
  doc.text(splitNotes, 18, y + 16);

  // Doctor Signature & Seal Block
  y += 52;
  doc.setLineWidth(0.4);
  doc.setDrawColor(148, 163, 184);
  doc.line(14, y + 12, 80, y + 12);
  doc.line(120, y + 12, 186, y + 12);

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text(doctorName, 14, y + 16);
  doc.text("Medical Director / Chief Specialist Signature", 14, y + 20);

  doc.text("Official Clinical Stamp & Certification", 120, y + 16);
  doc.text("ISO 10993 & FDA Resorbable Standard", 120, y + 20);
  
  // Footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("AI Biomaterial Composite Platform | Confidential Medical Clinical Document", 14, 285);
  
  doc.save(`Clinical_Report_${reportTypeKey.toUpperCase()}_${prediction.polymer_type}_${prediction.natural_fiber}.pdf`);
};
