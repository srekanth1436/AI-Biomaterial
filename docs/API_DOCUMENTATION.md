# API Documentation

The shared FastAPI backend provides complete REST endpoints for both Web and Mobile applications.

## Base URL
`http://localhost:8000`

---

## Authentication Endpoints

### `POST /auth/register`
Register a new researcher account.
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword",
    "role": "Researcher"
  }
  ```

### `POST /auth/login`
Authenticate user and receive JWT access token.

---

## Prediction Endpoints

### `POST /predict/`
Submit biomaterial formulation parameters to receive AI predictions.
- **Request Body:**
  ```json
  {
    "polymer_type": "PLA",
    "natural_fiber": "Bamboo",
    "fiber_percentage": 30.0,
    "molecular_weight": 150000.0,
    "moisture_content": 8.0,
    "ph": 7.4,
    "temperature": 37.0,
    "density": 1.25
  }
  ```
- **Response:**
  ```json
  {
    "prediction_id": 1,
    "results": {
      "tensile_strength": 58.2,
      "elastic_modulus": 3.4,
      "degradation_time": 190.0,
      "weight_loss": 22.0,
      "confidence_score": 96.0
    }
  }
  ```

---

## PDF Export Endpoints

### `GET /reports/{prediction_id}/pdf`
Download a generated PDF report containing input parameters, prediction outputs, and recommendations.
