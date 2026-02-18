import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Calendar, Pill, Check, Plus, Trash2, Clock } from "lucide-react";

interface Medication {
  id: string;
  name: string;
  time: string;
  dosage: string;
  taken: boolean;
}

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
}

const Reminders = () => {
  const [meds, setMeds] = useState<Medication[]>([
    { id: "m1", name: "Metformin", time: "08:00 AM", dosage: "500mg", taken: false },
    { id: "m2", name: "Amlodipine", time: "09:00 AM", dosage: "5mg", taken: true },
    { id: "m3", name: "Vitamin D", time: "01:00 PM", dosage: "1000IU", taken: false },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: "a1", doctor: "Dr. Sharma", specialty: "Cardiologist", date: "2026-02-20", time: "10:00 AM" },
    { id: "a2", doctor: "Dr. Patel", specialty: "General", date: "2026-02-25", time: "03:00 PM" },
  ]);

  const [showAddMed, setShowAddMed] = useState(false);
  const [showAddAppt, setShowAddAppt] = useState(false);
  const [newMed, setNewMed] = useState({ name: "", time: "", dosage: "" });
  const [newAppt, setNewAppt] = useState({ doctor: "", specialty: "", date: "", time: "" });

  const toggleMed = (id: string) => setMeds((p) => p.map((m) => m.id === id ? { ...m, taken: !m.taken } : m));

  const addMed = () => {
    if (!newMed.name) return;
    setMeds((p) => [...p, { ...newMed, id: `m-${Date.now()}`, taken: false }]);
    setNewMed({ name: "", time: "", dosage: "" });
    setShowAddMed(false);
  };

  const addAppt = () => {
    if (!newAppt.doctor) return;
    setAppointments((p) => [...p, { ...newAppt, id: `a-${Date.now()}` }]);
    setNewAppt({ doctor: "", specialty: "", date: "", time: "" });
    setShowAddAppt(false);
  };

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Reminders</h1>
        <p className="text-muted-foreground">Medication schedules & appointment bookings</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Medications */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-card-foreground">
              <Pill className="h-5 w-5 text-primary" /> Today's Medications
            </h3>
            <motion.button onClick={() => setShowAddMed(!showAddMed)} className="rounded-lg bg-primary/10 p-2 text-primary" whileTap={{ scale: 0.9 }}>
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>

          <AnimatePresence>
            {showAddMed && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-4 overflow-hidden">
                <div className="space-y-2 rounded-lg bg-secondary p-4">
                  <input placeholder="Medicine name" value={newMed.name} onChange={(e) => setNewMed((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base" />
                  <div className="flex gap-2">
                    <input placeholder="Time" value={newMed.time} onChange={(e) => setNewMed((p) => ({ ...p, time: e.target.value }))} className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-base" />
                    <input placeholder="Dosage" value={newMed.dosage} onChange={(e) => setNewMed((p) => ({ ...p, dosage: e.target.value }))} className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-base" />
                  </div>
                  <motion.button onClick={addMed} className="w-full rounded-lg gradient-primary py-2 text-primary-foreground font-medium" whileTap={{ scale: 0.98 }}>Add Medication</motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {meds.map((med) => (
              <motion.div
                key={med.id}
                layout
                className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                  med.taken ? "border-success/30 bg-success/5" : "border-border bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => toggleMed(med.id)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      med.taken ? "border-success bg-success text-success-foreground" : "border-muted-foreground/30"
                    }`}
                    whileTap={{ scale: 0.85 }}
                  >
                    {med.taken && <Check className="h-4 w-4" />}
                  </motion.button>
                  <div>
                    <p className={`font-medium ${med.taken ? "text-muted-foreground line-through" : "text-foreground"}`}>{med.name}</p>
                    <p className="text-sm text-muted-foreground">{med.dosage} · {med.time}</p>
                  </div>
                </div>
                <motion.button onClick={() => setMeds((p) => p.filter((m) => m.id !== med.id))} className="text-muted-foreground/50 hover:text-destructive" whileTap={{ scale: 0.9 }}>
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Appointments */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-card-foreground">
              <Calendar className="h-5 w-5 text-info" /> Appointments
            </h3>
            <motion.button onClick={() => setShowAddAppt(!showAddAppt)} className="rounded-lg bg-info/10 p-2 text-info" whileTap={{ scale: 0.9 }}>
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>

          <AnimatePresence>
            {showAddAppt && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-4 overflow-hidden">
                <div className="space-y-2 rounded-lg bg-secondary p-4">
                  <input placeholder="Doctor name" value={newAppt.doctor} onChange={(e) => setNewAppt((p) => ({ ...p, doctor: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base" />
                  <input placeholder="Specialty" value={newAppt.specialty} onChange={(e) => setNewAppt((p) => ({ ...p, specialty: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base" />
                  <div className="flex gap-2">
                    <input type="date" value={newAppt.date} onChange={(e) => setNewAppt((p) => ({ ...p, date: e.target.value }))} className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-base" />
                    <input placeholder="Time" value={newAppt.time} onChange={(e) => setNewAppt((p) => ({ ...p, time: e.target.value }))} className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-base" />
                  </div>
                  <motion.button onClick={addAppt} className="w-full rounded-lg bg-info py-2 text-info-foreground font-medium" whileTap={{ scale: 0.98 }}>Book Appointment</motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {appointments.map((appt) => (
              <motion.div key={appt.id} layout className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{appt.doctor}</p>
                    <p className="text-sm text-muted-foreground">{appt.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center gap-1 text-sm font-medium text-info">
                      <Clock className="h-3.5 w-3.5" /> {appt.time}
                    </p>
                    <p className="text-sm text-muted-foreground">{appt.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Reminders;
