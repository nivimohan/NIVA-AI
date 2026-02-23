import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import EmergencyButton from "./EmergencyButton";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile header */}
      {isMobile && (
        <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-border bg-background px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-lg font-bold text-foreground">
            NIVA <span className="text-primary">AI</span>
          </h1>
          <div className="w-10" />
        </header>
      )}

      {/* Desktop sidebar */}
      {!isMobile && <Sidebar />}

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-foreground/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 z-50 h-full w-72"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <Sidebar />
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute right-3 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className={`flex-1 ${isMobile ? "px-4 pb-8 pt-20" : "ml-64 p-8"}`}>
        <Outlet />
      </main>
      <EmergencyButton />
    </div>
  );
};

export default AppLayout;
