import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import csv
import io
import librosa
import os
import glob

print("Loading YAMNet model...")
model = hub.load('https://www.kaggle.com/models/google/yamnet/TensorFlow2/yamnet/1')

def class_names_from_csv(class_map_csv_text):
    class_map_csv = io.StringIO(class_map_csv_text)
    class_names = [display_name for (class_index, mid, display_name) in csv.reader(class_map_csv)]
    class_names = class_names[1:]
    return class_names

class_map_path = model.class_map_path().numpy()
class_names = class_names_from_csv(tf.io.read_file(class_map_path).numpy().decode('utf-8'))

# Find audio files in assets folder (same directory as this script)
test_audio_dir = 'assets'
audio_files = glob.glob(os.path.join(test_audio_dir, '*.wav')) + \
              glob.glob(os.path.join(test_audio_dir, '*.mp3')) + \
              glob.glob(os.path.join(test_audio_dir, '*.m4a')) + \
              glob.glob(os.path.join(test_audio_dir, '*.mp4')) + \
              glob.glob(os.path.join(test_audio_dir, '*.flac')) + \
              glob.glob(os.path.join(test_audio_dir, '*.ogg'))

if not audio_files:
    print(f"No audio files found in {test_audio_dir}/")
    print("Please add audio files (.wav, .mp3, .m4a, .mp4, .flac, .ogg) to the assets/ folder")
    exit(1)

audio_file = audio_files[0]
print(f"Found {len(audio_files)} audio file(s)")

print(f"\nLoading audio file: {audio_file}")
waveform, sample_rate = librosa.load(audio_file, sr=16000, mono=True)

print(f"Audio duration: {len(waveform)/16000:.2f} seconds")

waveform = waveform.astype(np.float32)
if np.abs(waveform).max() > 1.0:
    waveform = waveform / np.abs(waveform).max()

print("\nRunning inference...")
scores, embeddings, log_mel_spectrogram = model(waveform)

print(f"Got {scores.shape[0]} frames of predictions")

# THREE DIFFERENT DETECTION STRATEGIES
toilet_flush_idx = 368
frame_scores = scores.numpy()[:, toilet_flush_idx]

print("\n" + "="*70)
print("DETECTION STRATEGY COMPARISON:")
print("="*70)

# Strategy 1: Mean aggregation
mean_score = frame_scores.mean()
print(f"\n1. MEAN aggregation: {mean_score:.4f}")
print(f"   Result: {'✅ DETECTED' if mean_score > 0.3 else '❌ NOT DETECTED'} (threshold: 0.3)")

# Strategy 2: Max aggregation (RECOMMENDED)
max_score = frame_scores.max()
print(f"\n2. MAX aggregation: {max_score:.4f}")
print(f"   Result: {'✅ DETECTED' if max_score > 0.5 else '❌ NOT DETECTED'} (threshold: 0.5)")

# Strategy 3: Frame-level detection
high_conf_frames = (frame_scores > 0.5).sum()
print(f"\n3. FRAME-LEVEL detection:")
print(f"   Frames with >0.5 confidence: {high_conf_frames}/{len(frame_scores)}")
print(f"   Result: {'✅ DETECTED' if high_conf_frames > 0 else '❌ NOT DETECTED'}")

# Show top predictions using MAX
print("\n" + "="*70)
print("TOP 10 PREDICTIONS (using MAX aggregation):")
print("="*70)
max_scores = scores.numpy().max(axis=0)
top_indices = max_scores.argsort()[-10:][::-1]
for idx in top_indices:
    print(f"{class_names[idx]:30s} - Confidence: {max_scores[idx]:.4f}")

print("\n" + "="*70)
print("RECOMMENDATION FOR PRODUCTION:")
print("="*70)
print(f"Use MAX aggregation with threshold 0.5")
print(f"Your audio: Max score = {max_score:.4f}")
if max_score > 0.5:
    print(f"✅ Would be detected in production!")
else:
    print(f"❌ Would NOT be detected (score too low)")