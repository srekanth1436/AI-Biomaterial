from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from database import get_db
import crud
from datetime import datetime

router = APIRouter(prefix="/reports", tags=["PDF Reports"])

REPORT_TITLES = {
    "clinical": "CLINICAL SURGICAL & BIOCOMPATIBILITY EVALUATION REPORT",
    "orthopedic": "ORTHOPEDIC LOAD & FIXATION ANALYSIS REPORT",
    "scaffold": "TISSUE ENGINEERING & REGENERATIVE SCAFFOLD REPORT",
    "wound": "WOUND HEALING & ANTIMICROBIAL BARRIER PATCH REPORT",
    "compliance": "FDA / ISO 10993 REGULATORY COMPLIANCE CERTIFICATE"
}

@router.get("/prediction/{prediction_id}")
def get_prediction_report_data(
    prediction_id: int, 
    report_type: str = Query("clinical", description="Report standard classification"), 
    db: Session = Depends(get_db)
):
    pred = crud.get_prediction_by_id(db, prediction_id)
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction record not found")
        
    title = REPORT_TITLES.get(report_type.lower(), "AI BIOMATERIAL COMPOSITE PROPERTY ANALYSIS REPORT")

    return {
        "report_type": report_type,
        "report_title": title,
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "prediction_id": pred.id,
        "material_inputs": {
            "polymer_type": pred.polymer_type,
            "natural_fiber": pred.natural_fiber,
            "fiber_percentage": f"{pred.fiber_percentage}%",
            "molecular_weight": f"{pred.molecular_weight} g/mol",
            "moisture_content": f"{pred.moisture_content}%",
            "ph": pred.ph,
            "temperature": f"{pred.temperature} °C",
            "density": f"{pred.density} g/cm³"
        },
        "ai_predicted_results": {
            "mechanical_properties": {
                "tensile_strength": f"{pred.tensile_strength} MPa",
                "elastic_modulus": f"{pred.elastic_modulus} GPa",
                "flexural_strength": f"{pred.flexural_strength} MPa",
                "impact_strength": f"{pred.impact_strength} kJ/m²"
            },
            "degradation_properties": {
                "degradation_time": f"{pred.degradation_time} days",
                "weight_loss": f"{pred.weight_loss}%",
                "water_absorption": f"{pred.water_absorption}%",
                "biodegradation_rate": f"{pred.biodegradation_rate} %/day"
            }
        },
        "ai_confidence_score": f"{pred.confidence_score}%",
        "suitability_recommendation": pred.suitability_notes
    }
