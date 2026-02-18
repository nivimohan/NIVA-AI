import { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, Dumbbell, UtensilsCrossed, Plus, Minus, Flame, Trophy } from "lucide-react";

const Wellness = () => {
  const [waterCount, setWaterCount] = useState(6);
  const [streak, setStreak] = useState(5);
  const waterGoal = 8;

  const dietPlan = [
    { day: "Mon", breakfast: "Oats Upma + Green Tea", lunch: "Dal Rice + Sabzi + Curd", dinner: "Chapati + Palak Paneer", snack: "Fruits + Nuts" },
    { day: "Tue", breakfast: "Idli Sambar", lunch: "Rajma Rice + Salad", dinner: "Khichdi + Buttermilk", snack: "Sprout Chaat" },
    { day: "Wed", breakfast: "Poha + Chai", lunch: "Chole + Brown Rice", dinner: "Moong Dal Cheela", snack: "Yogurt + Seeds" },
    { day: "Thu", breakfast: "Besan Cheela + Chutney", lunch: "Sambhar Rice + Papad", dinner: "Roti + Mix Veg Curry", snack: "Makhana" },
    { day: "Fri", breakfast: "Dalia Porridge", lunch: "Fish Curry + Rice", dinner: "Chapati + Egg Curry", snack: "Banana + Peanuts" },
    { day: "Sat", breakfast: "Paratha + Curd", lunch: "Paneer Tikka + Naan", dinner: "Soup + Grilled Veg", snack: "Chana Chaat" },
    { day: "Sun", breakfast: "Masala Dosa", lunch: "Chicken Biryani + Raita", dinner: "Roti + Dal Fry", snack: "Trail Mix" },
  ];

  const exercises = [
    { name: "Morning Walk", duration: "20 min", type: "Cardio", icon: "🚶" },
    { name: "Chair Yoga", duration: "15 min", type: "Flexibility", icon: "🧘" },
    { name: "Arm Circles", duration: "10 min", type: "Strength", icon: "💪" },
    { name: "Deep Breathing", duration: "10 min", type: "Relaxation", icon: "🫁" },
  ];

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Wellness</h1>
        <p className="text-muted-foreground">Diet, hydration & exercise for a healthier you</p>
      </div>

      {/* Water Tracker */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div className="rounded-xl border border-border bg-card p-6 shadow-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-card-foreground">
            <Droplets className="h-5 w-5 text-info" /> Water Tracker
          </h3>
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(200,20%,90%)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="hsl(206,80%,55%)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(waterCount / waterGoal) * 264} 264`}
                />
              </svg>
              <div className="absolute text-center">
                <p className="font-display text-2xl font-bold text-foreground">{waterCount}</p>
                <p className="text-xs text-muted-foreground">of {waterGoal}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => setWaterCount(Math.max(0, waterCount - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
                whileTap={{ scale: 0.9 }}
              >
                <Minus className="h-4 w-4" />
              </motion.button>
              <motion.button
                onClick={() => setWaterCount(Math.min(waterGoal, waterCount + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-primary-foreground"
                whileTap={{ scale: 0.9 }}
              >
                <Plus className="h-4 w-4" />
              </motion.button>
            </div>
            <div className="flex items-center gap-2 text-sm text-warning">
              <Trophy className="h-4 w-4" />
              <span>{streak} day streak! 🔥</span>
            </div>
          </div>
        </motion.div>

        {/* Exercise */}
        <motion.div className="rounded-xl border border-border bg-card p-6 shadow-card lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-card-foreground">
            <Dumbbell className="h-5 w-5 text-success" /> Daily Exercise (Senior-Friendly)
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {exercises.map((ex) => (
              <div key={ex.name} className="flex items-center gap-3 rounded-lg border border-border bg-background p-4">
                <span className="text-2xl">{ex.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{ex.name}</p>
                  <p className="text-sm text-muted-foreground">{ex.duration} · {ex.type}</p>
                </div>
                <Flame className="h-4 w-4 text-accent" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Diet Plan */}
      <motion.div className="rounded-xl border border-border bg-card p-6 shadow-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-card-foreground">
          <UtensilsCrossed className="h-5 w-5 text-accent" /> 7-Day AI Diet Plan (Indian)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-3 py-3 text-sm font-semibold text-muted-foreground">Day</th>
                <th className="px-3 py-3 text-sm font-semibold text-muted-foreground">Breakfast</th>
                <th className="px-3 py-3 text-sm font-semibold text-muted-foreground">Lunch</th>
                <th className="px-3 py-3 text-sm font-semibold text-muted-foreground">Dinner</th>
                <th className="px-3 py-3 text-sm font-semibold text-muted-foreground">Snack</th>
              </tr>
            </thead>
            <tbody>
              {dietPlan.map((row) => (
                <tr key={row.day} className="border-b border-border/50">
                  <td className="px-3 py-3 font-semibold text-primary">{row.day}</td>
                  <td className="px-3 py-3 text-sm text-foreground">{row.breakfast}</td>
                  <td className="px-3 py-3 text-sm text-foreground">{row.lunch}</td>
                  <td className="px-3 py-3 text-sm text-foreground">{row.dinner}</td>
                  <td className="px-3 py-3 text-sm text-foreground">{row.snack}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Wellness;
