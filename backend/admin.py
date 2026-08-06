from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
import crud, schemas
import os, subprocess

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

@router.get("/datasets", response_model=list[schemas.DatasetResponse])
def get_datasets(db: Session = Depends(get_db)):
    return crud.get_all_datasets(db)

@router.post("/upload-dataset", response_model=schemas.DatasetResponse)
async def upload_dataset(
    dataset_name: str,
    description: str = "",
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload CSV or Excel file.")
    
    upload_dir = os.path.join(os.path.dirname(__file__), "..", "ml", "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, file.filename)
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)
        
    lines = contents.decode('utf-8', errors='ignore').split('\n')
    sample_count = max(10, len(lines) - 1)
    
    dataset_obj = schemas.DatasetCreate(
        dataset_name=dataset_name,
        sample_count=sample_count,
        description=description
    )
    return crud.create_dataset_record(db, dataset_obj, uploaded_by="Admin Researcher")

@router.post("/retrain-model")
def retrain_model():
    try:
        train_script = os.path.join(os.path.dirname(__file__), "..", "ml", "train.py")
        result = subprocess.run(["python", train_script], capture_output=True, text=True, check=True)
        return {
            "status": "success",
            "message": "AI prediction models successfully retrained and updated on current dataset!",
            "output": result.stdout
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model retraining failed: {str(e)}")
