import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Loader2 } from "lucide-react";

interface MealData {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  dietaryFiber: number;
  sugars: number;
  vitaminC: number;
  vitaminB11: number;
  sodium: number;
  calcium: number;
  iron: number;
}

const MealDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mealData, setMealData] = useState<MealData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mealName = searchParams.get('meal');
    if (!mealName) {
      toast({
        title: "Error",
        description: "No meal specified",
        variant: "destructive",
      });
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    fetchMealDetails(mealName);
  }, [searchParams, navigate, toast]);

  const fetchMealDetails = async (mealName: string) => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.DEV ? '/api/meal-details' : 'http://localhost:5000/api/meal-details';
      const response = await fetch(`${apiUrl}?meal=${encodeURIComponent(mealName)}`);
      const data = await response.json();

      if (data.success) {
        setMealData(data.meal);
      } else {
        throw new Error(data.error || 'Failed to load meal details');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load meal details",
        variant: "destructive",
      });
      setTimeout(() => navigate("/"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const formatMealName = (meal: string) => {
    return meal
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const generateIngredients = (mealName: string) => {
    // Generate basic ingredients based on meal name
    const nameLower = mealName.toLowerCase();
    const ingredients: string[] = [];
    
    // Extract main ingredient from name
    const words = nameLower.split(' ');
    const mainIngredient = words[0];
    ingredients.push(formatMealName(mainIngredient));
    
    // Add common ingredients based on meal type
    if (nameLower.includes('juice')) {
      ingredients.push('Water', 'Natural Sweeteners');
    } else if (nameLower.includes('butter') || nameLower.includes('oil')) {
      ingredients.push('Natural Oils', 'Preservatives');
    } else if (nameLower.includes('cooked')) {
      ingredients.push('Water', 'Salt', 'Spices');
    } else {
      ingredients.push('Natural Ingredients', 'Seasonings');
    }
    
    return ingredients;
  };

  const generateRecipe = (mealName: string) => {
    const nameLower = mealName.toLowerCase();
    
    if (nameLower.includes('juice')) {
      return `1. Extract fresh juice from ${formatMealName(mealName.split(' juice')[0])}
2. Strain to remove pulp if desired
3. Serve chilled or at room temperature
4. Best consumed fresh for maximum nutrition`;
    } else if (nameLower.includes('butter') || nameLower.includes('oil')) {
      return `1. Use high-quality source ingredients
2. Process using cold-press method when applicable
3. Store in a cool, dark place
4. Use as a spread or cooking ingredient
5. Refrigerate after opening`;
    } else if (nameLower.includes('cooked')) {
      return `1. Clean and prepare the main ingredient
2. Add water and bring to a boil
3. Reduce heat and simmer until tender
4. Season with salt and spices to taste
5. Serve warm as a side dish or main course`;
    } else {
      return `1. Prepare fresh ingredients
2. Follow standard preparation methods
3. Cook until desired texture is achieved
4. Season to taste
5. Serve immediately for best flavor and nutrition`;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen gradient-bg pt-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading meal details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!mealData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen gradient-bg pt-16 flex items-center justify-center">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Meal Not Found</CardTitle>
              <CardDescription>Unable to load meal details</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")} className="w-full mt-4">
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const ingredients = generateIngredients(mealData.name);
  const recipe = generateRecipe(mealData.name);

  return (
    <>
      <Navbar />
      <div className="min-h-screen gradient-bg pt-16">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          {/* Meal Name Header */}
          <Card className="glass border-border/50 shadow-2xl mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-4xl">{formatMealName(mealData.name)}</CardTitle>
              <CardDescription>Complete nutritional information and recipe</CardDescription>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Recipe & Ingredients */}
            <div className="space-y-6">
              {/* Ingredients Card */}
              <Card className="glass border-border/50 shadow-2xl animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-2xl">Ingredients</CardTitle>
                  <CardDescription>Main components of this meal</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-primary">•</span>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Recipe Card */}
              <Card className="glass border-border/50 shadow-2xl animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-2xl">Recipe</CardTitle>
                  <CardDescription>Preparation instructions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {recipe}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Nutrition Facts */}
            <div className="space-y-6">
              {/* Main Nutrients Card */}
              <Card className="glass border-border/50 shadow-2xl animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-2xl">Nutrition Facts</CardTitle>
                  <CardDescription>Per 100g serving</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-1">Protein</p>
                      <p className="text-3xl font-bold text-primary">{mealData.protein.toFixed(1)}g</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                      <p className="text-sm text-muted-foreground mb-1">Carbohydrates</p>
                      <p className="text-3xl font-bold text-secondary">{mealData.carbohydrates.toFixed(1)}g</p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <p className="text-sm text-muted-foreground mb-1">Fat</p>
                      <p className="text-3xl font-bold text-accent">{mealData.fat.toFixed(1)}g</p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-sm text-muted-foreground mb-1">Calories</p>
                      <p className="text-3xl font-bold text-green-500">{mealData.calories.toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground mt-1">kcal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Nutrients Card */}
              <Card className="glass border-border/50 shadow-2xl animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-2xl">Additional Nutrients</CardTitle>
                  <CardDescription>Vitamins and minerals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Dietary Fiber</p>
                      <p className="text-lg font-semibold">{mealData.dietaryFiber.toFixed(1)}g</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Sugars</p>
                      <p className="text-lg font-semibold">{mealData.sugars.toFixed(1)}g</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Vitamin C</p>
                      <p className="text-lg font-semibold">{mealData.vitaminC.toFixed(2)}mg</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Vitamin B11</p>
                      <p className="text-lg font-semibold">{mealData.vitaminB11.toFixed(2)}mg</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Sodium</p>
                      <p className="text-lg font-semibold">{mealData.sodium.toFixed(2)}mg</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Calcium</p>
                      <p className="text-lg font-semibold">{mealData.calcium.toFixed(1)}mg</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Iron</p>
                      <p className="text-lg font-semibold">{mealData.iron.toFixed(2)}mg</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MealDetails;
