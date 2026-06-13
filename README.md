# 🥗 NutriDiet - Personalized Diet Recommendation System

A full-stack web application that provides personalized diet recommendations using machine learning. The system analyzes user health data (age, gender, height, weight, goals) and recommends optimal meal plans for breakfast, lunch, and dinner.

![NutriDiet](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![Flask](https://img.shields.io/badge/Flask-3.0-green)

## ✨ Features

🔐 **User Authentication** - Secure sign up, sign in, and session management

🤖 **ML-Powered Recommendations** - Uses K-Means clustering to recommend meals based on nutritional requirements

📊 **Interactive Dashboard** - Visualize progress with charts and statistics

🎯 **Goal-Based Planning** - Supports weight loss, muscle gain, and maintenance goals

🚫 **Allergy Filtering** - Excludes allergens from meal recommendations

📱 **Responsive Design** - Modern UI built with React and Tailwind CSS

🍽️ **Meal Details** - View detailed nutritional information for each recommended meal

💾 **Data Persistence** - MongoDB integration for storing user data and meal history

## 🛠️ Tech Stack

### Backend
**Flask** - Python web framework
**scikit-learn** - Machine learning models (K-Means clustering)
**pandas** - Data processing and manipulation
**MongoDB** - NoSQL database for user data
**pymongo** - MongoDB driver for Python

### Frontend
**React 18** - UI library
**TypeScript** - Type-safe JavaScript
**Vite** - Build tool and dev server
**Tailwind CSS** - Utility-first CSS framework
**shadcn/ui** - High-quality React components
**React Router** - Client-side routing
**Recharts** - Chart library for data visualization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

**Python 3.8+** - [Download Python](https://www.python.org/downloads/)
**Node.js 18+** - [Download Node.js](https://nodejs.org/)
**npm** or **yarn** - Package managers (comes with Node.js)
**MongoDB Atlas Account** - [Sign up for free](https://www.mongodb.com/cloud/atlas) (or use local MongoDB)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/srimathi412/NutriDiet.git
cd NutriDiet
```

### 2. Backend Setup

```bash
# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd nutri-sparkle-guide-main

# Install Node.js dependencies
npm install
# or
yarn install
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
MONGODB_PASSWORD=your_mongodb_password
SECRET_KEY=your_secret_key_here
```

**Note**: Replace `your_mongodb_password` with your actual MongoDB Atlas password. For `SECRET_KEY`, you can generate a random key or leave it empty (the app will generate one automatically).

### 5. Database Setup

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier is sufficient)
3. Create a database user and get your connection string
4. Update the MongoDB URI in `app.py` (line 22) with your credentials
5. The database name is `NutriDiet` and collections (`user_data`, `users`) will be created automatically

For detailed MongoDB setup instructions, see [MONGODB_SETUP.md](MONGODB_SETUP.md).

### 6. Prepare Data and Models

The project includes pre-trained models, but if you need to retrain them:

```bash
# Preprocess the nutrition data
python scripts/preprocess_data.py

# Train the ML models
python scripts/train_model.py
```

## 🏃 Running the Application

### Start the Backend Server

```bash
# From the root directory
python app.py
```

The Flask server will start on `http://localhost:5000`

### Start the Frontend Development Server

```bash
# From the nutri-sparkle-guide-main directory
cd nutri-sparkle-guide-main
npm run dev
# or
yarn dev
```

The React app will start on `http://localhost:5173` (or another port if 5173 is busy)

### Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
NutriDiet/
├── app.py                 # Flask backend application
├── main.py                # CLI interface for data processing
├── requirements.txt       # Python dependencies
├── .gitignore            # Git ignore rules
│
├── data/                 # Nutrition datasets
│   ├── nutritions.csv
│   └── processed_diet.csv
│
├── database/             # Database setup scripts
│   └── db_setup.py
│
├── models/               # Trained ML models
│   ├── breakfast_model.pkl
│   ├── lunch_model.pkl
│   └── dinner_model.pkl
│
├── scripts/              # Utility scripts
│   ├── preprocess_data.py
│   ├── train_model.py
│   └── predict_diet.py
│
└── nutri-sparkle-guide-main/  # Frontend React application
    ├── src/
    │   ├── components/   # React components
    │   ├── pages/        # Page components
    │   ├── hooks/        # Custom React hooks
    │   └── lib/          # Utility functions
    ├── public/           # Static assets
    └── package.json      # Node.js dependencies
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/me` - Get current user info

### Diet Recommendations
- `POST /api/predict` - Get personalized diet recommendations
  ```json
  {
    "name": "John Doe",
    "gender": "male",
    "age": 25,
    "height": 175,
    "weight": 70,
    "healthGoal": "weight_loss",
    "foodPreferences": "vegetarian",
    "allergies": "nuts, dairy"
  }
  ```

### Dashboard
- `GET /api/dashboard?user_id=<user_id>` - Get user dashboard data
- `GET /api/meal-details?meal=<meal_name>` - Get detailed meal nutrition info
- `GET /api/user/latest` - Get latest user data

## 💡 Usage

### Getting Diet Recommendations

1. **Sign Up / Sign In** - Create an account or log in
2. **Fill Health Information** - Enter your:
   - Name, age, gender
   - Height (cm) and weight (kg)
   - Health goal (weight loss, muscle gain, maintenance)
   - Food preferences (vegetarian, non-vegetarian, etc.)
   - Allergies (if any)
3. **Get Recommendations** - The system will:
   - Calculate your BMI and BMR
   - Determine your daily calorie and macronutrient needs
   - Recommend meals for breakfast, lunch, and dinner
4. **View Dashboard** - Track your progress with interactive charts
5. **Meal Details** - Click on any meal to see detailed nutritional information

### Training Models (Optional)

If you want to retrain the models with new data:

```bash
python main.py
```

Then select:
1. Preprocess Nutrition Data
2. Train Diet Recommendation Model
3. Get Personalized Diet Suggestion

## 🧪 How It Works

1. **Data Preprocessing**: The nutrition dataset is cleaned and processed
2. **Feature Extraction**: Key nutritional features are extracted (calories, protein, fat, carbs, vitamins, minerals)
3. **Model Training**: K-Means clustering is applied to group similar meals:
   Breakfast: 4 clusters
   Lunch: 5 clusters
   Dinner: 6 clusters
4. **Recommendation**: Based on user's nutritional requirements, meals are selected from appropriate clusters
5. **Filtering**: Allergies and food preferences are applied to filter recommendations

## 🐛 Troubleshooting

### MongoDB Connection Issues
Verify your MongoDB password in the `.env` file
Check if your IP address is whitelisted in MongoDB Atlas
Ensure the connection string is correct in `app.py`

### Model Loading Errors
Ensure the model files (`.pkl`) exist in the `models/` directory
Run `python scripts/train_model.py` to generate models if missing

### Frontend Build Issues
Delete `node_modules` and `package-lock.json`, then run `npm install` again
Check Node.js version (requires 18+)

### Port Already in Use
Change the port in `app.py` (backend) or `vite.config.ts` (frontend)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

**srimathi412** - *Initial work* - [GitHub](https://github.com/srimathi412)

## 🙏 Acknowledgments

Nutrition data sources
scikit-learn community for ML tools
React and Flask communities
shadcn/ui for beautiful components

## 📞 Support

For support, email srimathi4125@gmail.com or create an issue in the repository.



