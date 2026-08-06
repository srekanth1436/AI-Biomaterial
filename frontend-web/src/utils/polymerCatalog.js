/**
 * Global Biopolymer World Catalog & Dataset Manager
 * Comprehensive dataset of medical and industrial biopolymers with physical, 
 * chemical, and degradation baseline parameters.
 */

export const INITIAL_POLYMER_CATALOG = [
  {
    id: 'pla',
    name: 'PLA (Polylactic Acid)',
    category: 'Biodegradable Polyester',
    origin: 'Corn Starch / Sugarcane',
    description: 'Rigid bio-based thermoplastic with high mechanical strength. Widely used in orthopedic fixation and 3D bioprinting.',
    recommended_fiber: 'Bamboo',
    fiber_percentage: 30,
    molecular_weight: 150000,
    moisture_content: 8.0,
    ph: 7.4,
    temperature: 37,
    density: 1.25,
    medical_applications: ['Bone Screws', 'Tissue Pins', 'Surgical Sutures', 'Orthopedic Plates'],
    biocompatibility_grade: 'Medical Grade ISO 10993',
    degradation_timeline: '180 - 365 Days'
  },
  {
    id: 'plga',
    name: 'PLGA (Poly(lactic-co-glycolic acid))',
    category: 'Synthetic Copolymer',
    origin: 'Lactic & Glycolic Acid Synthesis',
    description: 'FDA-approved synthetic copolymer with highly tunable degradation rate for controlled drug delivery.',
    recommended_fiber: 'Nanocellulose',
    fiber_percentage: 15,
    molecular_weight: 95000,
    moisture_content: 5.5,
    ph: 7.2,
    temperature: 37,
    density: 1.30,
    medical_applications: ['Drug Delivery Microspheres', 'Stents', 'Nerve Guides'],
    biocompatibility_grade: 'FDA Approved Class III',
    degradation_timeline: '30 - 180 Days'
  },
  {
    id: 'chitosan',
    name: 'Chitosan',
    category: 'Natural Polysaccharide',
    origin: 'Crustacean Shells / Fungal Cell Walls',
    description: 'Biocompatible, hemostatic, and intrinsically antimicrobial biopolymer excellent for wound dressing.',
    recommended_fiber: 'Hemp',
    fiber_percentage: 20,
    molecular_weight: 120000,
    moisture_content: 10.0,
    ph: 6.8,
    temperature: 37,
    density: 1.35,
    medical_applications: ['Hemostatic Wound Bandages', 'Skin Grafts', 'Antimicrobial Patches'],
    biocompatibility_grade: 'USP Class VI',
    degradation_timeline: '45 - 90 Days'
  },
  {
    id: 'phbv',
    name: 'PHBV (Polyhydroxybutyrate-co-valerate)',
    category: 'Bacterial Polyhydroxyalkanoate',
    origin: 'Microbial Fermentation',
    description: 'Natural bacterial polyester with piezoelectric properties matching human bone structure.',
    recommended_fiber: 'Flax',
    fiber_percentage: 35,
    molecular_weight: 220000,
    moisture_content: 6.0,
    ph: 7.4,
    temperature: 37,
    density: 1.28,
    medical_applications: ['Orthopedic Bone Scaffolds', 'Vascular Grafts', 'Cardiovascular Patches'],
    biocompatibility_grade: 'Medical Grade A+',
    degradation_timeline: '200 - 300 Days'
  },
  {
    id: 'pcl',
    name: 'PCL (Polycaprolactone)',
    category: 'Synthetic Polyester',
    origin: 'Ring-opening Polymerization of Caprolactone',
    description: 'Flexible, low melting point polyester with slow degradation timeline ideal for long-term tissue implants.',
    recommended_fiber: 'Jute',
    fiber_percentage: 25,
    molecular_weight: 80000,
    moisture_content: 4.5,
    ph: 7.0,
    temperature: 37,
    density: 1.14,
    medical_applications: ['Long-term Scaffold Matrices', 'Contraceptive Implants', 'Suture Anchors'],
    biocompatibility_grade: 'FDA Approved',
    degradation_timeline: '730 - 1095 Days'
  },
  {
    id: 'alginate',
    name: 'Sodium Alginate',
    category: 'Algal Polysaccharide',
    origin: 'Brown Seaweed (Phaeophyceae)',
    description: 'Hydrophilic polysaccharide capable of forming hydrogels in presence of calcium ions.',
    recommended_fiber: 'Sisal',
    fiber_percentage: 15,
    molecular_weight: 160000,
    moisture_content: 12.0,
    ph: 7.1,
    temperature: 37,
    density: 1.40,
    medical_applications: ['Exudate Wound Care', 'Cell Encapsulation', 'Dental Impression Hydrogels'],
    biocompatibility_grade: 'Pharmaceutical Grade',
    degradation_timeline: '14 - 45 Days'
  },
  {
    id: 'silk',
    name: 'Silk Fibroin',
    category: 'Natural Structural Protein',
    origin: 'Bombyx mori Silk Cocoons',
    description: 'High tensile protein polymer with exceptional toughness and cell attachment characteristics.',
    recommended_fiber: 'Wood Flour',
    fiber_percentage: 20,
    molecular_weight: 350000,
    moisture_content: 7.5,
    ph: 7.4,
    temperature: 37,
    density: 1.33,
    medical_applications: ['Ligament & Tendon Reconstruction', 'Corneal Membranes', 'Skin Tissue Regeneration'],
    biocompatibility_grade: 'Clinical Grade A+',
    degradation_timeline: '180 - 500 Days'
  },
  {
    id: 'collagen',
    name: 'Type I Collagen',
    category: 'Extracellular Matrix Protein',
    origin: 'Bovine / Porcine Tendons',
    description: 'Primary structural protein in mammalian connective tissue offering high cellular recognition.',
    recommended_fiber: 'Nanocellulose',
    fiber_percentage: 10,
    molecular_weight: 300000,
    moisture_content: 11.0,
    ph: 7.4,
    temperature: 37,
    density: 1.32,
    medical_applications: ['Dermal Regeneration', 'Dental Resorbable Barriers', 'Tendon Wraps'],
    biocompatibility_grade: 'Surgical Grade',
    degradation_timeline: '30 - 90 Days'
  },
  {
    id: 'gelatin',
    name: 'Gelatin',
    category: 'Hydrolyzed Collagen Protein',
    origin: 'Thermal Hydrolysis of Animal Collagen',
    description: 'Water-soluble protein biopolymer with thermally reversible gelation properties.',
    recommended_fiber: 'Coir',
    fiber_percentage: 12,
    molecular_weight: 100000,
    moisture_content: 14.0,
    ph: 6.9,
    temperature: 37,
    density: 1.27,
    medical_applications: ['Capsule Shells', 'Surgical Hemostatic Sponges', 'Hydrogel Scaffolds'],
    biocompatibility_grade: 'USP Pharmaceutical Grade',
    degradation_timeline: '7 - 30 Days'
  },
  {
    id: 'hyaluronic_acid',
    name: 'Hyaluronic Acid (HA)',
    category: 'Glycosaminoglycan',
    origin: 'Bacterial Fermentation (Streptococcus)',
    description: 'High viscoelastic mucopolysaccharide retaining exceptional volume of water in physiological environments.',
    recommended_fiber: 'Nanocellulose',
    fiber_percentage: 8,
    molecular_weight: 1200000,
    moisture_content: 15.0,
    ph: 7.3,
    temperature: 37,
    density: 1.05,
    medical_applications: ['Synovial Fluid Injections', 'Ophthalmic Surgery Hydrogels', 'Dermal Fillers'],
    biocompatibility_grade: 'Medical Injectable Grade',
    degradation_timeline: '15 - 60 Days'
  },
  {
    id: 'starch',
    name: 'Thermoplastic Starch (TPS)',
    category: 'Plant Carbohydrate Polymer',
    origin: 'Potato / Corn / Cassava',
    description: 'Renewable and eco-friendly polymer plasticized with glycerol for fast degradation applications.',
    recommended_fiber: 'Rice Husk',
    fiber_percentage: 40,
    molecular_weight: 500000,
    moisture_content: 12.5,
    ph: 6.5,
    temperature: 25,
    density: 1.42,
    medical_applications: ['Temporary Drug Carriers', 'Single-use Medical Trays', 'Eco Packaging'],
    biocompatibility_grade: 'Food & Biomaterial Grade',
    degradation_timeline: '30 - 60 Days'
  },
  {
    id: 'pbs',
    name: 'PBS (Polybutylene Succinate)',
    category: 'Aliphatic Polyester',
    origin: 'Succinic Acid & 1,4-Butanediol',
    description: 'Ductile bio-polyester featuring high impact resistance and moderate degradation time.',
    recommended_fiber: 'Kenaf',
    fiber_percentage: 30,
    molecular_weight: 140000,
    moisture_content: 5.0,
    ph: 7.0,
    temperature: 37,
    density: 1.26,
    medical_applications: ['Surgical Tubing', 'Disposable Medical Gowns', 'Tissue Clutches'],
    biocompatibility_grade: 'ISO 10993 Approved',
    degradation_timeline: '120 - 240 Days'
  }
];

export const FIBER_CATALOG = [
  { name: 'Bamboo', density: 0.9, tensile_avg: 290, moisture_retention: 'Low' },
  { name: 'Hemp', density: 1.48, tensile_avg: 690, moisture_retention: 'Medium' },
  { name: 'Flax', density: 1.5, tensile_avg: 800, moisture_retention: 'Medium' },
  { name: 'Jute', density: 1.3, tensile_avg: 450, moisture_retention: 'High' },
  { name: 'Sisal', density: 1.45, tensile_avg: 550, moisture_retention: 'Medium' },
  { name: 'Coir', density: 1.15, tensile_avg: 175, moisture_retention: 'High' },
  { name: 'Kenaf', density: 1.4, tensile_avg: 500, moisture_retention: 'Medium' },
  { name: 'Rice Husk', density: 0.7, tensile_avg: 120, moisture_retention: 'Low' },
  { name: 'Wood Flour', density: 1.2, tensile_avg: 200, moisture_retention: 'High' },
  { name: 'Nanocellulose', density: 1.6, tensile_avg: 1200, moisture_retention: 'Very High' }
];

export const GLOBAL_POLYMER_CATALOG = INITIAL_POLYMER_CATALOG;

// Load persisted custom dataset entries
export const getActivePolymerCatalog = () => {
  try {
    const saved = localStorage.getItem('custom_polymer_dataset');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return [...INITIAL_POLYMER_CATALOG, ...parsed];
      }
    }
  } catch (e) {
    console.error('Error loading custom polymer dataset', e);
  }
  return INITIAL_POLYMER_CATALOG;
};

// Add single new biopolymer entry to dataset
export const saveCustomBiopolymerEntry = (newEntry) => {
  try {
    const existing = JSON.parse(localStorage.getItem('custom_polymer_dataset') || '[]');
    const updated = [newEntry, ...existing];
    localStorage.setItem('custom_polymer_dataset', JSON.stringify(updated));
    return getActivePolymerCatalog();
  } catch (e) {
    console.error('Error saving custom entry', e);
    return getActivePolymerCatalog();
  }
};

// Parse uploaded CSV/JSON dataset file content
export const parseUploadedDatasetFile = (fileContent, fileName) => {
  const newItems = [];
  try {
    if (fileName.endsWith('.json')) {
      const data = JSON.parse(fileContent);
      const items = Array.isArray(data) ? data : [data];
      items.forEach((item, idx) => {
        newItems.push({
          id: `custom_json_${Date.now()}_${idx}`,
          name: item.name || item.polymer_name || `Custom Polymer ${idx + 1}`,
          category: item.category || 'Uploaded Custom Dataset',
          origin: item.origin || 'Laboratory Custom Synthesis',
          description: item.description || 'Imported custom biopolymer dataset entry.',
          recommended_fiber: item.recommended_fiber || item.natural_fiber || 'Bamboo',
          fiber_percentage: parseFloat(item.fiber_percentage || item.ratio || 25),
          molecular_weight: parseFloat(item.molecular_weight || item.mw || 120000),
          moisture_content: parseFloat(item.moisture_content || item.moisture || 8.0),
          ph: parseFloat(item.ph || 7.4),
          temperature: parseFloat(item.temperature || item.temp || 37),
          density: parseFloat(item.density || 1.25),
          medical_applications: Array.isArray(item.medical_applications) ? item.medical_applications : ['Custom Research Implant'],
          biocompatibility_grade: item.biocompatibility_grade || 'Custom Research Grade',
          degradation_timeline: item.degradation_timeline || '90 - 180 Days'
        });
      });
    } else {
      // Parse CSV
      const lines = fileContent.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length > 1) {
        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim());
          if (cols.length >= 2) {
            newItems.push({
              id: `custom_csv_${Date.now()}_${i}`,
              name: cols[0] || `Custom CSV Polymer ${i}`,
              category: 'Imported CSV Dataset',
              origin: 'Custom User Dataset',
              description: `Uploaded from CSV dataset "${fileName}".`,
              recommended_fiber: cols[1] || 'Bamboo',
              fiber_percentage: parseFloat(cols[2]) || 25,
              molecular_weight: parseFloat(cols[3]) || 130000,
              moisture_content: parseFloat(cols[4]) || 7.5,
              ph: parseFloat(cols[5]) || 7.4,
              temperature: parseFloat(cols[6]) || 37,
              density: parseFloat(cols[7]) || 1.25,
              medical_applications: ['Custom CSV Research Application'],
              biocompatibility_grade: 'Custom Lab Grade',
              degradation_timeline: '100 - 200 Days'
            });
          }
        }
      }
    }

    if (newItems.length > 0) {
      const existing = JSON.parse(localStorage.getItem('custom_polymer_dataset') || '[]');
      const merged = [...newItems, ...existing];
      localStorage.setItem('custom_polymer_dataset', JSON.stringify(merged));
    }
  } catch (e) {
    console.error('Error parsing dataset file', e);
  }
  return getActivePolymerCatalog();
};
