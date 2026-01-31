# Google Cloud Run - Toilet Flush Detection API

This directory contains the YAMNet-based toilet flush detection service deployed on Google Cloud Run.

## Structure

```
google-cloud-run/
├── app.py                # Flask API for production (deployed to Cloud Run)
├── requirements.txt      # Production dependencies
├── Dockerfile           # Container configuration for Cloud Run
├── .dockerignore        # Files to exclude from Docker build
└── tests/               # Local testing only (not deployed)
    ├── test_detection.py       # Quick test script for single audio file
    ├── test_batch_yamnet.py    # Batch testing with detailed analysis
    ├── assets/                 # Place audio files here for testing
    ├── requirements.txt        # Test dependencies (ML only, no Flask)
    └── venv/                   # Virtual environment for local testing
```

## Production Deployment

The API runs on Google Cloud Run and exposes two endpoints:

- **POST /detect** - Detect toilet flush in audio
  - Requires `X-API-Key` header
  - Body: `{"audio": "base64_encoded_audio", "threshold": 0.5}`
  
- **GET /health** - Health check
  - Returns model status

### Deploy to Cloud Run

```bash
gcloud run deploy toilet-flush-detector \
  --source . \
  --platform managed \
  --region us-central1 \
  --set-env-vars API_SECRET_KEY=your_secret_key,MODEL_VERSION=yamnet-v1
```

## Local Testing

### Setup

1. Create virtual environment:
```bash
cd tests/
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

### Running Tests

1. **Quick single file test:**
```bash
cd tests/
python test_detection.py
```
Place audio files in `assets/` folder. Tests the first file found.

2. **Batch testing with analysis:**
```bash
cd tests/
python test_batch_yamnet.py
```
Tests all audio files in `assets/` and provides detailed statistics.

### Adding Test Audio

Place `.wav`, `.mp3`, `.m4a`, or other audio files in `tests/assets/` directory.

## Model Information

- **Model**: YAMNet (Yet Another Mobile Network)
- **Class**: Toilet flush (index 368)
- **Default threshold**: 0.5
- **Aggregation**: MAX score across all audio frames

## Environment Variables

- `API_SECRET_KEY` - Authentication key for API (required)
- `MODEL_VERSION` - Model identifier (default: yamnet-v1)
- `CUDA_VISIBLE_DEVICES` - Set to -1 for CPU-only (already configured)
