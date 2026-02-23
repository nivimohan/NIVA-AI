import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Dumbbell, UtensilsCrossed, Plus, Minus, Flame, Trophy, Play, Pause, RotateCcw, X, Timer, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────
interface Exercise {
  id: string;
  name: string;
  duration: number; // minutes
  type: string;
  icon: string;
}

interface DietRow {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
}

// ─── Diet data by preference ───────────────────────────────────
const vegDiet: DietRow[] = [
  { day: "Mon", breakfast: "Oats Upma + Green Tea", lunch: "Dal Rice + Sabzi + Curd", dinner: "Chapati + Palak Paneer", snack: "Fruits + Nuts" },
  { day: "Tue", breakfast: "Idli Sambar", lunch: "Rajma Rice + Salad", dinner: "Khichdi + Buttermilk", snack: "Sprout Chaat" },
  { day: "Wed", breakfast: "Poha + Chai", lunch: "Chole + Brown Rice", dinner: "Moong Dal Cheela", snack: "Yogurt + Seeds" },
  { day: "Thu", breakfast: "Besan Cheela + Chutney", lunch: "Sambhar Rice + Papad", dinner: "Roti + Mix Veg Curry", snack: "Makhana" },
  { day: "Fri", breakfast: "Dalia Porridge", lunch: "Paneer Bhurji + Rice", dinner: "Chapati + Aloo Gobi", snack: "Banana + Peanuts" },
  { day: "Sat", breakfast: "Paratha + Curd", lunch: "Paneer Tikka + Naan", dinner: "Soup + Grilled Veg", snack: "Chana Chaat" },
  { day: "Sun", breakfast: "Masala Dosa", lunch: "Veg Biryani + Raita", dinner: "Roti + Dal Fry", snack: "Trail Mix" },
];

const nonVegDiet: DietRow[] = [
  { day: "Mon", breakfast: "Egg Bhurji + Toast", lunch: "Chicken Curry + Rice", dinner: "Chapati + Keema", snack: "Boiled Eggs" },
  { day: "Tue", breakfast: "Idli Sambar", lunch: "Fish Curry + Rice + Salad", dinner: "Chicken Soup + Bread", snack: "Sprout Chaat" },
  { day: "Wed", breakfast: "Poha + Chai", lunch: "Mutton Biryani + Raita", dinner: "Egg Curry + Chapati", snack: "Yogurt + Seeds" },
  { day: "Thu", breakfast: "Omelette + Paratha", lunch: "Sambhar Rice + Fish Fry", dinner: "Roti + Butter Chicken", snack: "Makhana" },
  { day: "Fri", breakfast: "Dalia Porridge", lunch: "Fish Curry + Rice", dinner: "Chapati + Egg Curry", snack: "Banana + Peanuts" },
  { day: "Sat", breakfast: "Paratha + Curd", lunch: "Chicken Tikka + Naan", dinner: "Soup + Grilled Chicken", snack: "Chana Chaat" },
  { day: "Sun", breakfast: "Masala Dosa", lunch: "Chicken Biryani + Raita", dinner: "Roti + Dal Fry", snack: "Trail Mix" },
];

const getCalorieAdvice = (bmi: number | null, age: number | null) => {
  if (!bmi || !age) return null;
  if (bmi < 18.5) return { label: "Underweight", tip: "Add extra portions & healthy fats", color: "text-warning" };
  if (bmi < 25) return { label: "Normal", tip: "Maintain balanced portions", color: "text-success" };
  if (bmi < 30) return { label: "Overweight", tip: "Reduce carbs, increase protein & fiber", color: "text-accent" };
  return { label: "Obese", tip: "Consult a dietician, focus on portion control", color: "text-destructive" };
};

const defaultExercises: Exercise[] = [
  { id: "1", name: "Morning Walk", duration: 20, type: "Cardio", icon: "🚶" },
  { id: "2", name: "Chair Yoga", duration: 15, type: "Flexibility", icon: "🧘" },
  { id: "3", name: "Arm Circles", duration: 10, type: "Strength", icon: "💪" },
  { id: "4", name: "Deep Breathing", duration: 10, type: "Relaxation", icon: "🫁" },
];

const exerciseLibrary = [
  { name: "Morning Walk", type: "Cardio", icon: "🚶" },
  { name: "Chair Yoga", type: "Flexibility", icon: "🧘" },
  { name: "Arm Circles", type: "Strength", icon: "💪" },
  { name: "Deep Breathing", type: "Relaxation", icon: "🫁" },
  { name: "Stretching", type: "Flexibility", icon: "🤸" },
  { name: "Light Jogging", type: "Cardio", icon: "🏃" },
  { name: "Squats", type: "Strength", icon: "🦵" },
  { name: "Meditation", type: "Relaxation", icon: "🧘‍♂️" },
  { name: "Cycling", type: "Cardio", icon: "🚴" },
  { name: "Tai Chi", type: "Flexibility", icon: "🥋" },
];

// ─── Timer Component ─────────────────────────────────────────────
const ExerciseTimer = ({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) => {
  const [totalSeconds, setTotalSeconds] = useState(exercise.duration * 60);
  const [remaining, setRemaining] = useState(exercise.duration * 60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const playAlarm = useCallback(() => {
    try {
      const ctx = new AudioContext();
      audioRef.current = ctx;
      const playBeep = (time: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.5, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
        osc.start(time);
        osc.stop(time + 0.3);
      };
      for (let i = 0; i < 5; i++) playBeep(ctx.currentTime + i * 0.5);
    } catch {
      // fallback
    }
  }, []);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setFinished(true);
            playAlarm();
            toast.success(`${exercise.name} completed! 🎉`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, remaining, exercise.name, playAlarm]);

  useEffect(() => {
    return () => { audioRef.current?.close(); };
  }, []);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <span className="text-4xl">{exercise.icon}</span>
          <h3 className="mt-2 font-display text-xl font-bold text-foreground">{exercise.name}</h3>
          <p className="text-sm text-muted-foreground">{exercise.type}</p>
        </div>

        {/* Circular progress */}
        <div className="mx-auto my-6 flex h-40 w-40 items-center justify-center">
          <svg className="h-40 w-40 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={finished ? "hsl(var(--success))" : "hsl(var(--primary))"}
              strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${(progress / 100) * 264} 264`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute text-center">
            {finished ? (
              <Check className="mx-auto h-10 w-10 text-success" />
            ) : (
              <>
                <p className="font-display text-3xl font-bold text-foreground">
                  {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
                </p>
                <p className="text-xs text-muted-foreground">remaining</p>
              </>
            )}
          </div>
        </div>

        {finished ? (
          <p className="text-center font-medium text-success">Exercise Complete! 🎉</p>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => { setRemaining(totalSeconds); setRunning(false); setFinished(false); }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-foreground"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            <button
              onClick={() => setRunning(!running)}
              className="flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-primary-foreground"
            >
              {running ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
            </button>
          </div>
        )}

        {/* Duration adjuster (only before start) */}
        {!running && !finished && remaining === totalSeconds && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => { const n = Math.max(60, totalSeconds - 60); setTotalSeconds(n); setRemaining(n); }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-sm font-medium text-muted-foreground">{Math.floor(totalSeconds / 60)} min</span>
            <button
              onClick={() => { const n = totalSeconds + 60; setTotalSeconds(n); setRemaining(n); }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ─── Main Wellness Page ──────────────────────────────────────────
const Wellness = () => {
  const { profile } = useAuth();
  const [waterCount, setWaterCount] = useState(6);
  const [streak, setStreak] = useState(5);
  const waterGoal = 8;

  // Diet preferences
  const [dietPref, setDietPref] = useState<"veg" | "nonveg">("veg");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const bmi = heightCm && weightKg ? parseFloat(weightKg) / ((parseFloat(heightCm) / 100) ** 2) : null;
  const bmiAdvice = getCalorieAdvice(bmi, profile?.age ?? null);

  // Exercises
  const [exercises, setExercises] = useState<Exercise[]>(defaultExercises);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [activeTimer, setActiveTimer] = useState<Exercise | null>(null);
  const [newExName, setNewExName] = useState("");
  const [newExDuration, setNewExDuration] = useState(10);

  const addFromLibrary = (ex: { name: string; type: string; icon: string }) => {
    if (exercises.find((e) => e.name === ex.name)) {
      toast.info("Already added!");
      return;
    }
    setExercises((prev) => [...prev, { id: Date.now().toString(), name: ex.name, duration: 10, type: ex.type, icon: ex.icon }]);
    toast.success(`${ex.name} added!`);
  };

  const addCustomExercise = () => {
    if (!newExName.trim()) return;
    setExercises((prev) => [...prev, { id: Date.now().toString(), name: newExName.trim(), duration: newExDuration, type: "Custom", icon: "🏋️" }]);
    setNewExName("");
    setNewExDuration(10);
    setShowAddExercise(false);
    toast.success("Exercise added!");
  };

  const removeExercise = (id: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
  };

  const dietPlan = dietPref === "veg" ? vegDiet : nonVegDiet;

  return (
    <motion.div className="space-y-6 md:space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Wellness</h1>
        <p className="text-muted-foreground">Diet, hydration & exercise for a healthier you</p>
      </div>

      {/* Water Tracker + Exercise grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Water Tracker */}
        <motion.div className="rounded-xl border border-border bg-card p-5 shadow-card md:p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-card-foreground">
            <Droplets className="h-5 w-5 text-info" /> Water Tracker
          </h3>
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-28 w-28 items-center justify-center md:h-32 md:w-32">
              <svg className="h-28 w-28 -rotate-90 md:h-32 md:w-32" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--info))" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(waterCount / waterGoal) * 264} 264`} />
              </svg>
              <div className="absolute text-center">
                <p className="font-display text-2xl font-bold text-foreground">{waterCount}</p>
                <p className="text-xs text-muted-foreground">of {waterGoal}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <motion.button onClick={() => setWaterCount(Math.max(0, waterCount - 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground" whileTap={{ scale: 0.9 }}>
                <Minus className="h-4 w-4" />
              </motion.button>
              <motion.button onClick={() => setWaterCount(Math.min(waterGoal, waterCount + 1))} className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-primary-foreground" whileTap={{ scale: 0.9 }}>
                <Plus className="h-4 w-4" />
              </motion.button>
            </div>
            <div className="flex items-center gap-2 text-sm text-warning">
              <Trophy className="h-4 w-4" />
              <span>{streak} day streak! 🔥</span>
            </div>
          </div>
        </motion.div>

        {/* Exercise Section */}
        <motion.div className="rounded-xl border border-border bg-card p-5 shadow-card md:p-6 lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-card-foreground">
              <Dumbbell className="h-5 w-5 text-success" /> My Exercises
            </h3>
            <button
              onClick={() => setShowAddExercise(!showAddExercise)}
              className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-foreground"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>

          {/* Add exercise panel */}
          <AnimatePresence>
            {showAddExercise && (
              <motion.div
                className="mb-4 space-y-3 rounded-lg border border-border bg-background p-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <p className="text-sm font-medium text-muted-foreground">Quick Add from Library</p>
                <div className="flex flex-wrap gap-2">
                  {exerciseLibrary.map((ex) => (
                    <button
                      key={ex.name}
                      onClick={() => addFromLibrary(ex)}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground hover:bg-secondary"
                    >
                      <span>{ex.icon}</span> {ex.name}
                    </button>
                  ))}
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">Custom name</label>
                    <input
                      value={newExName}
                      onChange={(e) => setNewExName(e.target.value)}
                      placeholder="e.g. Jumping Jacks"
                      className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="w-20">
                    <label className="text-xs text-muted-foreground">Minutes</label>
                    <input
                      type="number"
                      value={newExDuration}
                      onChange={(e) => setNewExDuration(Math.max(1, +e.target.value))}
                      className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <button onClick={addCustomExercise} className="rounded-lg gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                    Add
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Exercise list */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {exercises.map((ex) => (
              <div key={ex.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 md:p-4">
                <span className="text-2xl">{ex.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{ex.name}</p>
                  <p className="text-sm text-muted-foreground">{ex.duration} min · {ex.type}</p>
                </div>
                <div className="flex items-center gap-1">
                  <motion.button
                    onClick={() => setActiveTimer(ex)}
                    className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-primary-foreground"
                    whileTap={{ scale: 0.9 }}
                    title="Start timer"
                  >
                    <Timer className="h-4 w-4" />
                  </motion.button>
                  <button
                    onClick={() => removeExercise(ex.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-destructive"
                    title="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Diet Plan */}
      <motion.div className="rounded-xl border border-border bg-card p-5 shadow-card md:p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-card-foreground">
          <UtensilsCrossed className="h-5 w-5 text-accent" /> 7-Day AI Diet Plan (Indian)
        </h3>

        {/* Preferences */}
        <div className="mb-4 flex flex-wrap items-end gap-4 rounded-lg border border-border bg-background p-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Age</label>
            <p className="mt-0.5 text-sm font-medium text-foreground">{profile?.age ?? "Set in Settings"}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Height (cm)</label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="170"
              className="mt-0.5 w-20 rounded border border-input bg-card px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Weight (kg)</label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="70"
              className="mt-0.5 w-20 rounded border border-input bg-card px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Preference</label>
            <div className="mt-0.5 flex gap-1">
              <button
                onClick={() => setDietPref("veg")}
                className={`rounded-l-lg px-3 py-1 text-sm font-medium ${dietPref === "veg" ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground"}`}
              >
                🥬 Veg
              </button>
              <button
                onClick={() => setDietPref("nonveg")}
                className={`rounded-r-lg px-3 py-1 text-sm font-medium ${dietPref === "nonveg" ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}
              >
                🍗 Non-Veg
              </button>
            </div>
          </div>
          {bmi && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">BMI:</span>
              <span className={`text-sm font-bold ${bmiAdvice?.color}`}>{bmi.toFixed(1)}</span>
              {bmiAdvice && <span className="text-xs text-muted-foreground">({bmiAdvice.label} – {bmiAdvice.tip})</span>}
            </div>
          )}
        </div>

        {/* Table - desktop */}
        <div className="hidden overflow-x-auto md:block">
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

        {/* Cards - mobile */}
        <div className="space-y-3 md:hidden">
          {dietPlan.map((row) => (
            <div key={row.day} className="rounded-lg border border-border bg-background p-3">
              <p className="mb-2 font-semibold text-primary">{row.day}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-xs text-muted-foreground">Breakfast</span><p className="text-foreground">{row.breakfast}</p></div>
                <div><span className="text-xs text-muted-foreground">Lunch</span><p className="text-foreground">{row.lunch}</p></div>
                <div><span className="text-xs text-muted-foreground">Dinner</span><p className="text-foreground">{row.dinner}</p></div>
                <div><span className="text-xs text-muted-foreground">Snack</span><p className="text-foreground">{row.snack}</p></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Timer Modal */}
      <AnimatePresence>
        {activeTimer && <ExerciseTimer exercise={activeTimer} onClose={() => setActiveTimer(null)} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default Wellness;
