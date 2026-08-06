from sqlalchemy.orm import Session
from models import User, Prediction, Dataset
import schemas
from auth import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_all_users(db: Session):
    return db.query(User).order_by(User.created_at.desc()).all()

def create_user(db: Session, user: schemas.UserRegister):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password,
        role=user.role or "user",
        organization=user.organization or "Biomedical Research Lab"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_prediction(db: Session, prediction_data: dict, user_id: int = None):
    db_prediction = Prediction(
        user_id=user_id,
        polymer_type=prediction_data["polymer_type"],
        natural_fiber=prediction_data["natural_fiber"],
        fiber_percentage=prediction_data["fiber_percentage"],
        molecular_weight=prediction_data["molecular_weight"],
        moisture_content=prediction_data["moisture_content"],
        ph=prediction_data["ph"],
        temperature=prediction_data["temperature"],
        density=prediction_data["density"],
        
        tensile_strength=prediction_data["mechanical"]["tensile_strength"],
        elastic_modulus=prediction_data["mechanical"]["elastic_modulus"],
        flexural_strength=prediction_data["mechanical"]["flexural_strength"],
        impact_strength=prediction_data["mechanical"]["impact_strength"],
        
        degradation_time=prediction_data["degradation"]["degradation_time"],
        weight_loss=prediction_data["degradation"]["weight_loss"],
        water_absorption=prediction_data["degradation"]["water_absorption"],
        biodegradation_rate=prediction_data["degradation"]["biodegradation_rate"],
        
        confidence_score=prediction_data.get("confidence_score", 96.0),
        suitability_notes=prediction_data.get("suitability_notes", "")
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction

def get_predictions(db: Session, skip: int = 0, limit: int = 50, user_id: int = None):
    query = db.query(Prediction)
    if user_id:
        query = query.filter(Prediction.user_id == user_id)
    return query.order_by(Prediction.created_at.desc()).offset(skip).limit(limit).all()

def get_prediction_by_id(db: Session, prediction_id: int):
    return db.query(Prediction).filter(Prediction.id == prediction_id).first()

def get_all_datasets(db: Session):
    return db.query(Dataset).order_by(Dataset.created_at.desc()).all()

def create_dataset_record(db: Session, dataset: schemas.DatasetCreate, uploaded_by: str = "Admin"):
    db_dataset = Dataset(
        dataset_name=dataset.dataset_name,
        sample_count=dataset.sample_count,
        description=dataset.description,
        uploaded_by=uploaded_by
    )
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    return db_dataset
