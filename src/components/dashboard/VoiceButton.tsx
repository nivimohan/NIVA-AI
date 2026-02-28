import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { useState, useRef } from "react";

const VoiceButton = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.pitch = 1;
    utterance.rate = 1;

    synth.speak(utterance);
  };

  const handleCommand = (text: string) => {
    const lower = text.toLowerCase();

    if (lower.includes("blood pressure")) {
      speak("Your last blood pressure reading was 120 over 80.");
    } else if (lower.includes("call emergency")) {
      speak("Calling your emergency contact.");
      window.location.href = "tel:112";
    } else if (lower.includes("water")) {
      speak("You have completed 6 glasses of water today.");
    } else {
      speak("Sorry, I did not understand that command.");
    }
  };

  const toggleVoice = () => {
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setListening(true);
      setTranscript("");
    };

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      handleCommand(result);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
      speak("There was an error with voice recognition.");
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        onClick={toggleVoice}
        className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-colors ${
          listening
            ? "bg-red-600 text-white animate-pulse"
            : "bg-primary/10 hover:bg-primary/20"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {listening ? (
          <MicOff className="h-8 w-8" />
        ) : (
          <Mic className="h-8 w-8 text-primary" />
        )}
      </motion.button>

      <AnimatePresence>
        {transcript && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-muted-foreground text-center px-4"
          >
            “{transcript}”
          </motion.p>
        )}
      </AnimatePresence>

      {!listening && (
        <p className="text-sm text-muted-foreground">
          Tap and speak a command
        </p>
      )}
    </div>
  );
};

export default VoiceButton;
