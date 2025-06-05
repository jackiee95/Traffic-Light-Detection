import os
import torch
import torch.nn as nn
from PIL import Image
import io
import numpy as np
from torchvision import transforms

# Define the model architecture (same as training)
class TrafficLightCNN(nn.Module):
    def __init__(self, num_classes=3):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Dropout(0.25)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 8 * 8, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, num_classes)
        )
    
    def forward(self, x):
        x = self.features(x)
        return self.classifier(x)

# Setup device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Load model
model_path = os.path.join(os.path.dirname(__file__), 'best.pt')
model = TrafficLightCNN().to(device)
model.load_state_dict(torch.load(model_path, map_location=device))
model.eval()

# Preprocessing transforms
transform = transforms.Compose([
    transforms.Resize((64, 64)),  # Match training size
    transforms.ToTensor(),
])

# Class mapping
class_names = {0: 'red', 1: 'yellow', 2: 'green'}

def predict_traffic_light(image_bytes):
    try:
        # Load and preprocess image
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_tensor = transform(img).unsqueeze(0).to(device)
        
        # Run prediction
        with torch.no_grad():
            outputs = model(img_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            confidence, pred_idx = torch.max(probabilities, 1)
        
        # Prepare response
        prediction = {
            "class": class_names[pred_idx.item()],
            "confidence": round(confidence.item(), 4),
            "class_index": pred_idx.item()
        }
        
        print(f"Prediction: {prediction}")
        return prediction
        
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return {"error": str(e)}