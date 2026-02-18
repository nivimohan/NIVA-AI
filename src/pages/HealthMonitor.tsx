import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Heart, Droplet, Weight, Plus } from "lucide-react";
import { useHealthData } from "@/hooks/useHealthData";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const HealthMonitor = () => {
  const { entries, addEntry } = useHealthData();
  const [form, setForm] = useState({ systolic: "", diastolic: "", heartRate: "", sugar: "", weight: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.systolic || !form.heartRate) return;
    addEntry({
      date: new Date().toISOString().split("T")[0],
      systolic: +form.systolic,
      diastolic: +form.diastolic,
      heartRate: +form.heartRate,
      sugar: +form.sugar,
      weight: +form.weight,
    });
    setForm({ systolic: "", diastolic: "", heartRate: "", sugar: "", weight: "" });
  };

  const chartData = entries.slice(-14).map((e) => ({
    date: e.date.slice(5),
    systolic: e.systolic,
    diastolic: e.diastolic,
    hr: e.heartRate,
    sugar: e.sugar,
    weight: e.weight,
  }));

  const fields = [
    { key: "systolic", label: "Systolic (mmHg)", icon: Activity, placeholder: "120" },
    { key: "diastolic", label: "Diastolic (mmHg)", icon: Activity, placeholder: "80" },
    { key: "heartRate", label: "Heart Rate (bpm)", icon: Heart, placeholder: "72" },
    { key: "sugar", label: "Blood Sugar (mg/dL)", icon: Droplet, placeholder: "100" },
    { key: "weight", label: "Weight (kg)", icon: Weight, placeholder: "70" },
  ] as const;

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Health Monitor</h1>
        <p className="text-muted-foreground">Track your vitals and see trends over time</p>
      </div>

      {/* Entry Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-card p-6 shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="mb-4 font-display text-lg font-semibold text-card-foreground">Log New Reading</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {fields.map((f) => (
            <div key={f.key} className="space-y-1">
              <label className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <f.icon className="h-4 w-4" />
                {f.label}
              </label>
              <input
                type="number"
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
        </div>
        <motion.button
          type="submit"
          className="mt-5 flex items-center gap-2 rounded-lg gradient-primary px-6 py-2.5 font-medium text-primary-foreground"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="h-4 w-4" /> Save Reading
        </motion.button>
      </motion.form>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[
          { title: "Blood Pressure", keys: [{ key: "systolic", color: "hsl(174,62%,40%)" }, { key: "diastolic", color: "hsl(206,80%,55%)" }] },
          { title: "Heart Rate", keys: [{ key: "hr", color: "hsl(0,72%,55%)" }] },
          { title: "Blood Sugar", keys: [{ key: "sugar", color: "hsl(25,95%,55%)" }] },
          { title: "Weight", keys: [{ key: "weight", color: "hsl(152,60%,42%)" }] },
        ].map((chart) => (
          <motion.div
            key={chart.title}
            className="rounded-xl border border-border bg-card p-6 shadow-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="mb-4 font-display text-lg font-semibold text-card-foreground">{chart.title}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(200,20%,90%)" />
                <XAxis dataKey="date" tick={{ fontSize: 13 }} stroke="hsl(210,10%,50%)" />
                <YAxis tick={{ fontSize: 13 }} stroke="hsl(210,10%,50%)" />
                <Tooltip />
                {chart.keys.map((k) => (
                  <Line key={k.key} type="monotone" dataKey={k.key} stroke={k.color} strokeWidth={2} dot={{ r: 3 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        ))}
      </div>

      {/* AI Insight */}
      <motion.div
        className="rounded-xl border border-border bg-primary/5 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-display text-lg font-semibold text-primary">🤖 AI Health Insight</h3>
        <p className="mt-2 text-muted-foreground">
          Your vitals look generally stable. Blood pressure has been within a normal range over the last 2 weeks.
          Heart rate shows healthy variation. Keep maintaining your current routine and stay hydrated!
        </p>
        <p className="mt-2 text-sm text-muted-foreground italic">
          Note: This is not a medical diagnosis. Please consult your healthcare provider for professional advice.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default HealthMonitor;
