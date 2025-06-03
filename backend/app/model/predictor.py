import sys
import os
import torch
from PIL import Image
import io
import numpy as np  # Added import

# Adjust path to yolov5 directory relative to predictor.py
sys.path.append(os.path.join(os.path.dirname(__file__), 'yolov5'))

from models.common import DetectMultiBackend
from utils.general import non_max_suppression, scale_coords
from utils.torch_utils import select_device
from utils.augmentations import letterbox
from torchvision import transforms

# Setup device
device = select_device('')

FILE = os.path.dirname(__file__)

# Load model
model_path = os.path.join(FILE, 'best.pt')
model = torch.load(model_path, map_location=device)['model'].float()
model.eval()

def predict_traffic_light(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_np = np.array(img)
    img_resized = letterbox(img_np, new_shape=640)[0]
    img_tensor = transforms.ToTensor()(img_resized).unsqueeze(0).to(device)

    with torch.no_grad():
        pred = model(img_tensor)[0]
        detections = non_max_suppression(pred, conf_thres=0.25, iou_thres=0.45)[0]

    output = []
    if detections is not None and len(detections):
        detections[:, :4] = scale_coords(img_tensor.shape[2:], detections[:, :4], img_resized.shape).round()
        for *xyxy, conf, cls in detections:
            bbox = [float(xyxy[0]), float(xyxy[1]), float(xyxy[2]), float(xyxy[3])]
            output.append({
                "label": int(cls.item()),  # Replace with class name if you have a mapping
                "confidence": float(conf.item()),
                "bbox": bbox
            })
    
    print(f"Predictions: {output}")  # Debugging output
    if not output:
        print("No traffic light detected.")
        output = ["No traffic light detected."]
    else:
        print(f"Detected {len(output)} traffic lights.")
    return output