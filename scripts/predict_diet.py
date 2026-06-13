# scripts/predict_diet.py
import pandas as pd
import joblib
import numpy as np
import sqlite3

# -------------------------
# Function to save user input & results to database
# -------------------------
def save_user_data(name, gender, age, height, weight, diet_goal, food_pref, allergies, calories, protein, fat, carbs, breakfast, lunch, dinner):
    conn = sqlite3.connect("database/diet_users.db")
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO user_data 
        (name, gender, age, height, weight, diet_goal, food_preference, allergies, calories, protein, fat, carbs, breakfast, lunch, dinner)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (name, gender, age, height, weight, diet_goal, food_pref, allergies, calories, protein, fat, carbs, breakfast, lunch, dinner))
    conn.commit()
    conn.close()
    print("💾 User data and meal plan saved to database.")



# -------------------------
# Function to collect user input
# -------------------------
def get_user_input():
    print("\n👤 Enter your details:")
    name = input("Name: ").strip()
    gender = input("Gender (M/F): ").strip().upper()
    age = int(input("Age (years): "))
    height = float(input("Height (cm): "))
    weight = float(input("Weight (kg): "))
    goal = input("Diet goal (weight_loss / muscle_gain / maintenance): ").strip().lower()
    food_type = input("Food preference (veg / nonveg): ").strip().lower()
    allergies = input("Do you have any food allergies? (comma-separated if many, or 'none'): ").strip()

    return name, gender, age, height, weight, goal, food_type, allergies


# -------------------------
# Function to calculate nutrient targets
# -------------------------
def calculate_nutrient_requirements(age, gender, height, weight, goal):
    # Estimate calorie requirement (Mifflin-St Jeor formula)
    if gender == "M":
        calories = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        calories = 10 * weight + 6.25 * height - 5 * age - 161

    if goal == "weight_loss":
        calories -= 300
    elif goal == "muscle_gain":
        calories += 300

    protein = weight * 1.2
    fat = (0.25 * calories) / 9
    carbs = (0.5 * calories) / 4

    return calories, protein, fat, carbs


# -------------------------
# Function to recommend meals
# -------------------------
def recommend_meals():
    df = pd.read_csv("data/processed_diet.csv")

    # Load models
    breakfast_model = joblib.load("models/breakfast_model.pkl")
    lunch_model = joblib.load("models/lunch_model.pkl")
    dinner_model = joblib.load("models/dinner_model.pkl")

    # Get user input
    name, gender, age, height, weight, goal, food_type, allergies = get_user_input()

    
    # Filter out allergy items
    if allergies.lower() != "none" and allergies.strip() != "":
        allergy_list = [a.strip() for a in allergies.split(",")]
        df = df[~df['food'].str.contains('|'.join(allergy_list), case=False, na=False)]
        print(f"\n⚠️ Foods containing {', '.join(allergy_list)} have been removed from recommendations.")

    # Calculate nutrient targets
    calories, protein, fat, carbs = calculate_nutrient_requirements(age, gender, height, weight, goal)
    print(f"\n🍽 Your daily target: {calories:.0f} kcal | {protein:.0f}g protein | {fat:.0f}g fat | {carbs:.0f}g carbs")

    # Features used by models
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

    # Predict clusters for each meal (based on nutrition similarity)
    df['breakfast_cluster'] = breakfast_model.predict(df[features])
    df['lunch_cluster'] = lunch_model.predict(df[features])
    df['dinner_cluster'] = dinner_model.predict(df[features])

    # Select one random item from each cluster
    breakfast = df.sample(1).iloc[0]['food']
    lunch = df.sample(1).iloc[0]['food']
    dinner = df.sample(1).iloc[0]['food']

    print("\n🍳 Recommended Meals for You:")
    print(f"🥣 Breakfast → {breakfast}")
    print(f"🍛 Lunch → {lunch}")
    print(f"🍲 Dinner → {dinner}")

    # ✅ Save everything to the database
    save_user_data(name, gender, age, height, weight, goal, food_type, allergies,
                   calories, protein, fat, carbs, breakfast, lunch, dinner)


# -------------------------
if __name__ == "__main__":
    recommend_meals()
