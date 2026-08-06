from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models, schemas, crud
from database import get_db
import auth, predict, admin, report
from sqlalchemy.orm import Session

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI-Enabled Biomaterial Composites Prediction API",
    description="Production-ready FastAPI backend for predicting mechanical strength and biodegradation properties of biopolymer composites.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(report.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "AI Biomaterial Property Prediction API",
        "version": "2.0.0",
        "docs_url": "/docs"
    }

@app.post("/predict", response_model=schemas.PredictionOutput)
def predict_biomaterial(data: schemas.PredictionInput, db: Session = Depends(get_db)):
    pred_res = predict.predict_properties(data)
    # Save to database with user_id if provided
    db_pred = crud.create_prediction(db, pred_res, user_id=data.user_id)
    pred_res["id"] = db_pred.id
    pred_res["user_id"] = db_pred.user_id
    
    if db_pred.user_id:
        user = crud.get_user_by_id(db, db_pred.user_id)
        if user:
            pred_res["user_name"] = user.name
            pred_res["user_email"] = user.email
        else:
            pred_res["user_name"] = "Registered Researcher"
            pred_res["user_email"] = "researcher@biomaterial.ai"
    else:
        pred_res["user_name"] = "Guest / Lab Evaluator"
        pred_res["user_email"] = "guest@biomedical.org"
        
    pred_res["created_at"] = db_pred.created_at
    return pred_res

@app.get("/predictions", response_model=list[schemas.PredictionOutput])
def get_prediction_history(skip: int = 0, limit: int = 50, user_id: int = None, db: Session = Depends(get_db)):
    db_preds = crud.get_predictions(db, skip=skip, limit=limit, user_id=user_id)
    res = []
    for p in db_preds:
        u_name = "Anonymous Evaluator"
        u_email = "user@biomedical.org"
        if p.user_id:
            u = crud.get_user_by_id(db, p.user_id)
            if u:
                u_name = u.name
                u_email = u.email

        res.append({
            "id": p.id,
            "user_id": p.user_id,
            "user_name": u_name,
            "user_email": u_email,
            "polymer_type": p.polymer_type,
            "natural_fiber": p.natural_fiber,
            "fiber_percentage": p.fiber_percentage,
            "molecular_weight": p.molecular_weight,
            "moisture_content": p.moisture_content,
            "ph": p.ph,
            "temperature": p.temperature,
            "density": p.density,
            "mechanical": {
                "tensile_strength": p.tensile_strength,
                "elastic_modulus": p.elastic_modulus,
                "flexural_strength": p.flexural_strength,
                "impact_strength": p.impact_strength
            },
            "degradation": {
                "degradation_time": p.degradation_time,
                "weight_loss": p.weight_loss,
                "water_absorption": p.water_absorption,
                "biodegradation_rate": p.biodegradation_rate
            },
            "confidence_score": p.confidence_score,
            "suitability_notes": p.suitability_notes,
            "created_at": p.created_at
        })
    return res

@app.get("/predictions/{prediction_id}", response_model=schemas.PredictionOutput)
def get_single_prediction(prediction_id: int, db: Session = Depends(get_db)):
    p = crud.get_prediction_by_id(db, prediction_id)
    if not p:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    u_name = "Anonymous Evaluator"
    u_email = "user@biomedical.org"
    if p.user_id:
        u = crud.get_user_by_id(db, p.user_id)
        if u:
            u_name = u.name
            u_email = u.email

    return {
        "id": p.id,
        "user_id": p.user_id,
        "user_name": u_name,
        "user_email": u_email,
        "polymer_type": p.polymer_type,
        "natural_fiber": p.natural_fiber,
        "fiber_percentage": p.fiber_percentage,
        "molecular_weight": p.molecular_weight,
        "moisture_content": p.moisture_content,
        "ph": p.ph,
        "temperature": p.temperature,
        "density": p.density,
        "mechanical": {
            "tensile_strength": p.tensile_strength,
            "elastic_modulus": p.elastic_modulus,
            "flexural_strength": p.flexural_strength,
            "impact_strength": p.impact_strength
        },
        "degradation": {
            "degradation_time": p.degradation_time,
            "weight_loss": p.weight_loss,
            "water_absorption": p.water_absorption,
            "biodegradation_rate": p.biodegradation_rate
        },
        "confidence_score": p.confidence_score,
        "suitability_notes": p.suitability_notes,
        "created_at": p.created_at
    }

@app.post("/compare")
def compare_formulations(data_a: schemas.PredictionInput, data_b: schemas.PredictionInput):
    pred_a = predict.predict_properties(data_a)
    pred_b = predict.predict_properties(data_b)
    
    t_a = pred_a["mechanical"]["tensile_strength"]
    t_b = pred_b["mechanical"]["tensile_strength"]
    t_diff = round(t_b - t_a, 2)
    t_pct = round(((t_b - t_a) / max(0.1, t_a)) * 100, 1)
    
    d_a = pred_a["degradation"]["degradation_time"]
    d_b = pred_b["degradation"]["degradation_time"]
    d_diff = round(d_b - d_a, 1)
    d_pct = round(((d_b - d_a) / max(0.1, d_a)) * 100, 1)
    
    return {
        "formulation_a": pred_a,
        "formulation_b": pred_b,
        "comparison": {
            "tensile_delta_mpa": t_diff,
            "tensile_delta_pct": t_pct,
            "stronger_formulation": "B" if t_b > t_a else "A",
            "degradation_delta_days": d_diff,
            "degradation_delta_pct": d_pct,
            "longer_lasting_formulation": "B" if d_b > d_a else "A",
        }
    }

@app.get("/recommendations/{use_case}")
def get_use_case_recommendations(use_case: str):
    uc = use_case.lower()
    if "orthopedic" in uc or "screw" in uc or "bone" in uc:
        return {
            "use_case": "Orthopedic Bone Screws & Structural Fixation",
            "recommended_polymer": "PLA / PLLA",
            "recommended_fiber": "Bamboo",
            "optimal_fiber_ratio": "30% - 35%",
            "target_tensile_range": "65 - 85 MPa",
            "target_degradation_range": "250 - 365 Days",
            "biocompatibility_index": "A+",
            "rationale": "High tensile strength matrix reinforced with oriented bamboo microfibers provides maximum load support while resorbing slowly during bone healing."
        }
    elif "scaffold" in uc or "tissue" in uc:
        return {
            "use_case": "Tissue Engineering Scaffolds",
            "recommended_polymer": "PHBV / PCL",
            "recommended_fiber": "Flax",
            "optimal_fiber_ratio": "20% - 25%",
            "target_tensile_range": "40 - 60 MPa",
            "target_degradation_range": "150 - 240 Days",
            "biocompatibility_index": "A",
            "rationale": "Porous PHBV/Flax composite promotes cellular adhesion, extracellular matrix formation, and uniform vascularization."
        }
    elif "wound" in uc or "patch" in uc or "skin" in uc:
        return {
            "use_case": "Wound Care Patches & Barrier Membranes",
            "recommended_polymer": "Chitosan / Alginate",
            "recommended_fiber": "Hemp",
            "optimal_fiber_ratio": "15% - 20%",
            "target_tensile_range": "25 - 45 MPa",
            "target_degradation_range": "60 - 120 Days",
            "biocompatibility_index": "A+",
            "rationale": "Natural antibacterial chitosan matrix blended with hemp fibers accelerates epithelialization and maintains moist wound healing environment."
        }
    elif "drug" in uc or "delivery" in uc:
        return {
            "use_case": "Controlled Drug Delivery Matrices",
            "recommended_polymer": "PCL / Gelatin",
            "recommended_fiber": "Nanocellulose",
            "optimal_fiber_ratio": "10% - 15%",
            "target_tensile_range": "15 - 35 MPa",
            "target_degradation_range": "30 - 90 Days",
            "biocompatibility_index": "A+",
            "rationale": "Nanocellulose networks enable zero-order sustained therapeutic release while hydrolyzing safely in physiological pH."
        }
    else:
        return {
            "use_case": "Eco-Friendly Biodegradable Bioplastics",
            "recommended_polymer": "Starch / PLA",
            "recommended_fiber": "Jute / Sisal",
            "optimal_fiber_ratio": "25% - 40%",
            "target_tensile_range": "30 - 55 MPa",
            "target_degradation_range": "45 - 90 Days",
            "biocompatibility_index": "A",
            "rationale": "Low-cost high-performance eco composite featuring rapid soil biodegradability and excellent barrier protection."
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
