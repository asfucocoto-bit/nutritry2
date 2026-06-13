import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

interface FormData {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  foodPreferences: string;
  allergies: string;
  healthGoal: string;
}

interface Results {
  bmi: number;
  bmr: number;
  category: string;
  meals: string[];
}

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    foodPreferences: "",
    allergies: "",
    healthGoal: "",
  });
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
    if (gender === "male") {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const formatMealName = (meal: string) => {
    // Capitalize first letter of each word
    return meal
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getMealSuggestions = (goal: string) => {
    const meals = {
      "Weight Loss": ["🥗 Greek Salad with Grilled Chicken", "🍎 Apple with Almond Butter", "🥙 Veggie Wrap with Hummus"],
      "Muscle Gain": ["🍗 Grilled Chicken Breast with Quinoa", "🥚 Scrambled Eggs with Avocado", "🥛 Protein Smoothie Bowl"],
      "Maintenance": ["🍛 Balanced Rice Bowl with Vegetables", "🥪 Whole Grain Sandwich", "🍲 Lentil Soup with Bread"],
    };
    return meals[goal as keyof typeof meals] || meals["Maintenance"];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, age, gender, height, weight, healthGoal } = formData;
    
    if (!name || !age || !gender || !height || !weight || !healthGoal) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Call Flask API (using proxy in dev, direct URL in production)
      const apiUrl = import.meta.env.DEV ? '/api/predict' : 'http://localhost:5000/api/predict';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          age,
          gender,
          height: parseFloat(height),
          weight: parseFloat(weight),
          healthGoal,
          foodPreferences: formData.foodPreferences,
          allergies: formData.allergies || 'none',
        }),
      });

      const data = await response.json();

      if (data.success) {
        const bmi = data.bmi;
        const bmr = data.bmr;
        const category = getBMICategory(bmi);
        const meals = [data.breakfast, data.lunch, data.dinner];

        setResults({
          bmi: parseFloat(bmi.toFixed(1)),
          bmr: Math.round(bmr),
          category,
          meals,
        });
        
        toast({
          title: "Results Ready!",
          description: "Your personalized nutrition plan has been generated",
        });
      } else {
        throw new Error(data.error || 'Failed to get predictions');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get predictions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen gradient-bg pt-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Your AI-Powered Nutrition Partner
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track your health, plan your meals, and reach your goals effortlessly.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 hover:scale-105 animate-glow text-lg px-8 py-6"
            onClick={() => document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            Get Started
          </Button>
        </section>

        {/* Form Section */}
        <section id="form-section" className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-start">
            <div className="w-full max-w-2xl">
              {/* Form Card */}
              <Card className="glass border-border/50 shadow-2xl animate-slide-in">
              <CardHeader>
                <CardTitle className="text-3xl">Your Health Profile</CardTitle>
                <CardDescription>Tell us about yourself to get personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="glass"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        className="glass"
                        placeholder="25"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger className="glass">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm) *</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => handleInputChange("height", e.target.value)}
                        className="glass"
                        placeholder="170"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg) *</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        className="glass"
                        placeholder="70"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="foodPreferences">Food Preferences</Label>
                    <Input
                      id="foodPreferences"
                      list="foodPreferencesList"
                      value={formData.foodPreferences}
                      onChange={(e) => handleInputChange("foodPreferences", e.target.value)}
                      className="glass"
                      placeholder="Select or type your preference..."
                    />
                    <datalist id="foodPreferencesList">
                      <option value="Vegetarian" />
                      <option value="Vegan" />
                      <option value="Pescatarian" />
                      <option value="Gluten-free" />
                      <option value="Dairy-free" />
                      <option value="Keto" />
                      <option value="Paleo" />
                      <option value="Mediterranean" />
                      <option value="Low-carb" />
                      <option value="High-protein" />
                      <option value="Halal" />
                      <option value="Kosher" />
                      <option value="No restrictions" />
                    </datalist>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input
                      id="allergies"
                      list="allergiesList"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange("allergies", e.target.value)}
                      className="glass"
                      placeholder="Select or type your allergies (comma-separated)..."
                    />
                    <datalist id="allergiesList">
                      <option value="Nuts" />
                      <option value="Peanuts" />
                      <option value="Tree nuts" />
                      <option value="Dairy" />
                      <option value="Lactose" />
                      <option value="Eggs" />
                      <option value="Shellfish" />
                      <option value="Fish" />
                      <option value="Soy" />
                      <option value="Wheat" />
                      <option value="Gluten" />
                      <option value="Sesame" />
                      <option value="Sulfites" />
                      <option value="None" />
                    </datalist>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="healthGoal">Health Goal *</Label>
                    <Select value={formData.healthGoal} onValueChange={(value) => handleInputChange("healthGoal", value)}>
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                        <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? "Calculating..." : "Get My Plan"}
                  </Button>
                </form>
              </CardContent>
            </Card>

              {/* Results Card */}
              {results && (
                <Card className="glass border-border/50 shadow-2xl animate-fade-in h-fit mt-8">
                <CardHeader>
                  <CardTitle className="text-3xl">Your Results</CardTitle>
                  <CardDescription>Personalized health metrics and meal suggestions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-1">BMI</p>
                      <p className="text-3xl font-bold text-primary">{results.bmi}</p>
                      <p className="text-xs text-muted-foreground mt-1">{results.category}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                      <p className="text-sm text-muted-foreground mb-1">BMR</p>
                      <p className="text-3xl font-bold text-secondary">{results.bmr}</p>
                      <p className="text-xs text-muted-foreground mt-1">cal/day</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Recommended Meals</h3>
                    <div className="space-y-3">
                      {results.meals.map((meal, index) => (
                        <div
                          key={index}
                          onClick={() => navigate(`/meal-details?meal=${encodeURIComponent(meal)}`)}
                          className="p-4 rounded-lg glass border border-border/50 hover:scale-105 transition-transform cursor-pointer hover:border-primary/50"
                        >
                          <p className="text-lg">{formatMealName(meal)}</p>
                          <p className="text-xs text-muted-foreground mt-1">Click to view details</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8 mt-20">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>© 2025 NutriGuide. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
