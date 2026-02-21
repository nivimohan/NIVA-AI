import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Activity,
  Shield,
  Bell,
  Heart,
  StickyNote,
  Settings,
  Mic,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/health", icon: Activity, label: "Health Monitor" },
  { to: "/emergency", icon: Shield, label: "Emergency" },
  { to: "/reminders", icon: Bell, label: "Reminders" },
  { to: "/wellness", icon: Heart, label: "Wellness" },
  { to: "/notes", icon: StickyNote, label: "Notes & Tasks" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const Sidebar = () => {
  const location = useLocation();
  const { profile, user } = useAuth();

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col gradient-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
          <Mic className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-sidebar-foreground">
            NIVA <span className="text-sidebar-primary">AI</span>
          </h1>
          <p className="text-xs text-sidebar-foreground/50">Health Assistant</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative block rounded-lg"
            >
              <motion.div
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-base transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary"
                    transition={{ duration: 0.25 }}
                  />
                )}
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-bold text-sidebar-primary">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">{displayName}</p>
            <p className="text-xs text-sidebar-foreground/50">Patient</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
