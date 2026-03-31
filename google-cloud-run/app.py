import os

# Disable GPU BEFORE importing TensorFlow
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Reduce TensorFlow logging

import base64
import tempfile
from flask import Flask, request, jsonify
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import csv
import io
import librosa

# Configure TensorFlow for CPU-only execution
tf.config.set_visible_devices([], 'GPU')

app = Flask(__name__)

# Load YAMNet model at startup
print("Loading YAMNet model...")
model = hub.load('https://www.kaggle.com/models/google/yamnet/TensorFlow2/yamnet/1')
print("Model loaded successfully!")

# Load class names
def class_names_from_csv(class_map_csv_text):
    class_map_csv = io.StringIO(class_map_csv_text)
    class_names = [display_name for (class_index, mid, display_name) in csv.reader(class_map_csv)]
    class_names = class_names[1:]  # Skip header
    return class_names

class_map_path = model.class_map_path().numpy()
class_names = class_names_from_csv(tf.io.read_file(class_map_path).numpy().decode('utf-8'))

# Get configuration from environment
API_SECRET_KEY = os.environ.get('API_SECRET_KEY', '')
MODEL_VERSION = os.environ.get('MODEL_VERSION', 'yamnet-v1')

def detect_toilet_flush(audio_file, threshold=0.5):
    """
    Detect toilet flush in audio file using YAMNet
    Returns: detection result dictionary
    """
    try:
        print(f"[DETECT_FLUSH] Loading audio from {audio_file}...", flush=True)
        # Load audio with max duration limit to prevent timeouts
        MAX_DURATION = 30.0  # seconds
        waveform, sample_rate = librosa.load(audio_file, sr=16000, mono=True, duration=MAX_DURATION)
        duration_seconds = len(waveform) / 16000
        print(f"[DETECT_FLUSH] Audio loaded: {len(waveform)} samples, {duration_seconds:.2f}s", flush=True)
        
        if duration_seconds < 0.5:
            print(f"[DETECT_FLUSH] Audio too short: {duration_seconds:.2f}s", flush=True)
            return {
                'detected': False,
                'confidence': 0.0,
                'mean_confidence': 0.0,
                'duration_seconds': duration_seconds,
                'num_frames': 0,
                'threshold_used': threshold,
                'top_predictions': [],
                'model_version': MODEL_VERSION,
                'audio_size_kb': 0.0,
                'error': 'Audio too short (minimum 0.5 seconds)'
            }
        
        # Normalize
        waveform = waveform.astype(np.float32)
        if np.abs(waveform).max() > 1.0:
            waveform = waveform / np.abs(waveform).max()
        
        print(f"[DETECT_FLUSH] Running YAMNet inference...", flush=True)
        # Run inference
        scores, embeddings, log_mel_spectrogram = model(waveform)
        print(f"[DETECT_FLUSH] Inference complete: {scores.shape[0]} frames", flush=True)
        
        # Get toilet flush scores (class index 368)
        toilet_flush_idx = 368
        frame_scores = scores.numpy()[:, toilet_flush_idx]
        
        max_score = float(frame_scores.max())
        mean_score = float(frame_scores.mean())
        
        # Get top 5 predictions using MAX aggregation
        max_scores = scores.numpy().max(axis=0)
        top_indices = max_scores.argsort()[-5:][::-1]
        top_predictions = [
            {'class': class_names[idx], 'confidence': float(max_scores[idx])} 
            for idx in top_indices
        ]
        
        detected = max_score > threshold
        
        return {
            'detected': detected,
            'confidence': max_score,
            'mean_confidence': mean_score,
            'duration_seconds': float(len(waveform) / 16000),
            'num_frames': int(scores.shape[0]),
            'top_predictions': top_predictions,
            'model_version': MODEL_VERSION,
            'threshold_used': threshold,
            'error': None
        }
        
    except Exception as e:
        return {
            'detected': False,
            'confidence': 0.0,
            'mean_confidence': 0.0,
            'duration_seconds': 0.0,
            'num_frames': 0,
            'top_predictions': [],
            'model_version': MODEL_VERSION,
            'threshold_used': threshold,
            'error': str(e)
        }

@app.route('/detect', methods=['POST'])
def detect():
    """
    Endpoint to detect toilet flush in audio
    Expects JSON: {"audio": "base64_encoded_audio", "threshold": 0.5}
    Requires X-API-Key header for authentication
    """
    import sys
    import traceback
    
    print(f"[DETECT] Request received", flush=True)
    
    # Validate API key
    api_key = request.headers.get('X-API-Key')
    if not api_key or api_key != API_SECRET_KEY:
        print(f"[DETECT] Unauthorized request", flush=True)
        return jsonify({'error': 'Unauthorized'}), 401
    
    print(f"[DETECT] API key validated", flush=True)
    
    # Get request data
    try:
        data = request.get_json()
        if not data or 'audio' not in data:
            return jsonify({'error': 'Missing audio data'}), 400
        
        audio_base64 = data['audio']
        threshold = float(data.get('threshold', 0.5))
        
        print(f"[DETECT] Audio size: {len(audio_base64)} bytes (base64)", flush=True)
        print(f"[DETECT] Threshold: {threshold}", flush=True)
        
        # Validate threshold
        if not 0.0 <= threshold <= 1.0:
            return jsonify({'error': 'Threshold must be between 0.0 and 1.0'}), 400
        
    except Exception as e:
        print(f"[DETECT] Error parsing request: {e}", flush=True)
        traceback.print_exc()
        return jsonify({'error': f'Invalid request data: {str(e)}'}), 400
    
    # Decode base64 audio
    try:
        print(f"[DETECT] Decoding base64 audio...", flush=True)
        audio_data = base64.b64decode(audio_base64)
        print(f"[DETECT] Decoded audio: {len(audio_data)} bytes", flush=True)
    except Exception as e:
        print(f"[DETECT] Error decoding audio: {e}", flush=True)
        return jsonify({'error': f'Invalid base64 audio data: {str(e)}'}), 400
    
    # Save to temporary file
    temp_file = None
    try:
        print(f"[DETECT] Creating temp file...", flush=True)
        with tempfile.NamedTemporaryFile(suffix='.m4a', delete=False) as f:
            f.write(audio_data)
            temp_file = f.name
        print(f"[DETECT] Temp file created: {temp_file}", flush=True)
        
        # Run detection
        print(f"[DETECT] Starting detection...", flush=True)
        sys.stdout.flush()
        result = detect_toilet_flush(temp_file, threshold)
        print(f"[DETECT] Detection complete", flush=True)
        
        # Add audio size to result
        result['audio_size_kb'] = round(len(audio_data) / 1024, 2)
        
        # Return 422 for client-side audio validation errors
        if result.get('error'):
            return jsonify(result), 422
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"[DETECT] Exception during detection: {e}", flush=True)
        traceback.print_exc()
        sys.stdout.flush()
        return jsonify({'error': f'Detection failed: {str(e)}'}), 500
        
    finally:
        # Clean up temp file
        if temp_file and os.path.exists(temp_file):
            try:
                os.unlink(temp_file)
                print(f"[DETECT] Cleaned up temp file", flush=True)
            except:
                pass

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_version': MODEL_VERSION,
        'model_loaded': model is not None
    }), 200

if __name__ == '__main__':
    # Run with gunicorn in production, this is for local testing
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
