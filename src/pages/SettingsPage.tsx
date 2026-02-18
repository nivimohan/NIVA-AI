import { motion } from "framer-motion";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";
import { useState } from "react";

const SettingsPage = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [fontSize, setFontSize] = useState(18);

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-card-foreground">
            <User className="h-5 w-5 text-primary" /> Profile
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <input defaultValue="Naveen Kumar" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Age</label>
              <input defaultValue="65" type="number" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
              <input defaultValue="B+" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
              <input defaultValue="+91-9876543211" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base" />
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-card-foreground">
            <Palette className="h-5 w-5 text-accent" /> Accessibility
          </h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">High Contrast Mode</p>
                <p className="text-sm text-muted-foreground">Improve visibility for low vision</p>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`relative h-7 w-12 rounded-full transition-colors ${highContrast ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-card shadow transition-transform ${highContrast ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
            <div>
              <p className="font-medium text-foreground">Font Size: {fontSize}px</p>
              <input
                type="range"
                min={16}
                max={28}
                value={fontSize}
                onChange={(e) => setFontSize(+e.target.value)}
                className="mt-2 w-full accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-card-foreground">
            <Bell className="h-5 w-5 text-info" /> Notifications
          </h3>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Medication & appointment reminders</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative h-7 w-12 rounded-full transition-colors ${notifications ? "bg-primary" : "bg-muted"}`}
            >
              <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-card shadow transition-transform ${notifications ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
