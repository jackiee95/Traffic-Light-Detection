import torch
from PIL import Image
import io

# Load YOLOv5 model from local weights
model = torch.hub.load('ultralytics/yolov5', 'custom', path='app/model/best.pt', force_reload=True)

def predict_traffic_light(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    results = model(img)
    labels = results.pandas().xyxy[0]['name'].tolist()
    return labels
