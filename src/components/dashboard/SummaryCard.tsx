import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  colorClass?: string;
}

const SummaryCard = ({ title, value, subtitle, icon: Icon, trend, colorClass = "text-primary" }: SummaryCardProps) => {
  return (
    <motion.div
      className="rounded-xl border border-border bg-card p-5 shadow-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "var(--shadow-lg)" }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`mt-1 font-display text-3xl font-bold ${colorClass}`}>{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {trend === "up" && "↑ "}
            {trend === "down" && "↓ "}
            {subtitle}
          </p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ${colorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
};

export default SummaryCard;
