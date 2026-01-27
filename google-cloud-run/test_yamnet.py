import tensorflow as tf
import tensorflow_hub as hub
import csv
import io

print("Loading YAMNet model...")
model = hub.load('https://www.kaggle.com/models/google/yamnet/TensorFlow2/yamnet/1')
print("Model loaded successfully!\n")

# Get class names
def class_names_from_csv(class_map_csv_text):
    """Returns list of class names corresponding to score vector."""
    class_map_csv = io.StringIO(class_map_csv_text)
    class_names = [display_name for (class_index, mid, display_name) in csv.reader(class_map_csv)]
    class_names = class_names[1:]  # Skip CSV header
    return class_names

class_map_path = model.class_map_path().numpy()
class_names = class_names_from_csv(tf.io.read_file(class_map_path).numpy().decode('utf-8'))

print(f"Total classes: {len(class_names)}\n")

# Search for toilet-related classes
print("Searching for toilet/water/plumbing related sounds:")
print("-" * 60)
for idx, name in enumerate(class_names):
    if any(keyword in name.lower() for keyword in ['toilet', 'flush', 'water', 'plumbing', 'pour', 'liquid']):
        print(f"Index {idx:3d}: {name}")

print("\n" + "=" * 60)
print("Looking specifically for 'Toilet flush':")
try:
    toilet_idx = class_names.index('Toilet flush')
    print(f"✅ Found 'Toilet flush' at index: {toilet_idx}")
except ValueError:
    print("❌ 'Toilet flush' not found with exact match")
    # Try case-insensitive
    for idx, name in enumerate(class_names):
        if 'toilet' in name.lower() and 'flush' in name.lower():
            print(f"Found similar: Index {idx}: {name}")