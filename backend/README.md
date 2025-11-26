# Blog Portfolio Backend

FastAPI backend for the blog portfolio project.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and secret keys
```

4. Run development server:
```bash
uvicorn app.main:app --reload
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # MongoDB connection
│   ├── models/              # Pydantic models
│   ├── schemas/             # Request/response schemas
│   ├── routes/              # API endpoints
│   ├── services/            # Business logic
│   ├── middleware/          # Custom middleware
│   └── utils/               # Helper functions
└── tests/                   # Test files
```

