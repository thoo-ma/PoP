import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import csv
import io
import librosa
import os
from pathlib import Path

print("Loading YAMNet model...")
model = hub.load('https://www.kaggle.com/models/google/yamnet/TensorFlow2/yamnet/1')

def class_names_from_csv(class_map_csv_text):
    class_map_csv = io.StringIO(class_map_csv_text)
    class_names = [display_name for (class_index, mid, display_name) in csv.reader(class_map_csv)]
    class_names = class_names[1:]
    return class_names

class_map_path = model.class_map_path().numpy()
class_names = class_names_from_csv(tf.io.read_file(class_map_path).numpy().decode('utf-8'))

def detect_toilet_flush(audio_file, threshold=0.5):
    """
    Detect toilet flush in audio file using YAMNet
    Returns: (detected, max_score, mean_score, top_predictions)
    """
    try:
        # Load audio
        waveform, sample_rate = librosa.load(audio_file, sr=16000, mono=True)
        
        # Normalize
        waveform = waveform.astype(np.float32)
        if np.abs(waveform).max() > 1.0:
            waveform = waveform / np.abs(waveform).max()
        
        # Run inference
        scores, embeddings, log_mel_spectrogram = model(waveform)
        
        # Get toilet flush scores
        toilet_flush_idx = 368
        frame_scores = scores.numpy()[:, toilet_flush_idx]
        
        max_score = frame_scores.max()
        mean_score = frame_scores.mean()
        
        # Get top 5 predictions using MAX aggregation
        max_scores = scores.numpy().max(axis=0)
        top_indices = max_scores.argsort()[-5:][::-1]
        top_predictions = [(class_names[idx], max_scores[idx]) for idx in top_indices]
        
        detected = max_score > threshold
        
        return {
            'detected': detected,
            'max_score': max_score,
            'mean_score': mean_score,
            'duration': len(waveform) / 16000,
            'num_frames': scores.shape[0],
            'top_predictions': top_predictions,
            'error': None
        }
        
    except Exception as e:
        return {
            'detected': False,
            'max_score': 0.0,
            'mean_score': 0.0,
            'duration': 0.0,
            'num_frames': 0,
            'top_predictions': [],
            'error': str(e)
        }

# Directory containing test audio files
test_audio_dir = 'assets'  # In same directory as this script

# Find all audio files
audio_extensions = ['.wav', '.mp3', '.mp4', '.m4a', '.flac', '.ogg']
test_files = []

if os.path.exists(test_audio_dir):
    for ext in audio_extensions:
        test_files.extend(Path(test_audio_dir).glob(f'*{ext}'))
else:
    print(f"⚠️  Test directory '{test_audio_dir}' not found!")
    print(f"Creating directory and looking for audio files in current directory instead...")
    os.makedirs(test_audio_dir, exist_ok=True)
    for ext in audio_extensions:
        test_files.extend(Path('.').glob(f'*{ext}'))

test_files = sorted([str(f) for f in test_files])

if not test_files:
    print(f"❌ No audio files found!")
    print(f"Please add audio files to '{test_audio_dir}' directory or current directory")
    exit(1)

print(f"\nFound {len(test_files)} audio files to test")
print("="*80)

# Test all files
results = []
detected_count = 0
threshold = 0.5  # Adjust this based on your needs

for i, audio_file in enumerate(test_files, 1):
    filename = os.path.basename(audio_file)
    print(f"\n[{i}/{len(test_files)}] Testing: {filename}")
    print("-"*80)
    
    result = detect_toilet_flush(audio_file, threshold)
    
    if result['error']:
        print(f"❌ ERROR: {result['error']}")
        results.append({
            'file': filename,
            'detected': False,
            'max_score': 0.0,
            'error': result['error']
        })
        continue
    
    # Store result
    results.append({
        'file': filename,
        'detected': result['detected'],
        'max_score': result['max_score'],
        'mean_score': result['mean_score'],
        'duration': result['duration'],
        'error': None
    })
    
    if result['detected']:
        detected_count += 1
    
    # Print results
    print(f"Duration: {result['duration']:.2f}s | Frames: {result['num_frames']}")
    print(f"Max score: {result['max_score']:.4f} | Mean score: {result['mean_score']:.4f}")
    print(f"Detection: {'✅ TOILET FLUSH DETECTED' if result['detected'] else '❌ NOT DETECTED'}")
    
    print(f"\nTop 5 predictions:")
    for j, (pred_name, pred_score) in enumerate(result['top_predictions'], 1):
        print(f"  {j}. {pred_name:30s} - {pred_score:.4f}")

# Summary
print("\n" + "="*80)
print("SUMMARY")
print("="*80)
print(f"Total files tested: {len(test_files)}")
print(f"Detected as toilet flush: {detected_count}")
print(f"Not detected: {len(test_files) - detected_count}")
print(f"Detection rate: {detected_count/len(test_files)*100:.1f}%")
print(f"Threshold used: {threshold}")

# Detailed results table
print("\n" + "="*80)
print("DETAILED RESULTS")
print("="*80)
print(f"{'Filename':<40} {'Max Score':<12} {'Mean Score':<12} {'Detected'}")
print("-"*80)
for r in results:
    status = '✅ YES' if r['detected'] else '❌ NO'
    if r['error']:
        status = '❌ ERROR'
    print(f"{r['file']:<40} {r['max_score']:<12.4f} {r['mean_score']:<12.4f} {status}")

# Score distribution
print("\n" + "="*80)
print("SCORE DISTRIBUTION")
print("="*80)
valid_results = [r for r in results if not r['error']]
if valid_results:
    max_scores = [r['max_score'] for r in valid_results]
    print(f"Highest score: {max(max_scores):.4f}")
    print(f"Lowest score: {min(max_scores):.4f}")
    print(f"Average score: {sum(max_scores)/len(max_scores):.4f}")
    
    # Show distribution
    print("\nScore ranges:")
    ranges = [
        (0.0, 0.2, 'Very low'),
        (0.2, 0.4, 'Low'),
        (0.4, 0.6, 'Medium'),
        (0.6, 0.8, 'High'),
        (0.8, 1.0, 'Very high')
    ]
    for min_val, max_val, label in ranges:
        count = sum(1 for s in max_scores if min_val <= s < max_val)
        bar = '█' * count
        print(f"  {label:12} ({min_val:.1f}-{max_val:.1f}): {count:2d} {bar}")