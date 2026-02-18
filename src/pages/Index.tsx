import { motion } from "framer-motion";
import {
  Activity,
  Calendar,
  Droplets,
  TrendingUp,
} from "lucide-react";
import VoiceButton from "@/components/dashboard/VoiceButton";
import SummaryCard from "@/components/dashboard/SummaryCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useHealthData } from "@/hooks/useHealthData";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const Dashboard = () => {
  const { entries, latest } = useHealthData();

  const chartData = entries.slice(-7).map((e) => ({
    date: e.date.slice(5),
    bp: e.systolic,
    hr: e.heartRate,
    sugar: e.sugar,
  }));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            className="font-display text-4xl font-bold text-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Hello, <span className="text-gradient">Naveen</span> 👋
          </motion.h1>
          <p className="mt-1 text-lg text-muted-foreground">
            Here's your health overview for today
          </p>
        </div>
        <VoiceButton />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Blood Pressure"
          value={latest ? `${latest.systolic}/${latest.diastolic}` : "--"}
          subtitle="mmHg · Last reading"
          icon={Activity}
          trend="stable"
        />
        <SummaryCard
          title="Appointments"
          value="2"
          subtitle="This week"
          icon={Calendar}
          colorClass="text-info"
        />
        <SummaryCard
          title="Risk Level"
          value="Low"
          subtitle="Based on vitals"
          icon={TrendingUp}
          colorClass="text-success"
        />
        <SummaryCard
          title="Water Intake"
          value="6/8"
          subtitle="Glasses today"
          icon={Droplets}
          colorClass="text-info"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          className="rounded-xl border border-border bg-card p-6 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-4 font-display text-lg font-semibold text-card-foreground">
            Blood Pressure Trend
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="bpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(174, 62%, 40%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(174, 62%, 40%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 20%, 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 14 }} stroke="hsl(210, 10%, 50%)" />
              <YAxis tick={{ fontSize: 14 }} stroke="hsl(210, 10%, 50%)" />
              <Tooltip />
              <Area type="monotone" dataKey="bp" stroke="hsl(174, 62%, 40%)" fill="url(#bpGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="rounded-xl border border-border bg-card p-6 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="mb-4 font-display text-lg font-semibold text-card-foreground">
            Heart Rate & Sugar
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(200, 20%, 90%)" />
              <XAxis dataKey="date" tick={{ fontSize: 14 }} stroke="hsl(210, 10%, 50%)" />
              <YAxis tick={{ fontSize: 14 }} stroke="hsl(210, 10%, 50%)" />
              <Tooltip />
              <Line type="monotone" dataKey="hr" stroke="hsl(0, 72%, 55%)" strokeWidth={2} dot={false} name="Heart Rate" />
              <Line type="monotone" dataKey="sugar" stroke="hsl(25, 95%, 55%)" strokeWidth={2} dot={false} name="Sugar" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
