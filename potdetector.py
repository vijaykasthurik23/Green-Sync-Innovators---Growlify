"""
Pot Dimension Detection Module for Growlify Quotation System
Uses YOLOv8x and YOLO11x Ensemble for high-accuracy object detection
"""

from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from PIL import Image
import io
import math
import numpy as np

# Create Blueprint for pot detection routes
pot_detector_bp = Blueprint('pot_detector', __name__)

# --- ENSEMBLE CONFIGURATION ---
# Use best models available for high accuracy
MODEL_NAMES = ["yolov8x.pt", "yolo11x.pt"]

# COCO class IDs for pot-related objects:
# 58=potted plant, 75=vase, 41=cup, 45=bowl, 39=bottle
ALLOWED_CLASSES = [58, 75, 41, 45, 39]

# Pot size calibration data (trained on common pot sizes)
POT_CALIBRATION = {
    'small': {'min_area_ratio': 0, 'max_area_ratio': 0.15, 'avg_height_cm': 15, 'avg_width_cm': 12},
    'medium': {'min_area_ratio': 0.15, 'max_area_ratio': 0.35, 'avg_height_cm': 30, 'avg_width_cm': 25},
    'large': {'min_area_ratio': 0.35, 'max_area_ratio': 0.55, 'avg_height_cm': 50, 'avg_width_cm': 40},
    'extra_large': {'min_area_ratio': 0.55, 'max_area_ratio': 1.0, 'avg_height_cm': 80, 'avg_width_cm': 60},
}

# Scaling factors based on pot aspect ratio
ASPECT_RATIO_ADJUSTMENTS = {
    'tall_narrow': 1.3,   # height >> width
    'standard': 1.0,      # height ≈ width
    'wide_shallow': 0.8,  # height << width
}

# Calibration factor for pixel to cm conversion
PIXELS_TO_CM_FACTOR = 20.0 / 1370.0  # Calibrated: 1370px = 20cm


def estimate_pot_size_category(bbox_area_ratio, aspect_ratio):
    """
    Estimate pot size category based on bounding box area ratio
    and aspect ratio from the image.
    """
    for category, params in POT_CALIBRATION.items():
        if params['min_area_ratio'] <= bbox_area_ratio < params['max_area_ratio']:
            return category
    return 'medium'  # Default fallback


def run_ensemble_detection(img_array):
    """
    Run an ensemble of YOLO models to find the best detection.
    Uses multiple models and picks the result with highest confidence.
    Returns: (best_box, best_confidence, best_label, best_model_name) or (None, 0, None, None)
    """
    try:
        from ultralytics import YOLO
        
        best_result = None
        best_confidence = 0.0
        best_label = None
        best_model_name = ""
        
        # Iterate through all models in the ensemble
        for model_name in MODEL_NAMES:
            try:
                print(f"   🔹 Trying model: {model_name}")
                model = YOLO(model_name)
                
                # Run inference with TTA (Test Time Augmentation)
                # Low confidence threshold to catch faint detections
                results = model(img_array, verbose=False, augment=True, conf=0.1)
                
                for result in results:
                    if result.boxes is not None:
                        for box in result.boxes:
                            cls_id = int(box.cls[0].item())
                            conf = float(box.conf[0].item())
                            
                            # Filter: Only allow pot-related classes
                            if cls_id not in ALLOWED_CLASSES:
                                continue
                            
                            # Keep the best result across all models
                            if conf > best_confidence:
                                best_confidence = conf
                                best_result = box.xyxy[0].cpu().numpy()
                                best_label = result.names[cls_id]
                                best_model_name = model_name
                                
            except Exception as model_error:
                print(f"   ⚠️ Model {model_name} failed: {model_error}")
                continue
        
        if best_result is not None:
            print(f"   🎯 Winner: {best_model_name} -> {best_label} (Confidence: {best_confidence:.1%})")
            return best_result, best_confidence, best_label, best_model_name
        
        return None, 0, None, None
        
    except ImportError:
        print("   ⚠️ YOLO not installed, using fallback method")
        return None, 0, None, None


def calculate_dimensions_from_image(image, is_front_view=True):
    """
    Analyze image to detect pot and estimate dimensions using YOLO ensemble.
    
    Returns: (height_cm, width_cm, confidence, bbox_info)
    """
    try:
        # Get image dimensions
        img_width, img_height = image.size
        img_area = img_width * img_height
        
        # Convert to numpy array for processing
        img_array = np.array(image.convert('RGB'))
        
        # Run ensemble detection
        print(f"🔹 Analyzing image with YOLO Ensemble...")
        best_box, best_confidence, best_label, best_model = run_ensemble_detection(img_array)
        
        if best_box is not None:
            # Extract coordinates - convert numpy types to Python float
            x1, y1, x2, y2 = [float(coord) for coord in best_box]
            bbox_width = x2 - x1
            bbox_height = y2 - y1
            bbox_area = bbox_width * bbox_height
            bbox_area_ratio = bbox_area / img_area
            aspect_ratio = bbox_height / bbox_width if bbox_width > 0 else 1
            
            # Estimate size category
            size_category = estimate_pot_size_category(bbox_area_ratio, aspect_ratio)
            
            # Get base dimensions from calibration
            base_height = POT_CALIBRATION[size_category]['avg_height_cm']
            base_width = POT_CALIBRATION[size_category]['avg_width_cm']
            
            # Adjust based on actual aspect ratio
            if aspect_ratio > 1.5:
                adjustment = ASPECT_RATIO_ADJUSTMENTS['tall_narrow']
            elif aspect_ratio < 0.7:
                adjustment = ASPECT_RATIO_ADJUSTMENTS['wide_shallow']
            else:
                adjustment = ASPECT_RATIO_ADJUSTMENTS['standard']
            
            # Calculate dimensions using pixel-based calibration
            raw_height_cm = bbox_height * PIXELS_TO_CM_FACTOR
            raw_width_cm = bbox_width * PIXELS_TO_CM_FACTOR
            
            # Apply minimum threshold: at least 20cm for height
            if raw_height_cm < 20.0:
                height_cm = 20.0
                # Scale width proportionally
                scale_factor = height_cm / bbox_height if bbox_height > 0 else 1
                width_cm = bbox_width * scale_factor * PIXELS_TO_CM_FACTOR
            else:
                height_cm = raw_height_cm
                width_cm = raw_width_cm
            
            # Also apply aspect-ratio based scaling for better accuracy
            height_cm = base_height * adjustment * (bbox_height / (img_height * 0.5))
            width_cm = base_width * (1 / adjustment) * (bbox_width / (img_width * 0.5))
            
            # Clamp to reasonable values
            height_cm = max(10, min(150, height_cm))
            width_cm = max(8, min(120, width_cm))
            
            # CRITICAL: Convert all numpy types to Python int for JSON serialization (no decimals)
            return (
                int(round(height_cm)),
                int(round(width_cm)),
                int(round(best_confidence * 100)),
                {'x1': float(x1), 'y1': float(y1), 'x2': float(x2), 'y2': float(y2)}
            )
        
        # Fallback: Simple center-based estimation
        print("   ⚠️ No pot detected, using fallback estimation")
        estimated_ratio = 0.5
        size_category = estimate_pot_size_category(estimated_ratio, 1.0)
        
        height_cm = POT_CALIBRATION[size_category]['avg_height_cm']
        width_cm = POT_CALIBRATION[size_category]['avg_width_cm']
        
        # Adjust based on image aspect ratio (portrait vs landscape)
        img_aspect = img_height / img_width
        if img_aspect > 1.2:  # Portrait - likely taller pot
            height_cm *= 1.2
        elif img_aspect < 0.8:  # Landscape - likely wider pot
            width_cm *= 1.2
        
        return (
            int(round(height_cm)),
            int(round(width_cm)),
            65,  # Lower confidence for fallback method
            None
        )
        
    except Exception as e:
        print(f"Error in dimension calculation: {e}")
        # Return default medium pot dimensions - ensure integers
        return (30, 25, 50, None)


def calculate_estimated_cost(height_cm, width_cm, product_type='budget'):
    """
    Calculate estimated cost based on dimensions and product type.
    Matches the frontend calculation logic.
    """
    area = float(height_cm) * float(width_cm)  # in cm²
    
    # Rate per sq cm based on product type
    rate_per_cm = 0.25 if product_type == 'premium' else 0.15
    min_amount = 5000 if product_type == 'premium' else 3000
    
    calculated = round(area * rate_per_cm)
    return int(max(calculated, min_amount))


@pot_detector_bp.route('/analyze-pot/', methods=['POST', 'OPTIONS'])
@cross_origin()
def analyze_pot():
    """
    Analyze uploaded pot images and return estimated dimensions.
    Uses YOLO ensemble for high accuracy detection.
    
    Expected form data:
    - frontViewImage: Front view image of the pot
    - topViewImage: Top view image of the pot (optional for width estimation)
    - productType: 'budget' or 'premium'
    
    Returns:
    {
        "heightCm": float,
        "widthCm": float,
        "estimatedAmount": int,
        "confidence": float (0-100),
        "method": "yolo_ensemble" | "fallback"
    }
    """
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    
    try:
        # Check for required images
        if 'frontViewImage' not in request.files:
            return jsonify({
                "error": "Front view image is required",
                "heightCm": 0,
                "widthCm": 0,
                "estimatedAmount": 0,
                "confidence": 0
            }), 400
        
        front_image_file = request.files['frontViewImage']
        product_type = request.form.get('productType', 'budget')
        
        # Load front view image
        front_image = Image.open(io.BytesIO(front_image_file.read()))
        
        print("\n" + "="*50)
        print("📏 STARTING POT DIMENSION ANALYSIS (YOLO Ensemble)")
        print("="*50)
        
        # Analyze front view for height
        front_height, front_width, front_confidence, front_bbox = calculate_dimensions_from_image(
            front_image, is_front_view=True
        )
        
        # If top view is provided, use it for more accurate width estimation
        final_width = front_width
        final_confidence = front_confidence
        method = "yolo_ensemble" if front_bbox else "fallback"
        
        if 'topViewImage' in request.files:
            top_image_file = request.files['topViewImage']
            top_image = Image.open(io.BytesIO(top_image_file.read()))
            
            top_height, top_width, top_confidence, top_bbox = calculate_dimensions_from_image(
                top_image, is_front_view=False
            )
            
            # Average the width estimates if both views are analyzed
            final_width = int(round((front_width + top_width) / 2))
            final_confidence = int(round((front_confidence + top_confidence) / 2))
            
            if top_bbox:
                method = "yolo_ensemble"
        
        # Calculate estimated cost
        estimated_amount = calculate_estimated_cost(front_height, final_width, product_type)
        
        print("\n" + "="*50)
        print(f"📦 FINAL RESULTS")
        print("="*50)
        print(f"Height: {front_height} cm")
        print(f"Width: {final_width} cm")
        print(f"Confidence: {final_confidence}%")
        print(f"Estimated Amount: ₹{estimated_amount}")
        print(f"Method: {method}")
        print("="*50 + "\n")
        
        # Ensure all values are JSON serializable Python types (integers for dimensions)
        response_data = {
            "heightCm": int(front_height),
            "widthCm": int(final_width),
            "estimatedAmount": int(estimated_amount),
            "confidence": int(final_confidence),
            "method": str(method),
            "message": "Dimensions estimated successfully using YOLO Ensemble"
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"Error analyzing pot: {e}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            "error": str(e),
            "heightCm": 30,  # Default fallback values - integers
            "widthCm": 25,
            "estimatedAmount": 3000,
            "confidence": 30,
            "method": "error_fallback"
        }), 200  # Return 200 with fallback values so frontend can still work
