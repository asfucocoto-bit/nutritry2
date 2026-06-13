# MongoDB Setup Instructions

## Environment Variable Setup

1. Create a `.env` file in the root directory (F:\Ramm\NutriDiet\) with the following content:

```
MONGODB_PASSWORD=your_actual_password_here
```

2. Replace `your_actual_password_here` with your actual MongoDB password.

## Alternative: Direct Connection String

If you prefer to set the connection string directly in the code, you can modify `app.py` line 19:

```python
MONGODB_URI = ""
```

Replace `""` with your MONGODB_URI.

## Testing Connection

After setting up, restart the Flask server. You should see:
- ✅ Connected to MongoDB successfully! (if connection works)
- ❌ MongoDB connection error: ... (if there's an issue)

## Notes

- The database name is: `NutriDiet`
- The collection name is: `user_data`
- MongoDB is schema-less, so no migration is needed

