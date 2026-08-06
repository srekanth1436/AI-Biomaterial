import os, sys
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models, crud, schemas
from predict import predict_properties

def seed_database():
    print("Initializing Database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        print("Seeding default Admin & Researcher accounts...")
        admin = crud.get_user_by_email(db, "admin@biomaterial.ai")
        if not admin:
            admin_data = schemas.UserRegister(
                name="Dr. Sarah Connor (Chief Scientist)",
                email="admin@biomaterial.ai",
                password="adminpassword123",
                role="admin",
                organization="Biomedical Composites Research Lab"
            )
            admin = crud.create_user(db, admin_data)
            
        researcher_data = schemas.UserRegister(
            name="Alex Mercer (Biomedical Engineer)",
            email="researcher@biomaterial.ai",
            password="researcher123",
            role="user",
            organization="Biomaterials Innovation Center"
        )
        researcher = crud.create_user(db, researcher_data)
        
        print("Seeding realistic biomaterial predictions...")
        sample_inputs = [
            {"polymer_type": "PLA", "natural_fiber": "Bamboo", "fiber_percentage": 30.0, "molecular_weight": 150000.0, "moisture_content": 8.0, "ph": 7.0, "temperature": 37.0, "density": 1.25},
            {"polymer_type": "Chitosan", "natural_fiber": "Hemp", "fiber_percentage": 25.0, "molecular_weight": 120000.0, "moisture_content": 6.5, "ph": 6.8, "temperature": 37.0, "density": 1.30},
            {"polymer_type": "PCL", "natural_fiber": "Jute", "fiber_percentage": 40.0, "molecular_weight": 80000.0, "moisture_content": 5.0, "ph": 7.2, "temperature": 30.0, "density": 1.15},
            {"polymer_type": "PHBV", "natural_fiber": "Flax", "fiber_percentage": 35.0, "molecular_weight": 210000.0, "moisture_content": 7.0, "ph": 7.0, "temperature": 37.0, "density": 1.28},
            {"polymer_type": "Starch", "natural_fiber": "Sisal", "fiber_percentage": 20.0, "molecular_weight": 60000.0, "moisture_content": 12.0, "ph": 7.0, "temperature": 25.0, "density": 1.40}
        ]
        
        for item in sample_inputs:
            input_schema = schemas.PredictionInput(**item)
            pred_dict = predict_properties(input_schema)
            crud.create_prediction(db, pred_dict, user_id=researcher.id)
            
        print("Seeding dataset records...")
        ds_data = schemas.DatasetCreate(
            dataset_name="Natural Biopolymer Composites Standard Dataset v2.4",
            sample_count=2500,
            description="Comprehensive experimental & synthetic dataset of PLA, Chitosan, PCL, and PHBV matrix composites with natural fibers."
        )
        crud.create_dataset_record(db, ds_data, uploaded_by="Dr. Sarah Connor")

        print(" Database successfully initialized and seeded!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
