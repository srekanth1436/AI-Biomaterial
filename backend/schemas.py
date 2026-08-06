from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    organization: Optional[str] = "Biomedical Institute"
    role: Optional[str] = "user"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    organization: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Prediction Schemas ---
class PredictionInput(BaseModel):
    polymer_type: str
    natural_fiber: str
    fiber_percentage: float
    molecular_weight: float
    moisture_content: float
    ph: float
    temperature: float
    density: float
    user_id: Optional[int] = None

class MechanicalProperties(BaseModel):
    tensile_strength: float # MPa
    elastic_modulus: float # GPa
    flexural_strength: float # MPa
    impact_strength: float # kJ/m²

class DegradationProperties(BaseModel):
    degradation_time: float # days
    weight_loss: float # %
    water_absorption: float # %
    biodegradation_rate: float # %/day

class PredictionOutput(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    polymer_type: str
    natural_fiber: str
    fiber_percentage: float
    molecular_weight: float
    moisture_content: float
    ph: float
    temperature: float
    density: float
    
    mechanical: MechanicalProperties
    degradation: DegradationProperties
    
    confidence_score: float
    suitability_notes: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Dataset Schemas ---
class DatasetCreate(BaseModel):
    dataset_name: str
    sample_count: int
    description: Optional[str] = None

class DatasetResponse(BaseModel):
    id: int
    dataset_name: str
    sample_count: int
    file_path: Optional[str] = None
    uploaded_by: Optional[str] = None
    description: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
