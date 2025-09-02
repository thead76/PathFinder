import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatApp from "./ChatApp";
import { MessageCircle, X, RefreshCcw, Bot} from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const popupRef = useRef(null);

  const handleRestart = () => {
    // clear all sessions and remount ChatApp
    localStorage.removeItem("careerist_sessions");
    setResetKey((prev) => prev + 1);
  };

  // close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // click outside to close (optional, small detector)
  useEffect(() => {
    const onDocClick = (e) => {
      if (!isOpen) return;
      if (!popupRef.current) return;
      if (!popupRef.current.contains(e.target)) {
        // clicking the floating button should not immediately re-close (the button toggles)
        // allow a small delay so toggle logic is consistent
        setTimeout(() => setIsOpen(false), 50);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isOpen]);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white flex items-center justify-center z-50"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </motion.button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-20 right-6 w-[380px] h-[580px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50"
            ref={popupRef}
            role="dialog"
            aria-modal="true"
            aria-label="Careerist chat"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white p-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">Careerist — AI Career Advisor</div>
                  <div className="text-xs opacity-90">Ask anything about career, interviews & skills</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRestart}
                  title="Restart Chat"
                  className="p-1 rounded hover:bg-white/10 transition"
                  aria-label="Restart chat"
                >
                  <RefreshCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  className="p-1 rounded hover:bg-white/10 transition"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-hidden bg-slate-50">
              <ChatApp key={resetKey} open={isOpen} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
