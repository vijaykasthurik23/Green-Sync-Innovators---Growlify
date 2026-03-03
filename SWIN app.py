from flask import Flask, request, jsonify
import numpy as np
import json
import os
import torch
import timm
from flask_cors import CORS
from care_tips import CARE_TIPS
from utils import process_image
from pot_detector import pot_detector_bp

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Register pot detection blueprint
app.register_blueprint(pot_detector_bp)

# --- Configuration and Model Loading ---

# Ensure the 'models' directory exists and contains the model
MODEL_PATH = "models/swin_plant_disease_google_adapted.pth"
if not os.path.exists(MODEL_PATH):
    print(f"Error: Model not found at {MODEL_PATH}. Please ensure the model file is in the 'models' directory.")
    exit()

# Initialize Device and Load Swin Transformer
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
num_classes = len([k for k in CARE_TIPS.keys() if k != "default"])

model = timm.create_model(
    "swin_tiny_patch4_window7_224",
    pretrained=False,
    num_classes=num_classes
)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.to(DEVICE)
model.eval()

# Generate label list from care_tips explicitly to match the order
label = sorted([k for k in CARE_TIPS.keys() if k != "default"])

# --- Helper Functions ---

def model_predict(image_stream):
    """
    Predicts the disease of a plant from an image stream using the Swin Transformer model.
    Returns the disease info (name, cause, cure) from CARE_TIPS.
    """
    # Uses process_image from utils.py which handles resizing, EXIF, and conversions
    try:
        img_tensor, original_image = process_image(image_stream)
        img_tensor = img_tensor.to(DEVICE)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return None

    # Perform inference
    with torch.no_grad():
        outputs = model(img_tensor)
        probs = torch.nn.functional.softmax(outputs, dim=1)
        confidence, predicted_class_idx = torch.max(probs, 1)

    confidence_score = confidence.item() * 100
    predicted_label_name = label[predicted_class_idx.item()]
    
    # Check for Background classification
    if predicted_label_name == "Background_without_leaves":
         return {
            "name": predicted_label_name,
            "cause": "No disease or plant detected.",
            "cure": "Not applicable."
        }

    # Low Confidence Check
    if confidence_score < 30:
        return {
            "name": "Unknown",
            "cause": "Model confidence is too low to determine if there is a disease.",
            "cure": "Please upload a clearer, well-lit image of the leaf."
        }
        
    # Get structured care tips logic
    care_tip_text = CARE_TIPS.get(predicted_label_name, CARE_TIPS["default"])
    
    # We maintain the "name", "cause", "cure" structure for frontend compatibility
    # Splitting the care tip text into cause and cure based on formatting if possible
    # Fallback to general formatting if the structured text varies
    cause_text = "See cure for details."
    cure_text = care_tip_text
    
    if "**Look for:**" in care_tip_text and "**Action:**" in care_tip_text:
        parts = care_tip_text.split("**Action:**")
        cause_part = parts[0].split("**Look for:**")[-1].strip()
        cause_text = f"Symptom: {cause_part.replace('*', '').strip()}"
        cure_text = parts[1].replace('•', '\n-').strip()
    elif "✅" in care_tip_text:
        cause_text = "No disease present."
        cure_text = care_tip_text.replace('✅', '').strip()

    result = {
        "name": predicted_label_name,
        "cause": cause_text,
        "cure": cure_text
    }
    return result

# --- Flask Routes ---

@app.route('/', methods=['GET'])
def home():
    """
    A simple home route for the Flask backend.
    In a React-Flask setup, the React app serves the frontend.
    """
    return "This is the Flask backend for plant disease diagnosis. Please access the React frontend."

@app.route('/upload/', methods=['POST'])
def upload_image():
    """
    Handles image uploads for plant disease diagnosis.
    Expects a file with the field name 'img'.
    """
    if 'img' not in request.files:
        return jsonify({"error": "No image file provided in the request"}), 400
    
    image_file = request.files['img']
    
    if image_file.filename == '':
        return jsonify({"error": "No selected image file"}), 400

    # It's good practice to check allowed extensions, even if not saving
    allowed_extensions = {'png', 'jpg', 'jpeg', 'webp'}
    if '.' not in image_file.filename or image_file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({"error": "Invalid file type. Only JPG, PNG, WEBP are allowed."}), 400

    # Process the image directly from the stream
    prediction_data = model_predict(image_file.stream)

    if prediction_data:
        return jsonify({"prediction": prediction_data}), 200
    else:
        # This case might happen if extract_features returns None or label not found
        return jsonify({"error": "Could not process image or find prediction data."}), 500

if __name__ == "__main__":
    # Run the Flask app in debug mode (development only)
    app.run(debug=False, port=5001)
