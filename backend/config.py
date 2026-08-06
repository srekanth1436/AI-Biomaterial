from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Primary XAMPP phpMyAdmin MySQL URL, with automatic SQLite fallback
    database_url: str = "mysql+pymysql://root:lanja1438@127.0.0.1:3306/biomaterial_db"
    secret_key: str = "supersecretkey_biomaterial_2026"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    class Config:
        env_file = ".env"

settings = Settings()

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes
DATABASE_URL = settings.database_url
