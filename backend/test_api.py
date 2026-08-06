import pytest
from httpx import AsyncClient, ASGITransport
from database import engine, Base
from main import app

# Create test database tables
Base.metadata.create_all(bind=engine)

@pytest.fixture
def anyio_backend():
    return "asyncio"

@pytest.mark.anyio
async def test_root_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "online"

@pytest.mark.anyio
async def test_predict_endpoint():
    payload = {
        "polymer_type": "PLA",
        "natural_fiber": "Bamboo",
        "fiber_percentage": 30.0,
        "molecular_weight": 150000.0,
        "moisture_content": 8.0,
        "ph": 7.0,
        "temperature": 37.0,
        "density": 1.25
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "mechanical" in data
    assert "degradation" in data
    assert "tensile_strength" in data["mechanical"]
    assert "degradation_time" in data["degradation"]

@pytest.mark.anyio
async def test_auth_register_login():
    import uuid
    unique_email = f"test_{uuid.uuid4().hex[:8]}@biomaterial.ai"
    
    reg_payload = {
        "name": "Test Engineer",
        "email": unique_email,
        "password": "testpassword123",
        "role": "user",
        "organization": "Testing Lab"
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        reg_res = await ac.post("/auth/register", json=reg_payload)
        assert reg_res.status_code in [200, 201]
        
        login_payload = {
            "email": unique_email,
            "password": "testpassword123"
        }
        login_res = await ac.post("/auth/login", json=login_payload)
        assert login_res.status_code == 200
        login_data = login_res.json()
        assert "access_token" in login_data
        assert login_data["token_type"] == "bearer"
