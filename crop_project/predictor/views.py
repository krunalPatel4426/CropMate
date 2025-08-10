# predictor/views.py

from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import numpy as np
import pickle
import requests
import os

# Build the path to the model file
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')

# Load the machine learning model
with open(model_path, 'rb') as model_file:
    model = pickle.load(model_file)

@api_view(['GET'])
def home(request):
    """
    A simple view to return a welcome message.
    """
    return Response({"message": "Hello from Django backend"})

@api_view(['POST'])
def predict(request):
    """
    Handles the prediction logic for crop recommendation.
    """
    try:
        data = request.data
        
        # Extract features from the request data
        features = np.array([[
            data['Nitrogen'],
            data['Phosphorus'],
            data['Potassium'],
            data['Temperature'],
            data['Humidity'],
            data['pH'],
            data['Rainfall']
        ]])
        
        crop_dict = {
            1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut", 6: "Papaya", 7: "Orange",
            8: "Apple", 9: "Muskmelon", 10: "Watermelon", 11: "Grapes", 12: "Mango", 13: "Banana",
            14: "Pomegranate", 15: "Lentil", 16: "Blackgram", 17: "Mungbean", 18: "Mothbeans",
            19: "Pigeonpeas", 20: "Kidneybeans", 21: "Chickpea", 22: "Coffee"
        }

        # Make a prediction
        prediction = model.predict_proba(features)
        
        # Get top 5 predictions
        top5_indices = np.argsort(prediction[0])[-5:]
        top5_crops = [crop_dict[idx + 1] for idx in reversed(top5_indices)]

        result = {
            "message": "Prediction successful",
            "id": data.get('id'),
            "Crop1": top5_crops[0],
            "Crop2": top5_crops[1],
            "Crop3": top5_crops[2],
            "Crop4": top5_crops[3],
            "Crop5": top5_crops[4],
        }

        # Post the result to another API
        crop_api_url = "http://localhost:4999/crop"
        crop_response = requests.post(crop_api_url, json=result)

        if crop_response.status_code == 200:
            print("Crop data saved successfully")
        else:
            print(f"Failed to save crop data: {crop_response.text}")
        
        return Response(result, status=status.HTTP_200_OK)

    except KeyError as e:
        return Response({"error": f"Missing feature in request: {e}"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
