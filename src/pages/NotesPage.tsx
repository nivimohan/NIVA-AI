import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, CheckSquare, Plus, Trash2, Check, Mic, MicOff } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Task {
  id: string;
  text: string;
  done: boolean;
}

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: "n1", title: "Doctor Visit Summary", content: "Dr. Sharma advised to reduce salt intake and continue Metformin.", createdAt: "2026-02-17" },
    { id: "n2", title: "Symptoms Log", content: "Mild headache in morning, resolved after medication.", createdAt: "2026-02-16" },
  ]);
  const [tasks, setTasks] = useState<Task[]>([
    { id: "t1", text: "Take morning medication", done: true },
    { id: "t2", text: "Walk 20 minutes", done: false },
    { id: "t3", text: "Drink 8 glasses of water", done: false },
    { id: "t4", text: "Log blood pressure", done: false },
  ]);

  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [newTask, setNewTask] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const addNote = () => {
    if (!newNote.title) return;
    setNotes((p) => [{ ...newNote, id: `n-${Date.now()}`, createdAt: new Date().toISOString().split("T")[0] }, ...p]);
    setNewNote({ title: "", content: "" });
    setShowAddNote(false);
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((p) => [...p, { id: `t-${Date.now()}`, text: newTask, done: false }]);
    setNewTask("");
  };

  const voiceToText = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported.");
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setNewNote((p) => ({ ...p, content: p.content + " " + text }));
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Notes & Tasks</h1>
        <p className="text-muted-foreground">Keep track of your health notes and daily checklist</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Notes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
              <StickyNote className="h-5 w-5 text-warning" /> Notes
            </h3>
            <motion.button onClick={() => setShowAddNote(!showAddNote)} className="rounded-lg bg-warning/10 p-2 text-warning" whileTap={{ scale: 0.9 }}>
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>

          <AnimatePresence>
            {showAddNote && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="space-y-2 rounded-xl border border-border bg-card p-4 shadow-card">
                  <input placeholder="Note title" value={newNote.title} onChange={(e) => setNewNote((p) => ({ ...p, title: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base" />
                  <div className="relative">
                    <textarea placeholder="Write your note..." rows={3} value={newNote.content} onChange={(e) => setNewNote((p) => ({ ...p, content: e.target.value }))} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base" />
                    <motion.button
                      onClick={voiceToText}
                      className={`absolute bottom-3 right-3 rounded-full p-2 ${isRecording ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </motion.button>
                  </div>
                  <motion.button onClick={addNote} className="w-full rounded-lg gradient-primary py-2 font-medium text-primary-foreground" whileTap={{ scale: 0.98 }}>Save Note</motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {notes.map((note) => (
            <motion.div key={note.id} layout className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-card-foreground">{note.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{note.content}</p>
                  <p className="mt-2 text-xs text-muted-foreground/60">{note.createdAt}</p>
                </div>
                <motion.button onClick={() => setNotes((p) => p.filter((n) => n.id !== note.id))} className="text-muted-foreground/40 hover:text-destructive" whileTap={{ scale: 0.9 }}>
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Daily Checklist */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
            <CheckSquare className="h-5 w-5 text-success" /> Daily Checklist
          </h3>

          <div className="flex gap-2">
            <input
              placeholder="Add a task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-base"
            />
            <motion.button onClick={addTask} className="rounded-lg gradient-primary px-4 py-2 text-primary-foreground" whileTap={{ scale: 0.95 }}>
              <Plus className="h-5 w-5" />
            </motion.button>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                className={`flex items-center justify-between rounded-lg border p-4 ${
                  task.done ? "border-success/30 bg-success/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => setTasks((p) => p.map((t) => t.id === task.id ? { ...t, done: !t.done } : t))}
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                      task.done ? "border-success bg-success text-success-foreground" : "border-muted-foreground/30"
                    }`}
                    whileTap={{ scale: 0.85 }}
                  >
                    {task.done && <Check className="h-3.5 w-3.5" />}
                  </motion.button>
                  <span className={`${task.done ? "text-muted-foreground line-through" : "text-foreground"}`}>{task.text}</span>
                </div>
                <motion.button onClick={() => setTasks((p) => p.filter((t) => t.id !== task.id))} className="text-muted-foreground/40 hover:text-destructive" whileTap={{ scale: 0.9 }}>
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            ✅ {tasks.filter((t) => t.done).length}/{tasks.length} completed
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default NotesPage;
