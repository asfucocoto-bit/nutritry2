import os
import sys

def run_preprocessing():
    os.system("python scripts/preprocess_data.py")

def run_training():
    os.system("python scripts/train_model.py")

def run_prediction():
    os.system("python scripts/predict_diet.py")

def main():
    while True:
        print("\n==============================")
        print("🥗  Personalized Diet Recommender  🥗")
        print("==============================")
        print("1. Preprocess Nutrition Data")
        print("2. Train Diet Recommendation Model")
        print("3. Get Personalized Diet Suggestion")
        print("4. Exit")
        print("==============================")

        choice = input("Enter your choice (1-4): ").strip()

        if choice == "1":
            run_preprocessing()
        elif choice == "2":
            run_training()
        elif choice == "3":
            run_prediction()
        elif choice == "4":
            print("👋 Exiting... Stay healthy and eat smart!")
            sys.exit(0)
        else:
            print("⚠️ Invalid choice. Please select a valid option (1-4).")

if __name__ == "__main__":
    main()
