from flask import Flask, render_template, request, url_for, jsonify
from flask_cors import CORS  # Import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from werkzeug.utils import secure_filename
import pathlib

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes and origins

# Get the absolute path to the directory where the script is located
BASE_DIR = pathlib.Path(__file__).parent.absolute()
MODEL_PATH = os.path.join(BASE_DIR.parent, 'model.h5')

# Check if model file exists before loading
try:
    model = load_model(MODEL_PATH)
    print(f"[INFO] Model loaded successfully from {MODEL_PATH}")
except FileNotFoundError:
    print(f"[ERROR] Model file not found at: {MODEL_PATH}")
    print("[ERROR] Please ensure 'model.h5' is in the directory above 'server'.")
    model = None
except Exception as e:
    print(f"[ERROR] Error loading model from {MODEL_PATH}: {e}")
    model = None

UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
print(f"[INFO] Upload folder set to: {UPLOAD_FOLDER}")

def model_predict(img_path, model):
    if model is None:
        return None, 0.0

    print(f"[DEBUG] Loading image from: {img_path}")
    try:
        img = image.load_img(img_path, target_size=(128, 128))
        print(f"[DEBUG] Image loaded successfully.")
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        print(f"[DEBUG] Image array shape: {img_array.shape}")
        prediction = model.predict(img_array)[0][0]
        print(f"[DEBUG] Raw prediction output: {prediction}")

        is_pothole = bool(prediction > 0.5)
        confidence = float(prediction)

        return is_pothole, confidence
    except Exception as e:
        print(f"[ERROR] Error during model prediction for {img_path}: {e}")
        return None, 0.0

# Route for the web interface (renders HTML template)
@app.route('/', methods=['GET', 'POST'])
def index():
    prediction_result = None
    image_filename = None
    error = None

    if request.method == 'POST':
        print("[DEBUG] POST request received for /.")
        if 'file' not in request.files:
            error = 'No file part in the request'
        else:
            file = request.files['file']
            if file.filename == '':
                error = 'No selected file'
            else:
                if file:
                    filename = secure_filename(file.filename)
                    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

                    try:
                        file.save(filepath)
                        print(f"[DEBUG] File saved to: {filepath}")

                        is_pothole, confidence = model_predict(filepath, model)

                        if is_pothole is not None:
                            status = 'Pothole Detected' if is_pothole else 'Road is Normal'
                            prediction_result = {
                                'status': status,
                                'confidence': f'{confidence:.2f}'
                            }
                            image_filename = os.path.join('uploads', filename)
                            print(f"[DEBUG] Prediction result: {prediction_result}, Image path for template: {image_filename}")
                        else:
                            error = 'Error during model prediction.'
                            print(f"[ERROR] Model prediction failed for {filepath}")

                    except Exception as e:
                        error = f'Error processing file: {e}'
                        print(f"[ERROR] Error processing file {filename}: {e}")
                else:
                    error = 'File upload failed.'

    return render_template('index.html', prediction=prediction_result, image_path=image_filename, error=error)

# API endpoint for React frontend
@app.route('/api/detect', methods=['POST'])
def detect():
    print("[DEBUG] POST request received for /api/detect.")
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        try:
            file.save(filepath)
            print(f"[DEBUG] File saved to: {filepath}")

            is_pothole, confidence = model_predict(filepath, model)

            if is_pothole is not None:
                status = 'Pothole Detected' if is_pothole else 'Road is Normal'
                image_url = url_for('static', filename=f'uploads/{filename}', _external=True)
                return jsonify({
                    'prediction': {
                        'status': status,
                        'confidence': f'{confidence:.2f}',
                        'image_path': image_url
                    }
                }), 200
            else:
                return jsonify({'error': 'Error during model prediction.'}), 500

        except Exception as e:
            print(f"[ERROR] Error processing file {filename}: {e}")
            return jsonify({'error': f'Error processing file: {str(e)}'}), 500
    else:
        return jsonify({'error': 'File upload failed.'}), 400

if __name__ == '__main__':
    print("[INFO] Starting Flask web server for pothole detection on port 5005...")
    app.run(port=5005, debug=True, threaded=False)