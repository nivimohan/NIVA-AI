import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Phone, Plus, Trash2, MapPin, AlertTriangle } from "lucide-react";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

const EmergencyPage = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    { id: "1", name: "Dr. Sharma", phone: "+91-9876543210", relationship: "Doctor" },
    { id: "2", name: "Priya", phone: "+91-9876543211", relationship: "Spouse" },
  ]);
  const [panicMode, setPanicMode] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "" });
  const [showAdd, setShowAdd] = useState(false);

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    if (contacts.length >= 5) return;
    setContacts((prev) => [...prev, { ...newContact, id: `c-${Date.now()}` }]);
    setNewContact({ name: "", phone: "", relationship: "" });
    setShowAdd(false);
  };

  const removeContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const triggerPanic = () => {
    setPanicMode(true);
    // Try to get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          alert(`🚨 Panic mode activated!\nLocation: ${pos.coords.latitude}, ${pos.coords.longitude}\nContacts would be notified via SMS.`);
        },
        () => {
          alert("🚨 Panic mode activated!\nUnable to get location. Contacts would be notified.");
        }
      );
    }
    setTimeout(() => setPanicMode(false), 5000);
  };

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Emergency System</h1>
        <p className="text-muted-foreground">Manage emergency contacts and quick actions</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.button
          onClick={() => {
  if (contacts.length > 0) {
    window.location.href = `tel:${contacts[0].phone}`;
  } else {
    alert("No emergency contacts saved.");
  }
}}
        >
          <Phone className="h-8 w-8 text-emergency" />
          <div>
            <p className="font-display text-lg font-bold text-emergency">Call 112</p>
            <p className="text-sm text-muted-foreground">Emergency ambulance</p>
          </div>
        </motion.button>

        <motion.button
          onClick={triggerPanic}
          className={`flex items-center gap-3 rounded-xl border-2 p-5 text-left ${
            panicMode ? "gradient-emergency border-transparent text-emergency-foreground" : "border-warning bg-warning/10"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AlertTriangle className={`h-8 w-8 ${panicMode ? "text-emergency-foreground" : "text-warning"}`} />
          <div>
            <p className={`font-display text-lg font-bold ${panicMode ? "text-emergency-foreground" : "text-warning"}`}>
              {panicMode ? "PANIC ACTIVE" : "Panic Mode"}
            </p>
            <p className={`text-sm ${panicMode ? "text-emergency-foreground/80" : "text-muted-foreground"}`}>
              Alert all contacts
            </p>
          </div>
        </motion.button>

        <motion.button
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((pos) => {
                window.open(`https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`, "_blank");
              });
            }
          }}
          className="flex items-center gap-3 rounded-xl border-2 border-info bg-info/10 p-5 text-left"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MapPin className="h-8 w-8 text-info" />
          <div>
            <p className="font-display text-lg font-bold text-info">Share Location</p>
            <p className="text-sm text-muted-foreground">Open GPS on map</p>
          </div>
        </motion.button>
      </div>

      {/* Emergency Contacts */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-card-foreground">
            <Shield className="mr-2 inline h-5 w-5 text-primary" />
            Emergency Contacts ({contacts.length}/5)
          </h3>
          {contacts.length < 5 && (
            <motion.button
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
              whileHover={{ scale: 1.05 }}
            >
              <Plus className="h-4 w-4" /> Add
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="flex flex-col gap-3 rounded-lg bg-secondary p-4 md:grid md:grid-cols-3 md:items-end">

  <input
    placeholder="Name"
    value={newContact.name}
    onChange={(e) =>
      setNewContact((p) => ({ ...p, name: e.target.value }))
    }
    className="rounded-lg border border-input bg-background px-3 py-2.5 text-base"
  />

  <input
    placeholder="Phone"
    value={newContact.phone}
    onChange={(e) =>
      setNewContact((p) => ({ ...p, phone: e.target.value }))
    }
    className="rounded-lg border border-input bg-background px-3 py-2.5 text-base"
  />

  <div className="flex flex-col gap-2 md:flex-row">
    <input
      placeholder="Relation"
      value={newContact.relationship}
      onChange={(e) =>
        setNewContact((p) => ({ ...p, relationship: e.target.value }))
      }
      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base"
    />

    <motion.button
      onClick={addContact}
      className="w-full md:w-auto rounded-lg gradient-primary px-4 py-2 text-primary-foreground"
      whileTap={{ scale: 0.95 }}
    >
      Save
    </motion.button>
  </div>
</div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {contacts.map((contact) => (
            <motion.div
              key={contact.id}
              layout
              className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
            >
              <div>
                <p className="font-medium text-foreground">{contact.name}</p>
                <p className="text-sm text-muted-foreground">{contact.phone} · {contact.relationship}</p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => window.open(`tel:${contact.phone}`, "_self")}
                  className="rounded-lg bg-success/10 p-2 text-success"
                  whileTap={{ scale: 0.9 }}
                >
                  <Phone className="h-4 w-4" />
                </motion.button>
                <motion.button
                  onClick={() => removeContact(contact.id)}
                  className="rounded-lg bg-destructive/10 p-2 text-destructive"
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default EmergencyPage;
