import { useState } from "react";

export interface HealthEntry {
  id: string;
  date: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  sugar: number;
  weight: number;
}

const generateMockData = (): HealthEntry[] => {
  const data: HealthEntry[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      id: `h-${i}`,
      date: d.toISOString().split("T")[0],
      systolic: 110 + Math.floor(Math.random() * 30),
      diastolic: 70 + Math.floor(Math.random() * 15),
      heartRate: 65 + Math.floor(Math.random() * 25),
      sugar: 80 + Math.floor(Math.random() * 60),
      weight: 70 + Math.round(Math.random() * 5 * 10) / 10,
    });
  }
  return data;
};

export const useHealthData = () => {
  const [entries, setEntries] = useState<HealthEntry[]>(generateMockData);

  const addEntry = (entry: Omit<HealthEntry, "id">) => {
    setEntries((prev) => [
      ...prev,
      { ...entry, id: `h-${Date.now()}` },
    ]);
  };

  const latest = entries[entries.length - 1];

  return { entries, addEntry, latest };
};
