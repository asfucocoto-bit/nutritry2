from flask import Flask, render_template, request
import pandas as pd
import joblib
import sqlite3
import os

app = Flask(__name__)

# ✅ Define nutrient calculation here instead of importing
def calculate_nutrient_requirements(age, gender, height, weight, goal):
    """Calculate basic nutrient needs."""
    bmr = 10 * weight + 6.25 * height - 5 * age + (5 if gender.lower() == "m" else -161)
    if goal.lower() == "weight_loss":
        calories = bmr - 300
    elif goal.lower() == "muscle_gain":
        calories = bmr + 300
    else:
        calories = bmr
    protein = (calories * 0.3) / 4
    fat = (calories * 0.25) / 9
    carbs = (calories * 0.45) / 4
    return calories, protein, fat, carbs


# ✅ Save user data in database (creates DB if not exists)
def save_user_data(name, gender, age, height, weight, goal, food_type, allergies,
                   calories, protein, fat, carbs, breakfast, lunch, dinner):
    os.makedirs("database", exist_ok=True)
    conn = sqlite3.connect("database/diet_users.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            gender TEXT,
            age INTEGER,
            height REAL,
            weight REAL,
            goal TEXT,
            food_type TEXT,
            allergies TEXT,
            calories REAL,
            protein REAL,
            fat REAL,
            carbs REAL,
            breakfast TEXT,
            lunch TEXT,
            dinner TEXT
        )
    """)

    cursor.execute("""
        INSERT INTO user_data (
            name, gender, age, height, weight, goal, food_type, allergies,
            calories, protein, fat, carbs, breakfast, lunch, dinner
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (name, gender, age, height, weight, goal, food_type, allergies,
          calories, protein, fat, carbs, breakfast, lunch, dinner))

    conn.commit()
    conn.close()


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    # ✅ Get user input
    name = request.form['name']
    gender = request.form['gender']
    age = int(request.form['age'])
    height = float(request.form['height'])
    weight = float(request.form['weight'])
    goal = request.form['goal']
    food_type = request.form['food_type']
    allergies = request.form.get('allergies', '')

    # ✅ Load dataset
    df = pd.read_csv("data/processed_diet.csv")

    # ✅ Load models
    breakfast_model = joblib.load("models/breakfast_model.pkl")
    lunch_model = joblib.load("models/lunch_model.pkl")
    dinner_model = joblib.load("models/dinner_model.pkl")

    # ✅ Filter allergies if any
    if allergies and allergies.lower() != "none":
        allergy_list = [a.strip() for a in allergies.split(",")]
        df = df[~df['food'].str.contains('|'.join(allergy_list), case=False, na=False)]

    # ✅ Calculate nutrient needs
    calories, protein, fat, carbs = calculate_nutrient_requirements(age, gender, height, weight, goal)

    # ✅ Features for model prediction
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

    # ✅ Predict clusters (not used, but shows model usage)
    df['breakfast_cluster'] = breakfast_model.predict(df[features])
    df['lunch_cluster'] = lunch_model.predict(df[features])
    df['dinner_cluster'] = dinner_model.predict(df[features])

    # ✅ Select random recommendations
    breakfast = df[df['breakfast_cluster'] == df['breakfast_cluster'].mode()[0]].sample(1).iloc[0]['food']
    lunch = df[df['lunch_cluster'] == df['lunch_cluster'].mode()[0]].sample(1).iloc[0]['food']
    dinner = df[df['dinner_cluster'] == df['dinner_cluster'].mode()[0]].sample(1).iloc[0]['food']

    # ✅ Save user data
    save_user_data(name, gender, age, height, weight, goal, food_type, allergies,
                   calories, protein, fat, carbs, breakfast, lunch, dinner)

    # ✅ Show output to user
    return render_template('index.html',
                           name=name,
                           calories=round(calories),
                           protein=round(protein),
                           fat=round(fat),
                           carbs=round(carbs),
                           breakfast=breakfast,
                           lunch=lunch,
                           dinner=dinner)


if __name__ == '__main__':
    app.run(debug=True)
