from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="user") # 'user' or 'admin'
    organization = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Material Inputs
    polymer_type = Column(String(100), nullable=False)
    natural_fiber = Column(String(100), nullable=False)
    fiber_percentage = Column(Float, nullable=False)
    molecular_weight = Column(Float, nullable=False)
    moisture_content = Column(Float, nullable=False)
    ph = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    density = Column(Float, nullable=False)

    # Predicted Mechanical Properties
    tensile_strength = Column(Float, nullable=False)
    elastic_modulus = Column(Float, nullable=False)
    flexural_strength = Column(Float, nullable=False)
    impact_strength = Column(Float, nullable=False)

    # Predicted Degradation Properties
    degradation_time = Column(Float, nullable=False)
    weight_loss = Column(Float, nullable=False)
    water_absorption = Column(Float, nullable=False)
    biodegradation_rate = Column(Float, nullable=False)

    # Metadata & Insights
    confidence_score = Column(Float, default=96.0)
    suitability_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    dataset_name = Column(String(150), nullable=False)
    sample_count = Column(Integer, nullable=False)
    file_path = Column(String(255), nullable=True)
    uploaded_by = Column(String(120), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
