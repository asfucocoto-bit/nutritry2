# scripts/preprocess_data.py
import pandas as pd
import os

def preprocess_data():
    print("🔄 Preprocessing nutrition dataset...")

    # Load dataset
    df = pd.read_csv("data/nutritions.csv")
    print("✅ Dataset loaded successfully! Rows:", df.shape[0])


    # Drop duplicate rows, if any
    df = df.drop_duplicates()

    # Fill missing values with mean (for numeric columns)
    df.fillna(df.mean(numeric_only=True), inplace=True)

    # Keep only the useful columns
    selected_columns = [
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
        "Protein (g per 100g)",
        "food",
        "food_normalized"
    ]
    df = df[selected_columns]

    invalid_foods = ["beer", "wine", "vodka", "alcohol", "rum", "cocktail"]
    df = df[~df["food_normalized"].str.contains('|'.join(invalid_foods), case=False, na=False)]

    # Save processed dataset
    os.makedirs("data", exist_ok=True)
    df.to_csv("data/processed_diet.csv", index=False)

    print("✅ Data preprocessing complete! Saved to data/processed_diet.csv")

if __name__ == "__main__":
    preprocess_data()
