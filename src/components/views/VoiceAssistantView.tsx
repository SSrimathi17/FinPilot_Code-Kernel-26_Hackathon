import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Sparkles, Bot, RefreshCw, Send, AlertCircle, Play } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { useAuth } from "../../context/AuthContext";
import { askAIChat } from "../../services/aiService";

export const VoiceAssistantView: React.FC = () => {
  const { totalIncome, totalExpense, healthScore, addExpense } = useFinance();
  const { user } = useAuth();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("Tap the microphone or select a quick voice command to begin.");
  const [loading, setLoading] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [manualText, setManualText] = useState("");

  const transcriptRef = useRef("");

  const presetCommands = [
    "Spent 15 dollars on coffee",
    "Spent 45 dollars on groceries",
    "Spent 120 dollars on electricity bill",
    "What is my budget status?",
    "How is my financial health score?",
  ];

  // Web Speech Recognition setup
  useEffect(() => {
    let recognition: any = null;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition && isListening) {
      setMicError("Web Speech Recognition is not supported in this browser. Please try typing or preset commands.");
      setIsListening(false);
      return;
    }

    if (SpeechRecognition && isListening) {
      setMicError(null);
      try {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          transcriptRef.current = "";
          setTranscript("");
        };

        recognition.onresult = (event: any) => {
          let currentText = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript;
          }
          transcriptRef.current = currentText;
          setTranscript(currentText);
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed") {
            setMicError("Microphone access was blocked by your browser/frame permissions. You can use preset chips or type below!");
          } else {
            setMicError(`Voice error (${event.error}). Please try again or use sample triggers.`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          const finalSpeech = transcriptRef.current.trim();
          if (finalSpeech) {
            processVoiceCommand(finalSpeech);
          }
        };

        recognition.start();
      } catch (err: any) {
        setIsListening(false);
        setMicError("Failed to initialize speech microphone. Try typing your command below.");
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (_) {}
      }
    };
  }, [isListening]);

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn("Speech synthesis error:", e);
      }
    }
  };

  const processVoiceCommand = async (cmd: string) => {
    if (!cmd.trim()) return;
    setLoading(true);
    setTranscript(cmd);

    // Pattern matching for expense recording
    const lower = cmd.toLowerCase();
    if (lower.includes("spent") || lower.includes("paid") || lower.includes("bought")) {
      const match = lower.match(/\d+/);
      const amount = match ? parseInt(match[0]) : 20;

      addExpense({
        title: cmd,
        amount,
        category: lower.includes("coffee") || lower.includes("food") || lower.includes("groceries") ? "Food & Dining" : "General",
        paymentMethod: "UPI",
        date: new Date().toISOString().split("T")[0],
      });

      const reply = `Logged expense of ${user.currency}${amount} for "${cmd}". Check your Expense tab to review!`;
      setAiResponse(reply);
      speakText(reply);
      setLoading(false);
      return;
    }

    // Otherwise use Gemini AI Chat response
    try {
      const reply = await askAIChat(cmd, [], { totalIncome, totalExpense, healthScore });
      setAiResponse(reply);
      speakText(reply);
    } catch (error) {
      setAiResponse("Sorry, I had trouble processing your voice request. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualText.trim()) {
      processVoiceCommand(manualText.trim());
      setManualText("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto mb-3">
          <Mic className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-white">Hands-Free Voice Financial Assistant</h2>
        <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
          Speak naturally or click preset triggers to log expenses, check balances, or get AI advice.
        </p>
      </div>

      {/* Voice Visualizer Circle & Controls */}
      <div className="p-8 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex flex-col items-center justify-center text-center space-y-6">
        <button
          onClick={() => setIsListening(!isListening)}
          className={`relative p-8 rounded-full transition-all transform hover:scale-105 shadow-2xl ${
            isListening
              ? "bg-rose-600 text-white animate-pulse ring-8 ring-rose-500/30"
              : "bg-gradient-to-tr from-purple-600 to-blue-600 text-white shadow-purple-500/30 hover:shadow-purple-500/50"
          }`}
          title={isListening ? "Stop Listening" : "Start Voice Listening"}
        >
          {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
        </button>

        <div className="space-y-1">
          <span className="text-xs font-bold text-gray-200">
            {isListening ? "Listening... Speak your command now" : "Tap Microphone to Speak"}
          </span>
          {micError && (
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-400 mt-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{micError}</span>
            </div>
          )}
        </div>

        {/* Live Transcript Display */}
        {transcript && (
          <div className="p-3.5 rounded-2xl bg-gray-950 border border-purple-500/30 text-xs text-purple-300 font-medium max-w-md w-full animate-fade-in">
            <span className="text-[10px] text-gray-500 block mb-1">Your Voice Input:</span>
            "{transcript}"
          </div>
        )}

        {/* Preset Triggers */}
        <div className="w-full text-left">
          <p className="text-[11px] font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Quick Voice Triggers:
          </p>
          <div className="flex flex-wrap gap-2">
            {presetCommands.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => processVoiceCommand(preset)}
                className="px-3 py-1.5 rounded-xl bg-gray-800/80 hover:bg-purple-900/40 border border-gray-700/80 hover:border-purple-500/40 text-[11px] text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Play className="w-2.5 h-2.5 text-purple-400 fill-purple-400" />
                <span>"{preset}"</span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Command Form */}
        <form onSubmit={handleManualSubmit} className="w-full flex gap-2">
          <input
            type="text"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Or type a voice command e.g. Spent 20 dollars on coffee..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={!manualText.trim()}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-xs font-bold text-white flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </form>

        {/* AI Response Box */}
        <div className="w-full p-5 rounded-2xl bg-gray-950/80 border border-gray-800 text-left space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400">
            <span className="flex items-center gap-1.5 text-blue-400">
              <Bot className="w-4 h-4 text-purple-400" /> FinSmart Speech Reply
            </span>
            <button
              onClick={() => speakText(aiResponse)}
              className="px-2 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center gap-1 text-[11px]"
              title="Repeat Audio"
            >
              <Volume2 className="w-3.5 h-3.5 text-blue-400" /> Listen
            </button>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-xs text-blue-400 py-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing voice response...
            </div>
          ) : (
            <p className="text-xs text-white leading-relaxed">{aiResponse}</p>
          )}
        </div>
      </div>
    </div>
  );
};
