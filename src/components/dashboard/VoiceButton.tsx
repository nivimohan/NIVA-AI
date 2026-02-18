import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { useState, useCallback } from "react";

const VoiceButton = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const toggleVoice = useCallback(() => {
    if (listening) {
      setListening(false);
      setTranscript("");
      return;
    }

    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1][0].transcript;
      setTranscript(result);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.start();
  }, [listening]);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        onClick={toggleVoice}
        className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-colors ${
          listening
            ? "gradient-primary animate-pulse-voice"
            : "bg-primary/10 hover:bg-primary/20"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={listening ? "Stop listening" : "Start voice command"}
      >
        {listening ? (
          <MicOff className="h-8 w-8 text-primary-foreground" />
        ) : (
          <Mic className="h-8 w-8 text-primary" />
        )}
      </motion.button>
      <AnimatePresence>
        {listening && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-sm text-muted-foreground"
          >
            {transcript || "Listening… Say \"NIVA\" to activate"}
          </motion.p>
        )}
      </AnimatePresence>
      {!listening && (
        <p className="text-sm text-muted-foreground">Tap to speak</p>
      )}
    </div>
  );
};

export default VoiceButton;
