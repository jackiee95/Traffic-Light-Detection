from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.model.predictor import predict_traffic_light

app = FastAPI()

# Allow frontend to connect (important for React/Flutter)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Traffic Light Detection API is working!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    labels = predict_traffic_light(image_bytes)
    return {"predictions": labels}
