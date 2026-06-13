import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp, Target, Award, Calendar, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

interface DashboardData {
  user: {
    name: string;
    weight: number;
    height: number;
    age: number;
    gender: string;
    goal: string;
  };
  stats: {
    current_weight: number;
    start_weight: number;
    weight_change: number;
    current_bmi: number;
    bmi_category: string;
    goal_progress: number;
    tracking_days: number;
  };
  charts: {
    weight_data: Array<{ date: string; weight: number; goal: number }>;
    bmi_data: Array<{ date: string; bmi: number; category: string }>;
    calorie_data: Array<{ date: string; consumed: number; burned: number; target: number }>;
    goal_data: Array<{ goal: string; achieved: number; target: number }>;
  };
  nutrients: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

const Dashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const apiUrl = import.meta.env.DEV ? '/api/dashboard' : 'http://localhost:5000/api/dashboard';
      const url = userId ? `${apiUrl}?user_id=${userId}` : apiUrl;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setDashboardData(data);
      } else {
        throw new Error(data.message || 'Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load dashboard data. Please submit the form first.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen gradient-bg pt-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </>
    );
  }

  if (!dashboardData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen gradient-bg pt-16 flex items-center justify-center">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>No Data Available</CardTitle>
              <CardDescription>Please submit the form on the home page first to generate your dashboard.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </>
    );
  }

  const { stats, charts } = dashboardData;
  const currentWeight = stats.current_weight;
  const startWeight = stats.start_weight;
  const weightChange = stats.weight_change;
  const currentBMI = stats.current_bmi;
  const goalProgress = stats.goal_progress;

  return (
    <>
      <Navbar />
      <div className="min-h-screen gradient-bg pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Progress Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your journey towards better health
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-in">
            <Card className="glass border-border/50 hover:scale-105 transition-transform">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Weight Change</CardTitle>
                <TrendingDown className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">-{weightChange.toFixed(1)} kg</div>
                <p className="text-xs text-muted-foreground mt-1">
                  From {startWeight.toFixed(1)} kg to {currentWeight.toFixed(1)} kg
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-border/50 hover:scale-105 transition-transform">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Current BMI</CardTitle>
                <Target className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">{currentBMI}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.bmi_category}
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-border/50 hover:scale-105 transition-transform">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
                <Award className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{Math.max(0, 100 - goalProgress).toFixed(0)}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.abs(weightChange).toFixed(1)} kg {weightChange > 0 ? 'lost' : 'gained'}
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-border/50 hover:scale-105 transition-transform">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tracking Days</CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.tracking_days}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.floor(stats.tracking_days / 7)} weeks of data
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <Tabs defaultValue="weight" className="space-y-4">
            <TabsList className="glass border-border/50">
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="bmi">BMI</TabsTrigger>
              <TabsTrigger value="calories">Calories</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>

            <TabsContent value="weight" className="space-y-4 animate-fade-in">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Weight Progress Over Time</CardTitle>
                  <CardDescription>
                    Track your weight changes and compare with your goal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={charts.weight_data}>
                      <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorGoal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="weight"
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#colorWeight)"
                        strokeWidth={3}
                      />
                      <Area
                        type="monotone"
                        dataKey="goal"
                        stroke="hsl(var(--secondary))"
                        fillOpacity={1}
                        fill="url(#colorGoal)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bmi" className="space-y-4 animate-fade-in">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>BMI Trend</CardTitle>
                  <CardDescription>
                    Monitor your Body Mass Index over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={charts.bmi_data}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="bmi"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--secondary))", r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <p className="text-xs text-muted-foreground">Underweight</p>
                      <p className="font-semibold text-sm">{"<"}18.5</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-xs text-muted-foreground">Normal</p>
                      <p className="font-semibold text-sm">18.5-24.9</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <p className="text-xs text-muted-foreground">Overweight</p>
                      <p className="font-semibold text-sm">25-29.9</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-xs text-muted-foreground">Obese</p>
                      <p className="font-semibold text-sm">≥30</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calories" className="space-y-4 animate-fade-in">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Calorie Balance</CardTitle>
                  <CardDescription>
                    Compare calories consumed vs burned throughout the week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={charts.calorie_data}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="consumed" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="burned" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="goals" className="space-y-4 animate-fade-in">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Goal Achievements</CardTitle>
                  <CardDescription>
                    Your progress towards weekly health goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={charts.goal_data} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                      <YAxis type="category" dataKey="goal" stroke="hsl(var(--muted-foreground))" width={120} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="achieved" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-6 space-y-3">
                    {charts.goal_data.map((goal, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg glass border border-border/50">
                        <span className="font-medium">{goal.goal}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                              style={{ width: `${goal.achieved}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold w-12 text-right">{goal.achieved}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Insights Section */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Key Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <Award className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Weight Loss Streak</p>
                    <p className="text-sm text-muted-foreground">Consistent progress for 8 weeks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                  <Award className="h-5 w-5 text-secondary mt-0.5" />
                  <div>
                    <p className="font-semibold">BMI Improvement</p>
                    <p className="text-sm text-muted-foreground">Reduced BMI by 1.4 points</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <Award className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-semibold">Calorie Balance</p>
                    <p className="text-sm text-muted-foreground">Maintained healthy deficit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-secondary" />
                  Next Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg glass border border-border/50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold">Reach Goal Weight</p>
                    <span className="text-sm text-primary font-semibold">0.8 kg to go</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary w-[84%]" />
                  </div>
                </div>
                <div className="p-3 rounded-lg glass border border-border/50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold">Complete 100 Days</p>
                    <span className="text-sm text-secondary font-semibold">44 days to go</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-secondary to-accent w-[56%]" />
                  </div>
                </div>
                <div className="p-3 rounded-lg glass border border-border/50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold">BMI Under 23</p>
                    <span className="text-sm text-accent font-semibold">0.1 to go</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent to-primary w-[95%]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
