import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { useState } from "react";

const EmergencyButton = () => {
  const [triggered, setTriggered] = useState(false);

  const handleEmergency = () => {
    setTriggered(true);
    // Attempt to open dialer with emergency number
    window.open("tel:112", "_self");
    setTimeout(() => setTriggered(false), 3000);
  };

  return (
    <motion.button
      onClick={handleEmergency}
      className={`fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full gradient-emergency text-emergency-foreground shadow-lg ${
        triggered ? "" : "animate-pulse-emergency"
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Emergency - Call 112"
    >
      <Phone className="h-7 w-7" />
    </motion.button>
  );
};

export default EmergencyButton;
