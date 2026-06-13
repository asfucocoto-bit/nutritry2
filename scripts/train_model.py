# scripts/train_model.py
import pandas as pd
from sklearn.cluster import KMeans
import joblib
import os

def train_models():
    print("🏋️ Training meal recommendation models...")

    # Load preprocessed data
    df = pd.read_csv("data/processed_diet.csv")

    # Features for clustering
    features = [
        "Vitamin C (mg per 100g)",
        "Vitamin B11 (mg per 100g)",
        "Sodium (mg per 100g)",
        "Calcium (mg per 100g)",
        "Carbohydrates (g per 100g)",
        "Iron (mg per 100g)",
        "Calories (kcal per 100g)",
        "Sugars (g per 100g)",
        "Dietary Fiber (g per 100g)",
        "Fat (g per 100g)",
        "Protein (g per 100g)"
    ]

    X = df[features]

    # Create folder for models
    os.makedirs("models", exist_ok=True)

    # Train 3 separate KMeans models (for 3 meals)
    for meal, k in zip(["breakfast", "lunch", "dinner"], [4, 5, 6]):
        model = KMeans(n_clusters=k, random_state=42)
        model.fit(X)
        joblib.dump(model, f"models/{meal}_model.pkl")
        print(f"✅ Saved {meal}_model.pkl")

    print("🎯 Training completed!")

if __name__ == "__main__":
    train_models()
