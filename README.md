# AI-Enabled Prediction of Mechanical and Degradation Properties of Natural Biomaterial Composites

Production-ready full-stack AI platform designed to predict mechanical strength and biodegradation properties of biopolymer composites before laboratory manufacturing.

## System Architecture

- **Web Application:** React.js, Vite, Tailwind CSS, Framer Motion, Recharts
- **Mobile Application:** Flutter, Riverpod, Dio, GoRouter, FL Chart
- **Shared Backend API:** Python, FastAPI, SQLAlchemy, JWT Authentication
- **Database:** MySQL
- **Machine Learning Engine:** Scikit-Learn (Random Forest Regressor), XGBoost Regressor

---

## Quick Start (Docker)

Spin up the entire stack (Database, FastAPI, Web UI) using Docker Compose:

```bash
docker-compose up --build
```

- Web App: `http://localhost:80`
- FastAPI Documentation: `http://localhost:8000/docs`

---

## Running Locally

### Backend & AI Model
```bash
cd backend
pip install -r requirements.txt
python ../ml/train.py  # Train ML models
python -m uvicorn main:app --reload --port 8000
```

### React Web Application
```bash
cd frontend-web
npm install
npm run dev
```

### Flutter Mobile Application
```bash
cd mobile-app
flutter pub get
flutter run
```

---

## License
MIT License.
