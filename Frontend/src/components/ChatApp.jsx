import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const loadingPhrases = [
  "Charting your career course...",
  "Crafting a path to success...",
  "Unlocking career insights...",
  "Aligning your professional stars...",
  "Mapping your future...",
];

function loadSessions() {
  try {
    const raw = localStorage.getItem("careerist_sessions");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (s) =>
        s &&
        typeof s.id === "string" &&
        typeof s.title === "string" &&
        Array.isArray(s.messages)
    );
  } catch {
    localStorage.removeItem("careerist_sessions");
    return [];
  }
}
function saveSessions(sessions) {
  localStorage.setItem("careerist_sessions", JSON.stringify(sessions));
}

export default function ChatApp({
  backendUrl = import.meta.env.VITE_BACKEND_URL || "https://backend-api-67ei.onrender.com",
  open = false, // prop to allow parent to tell ChatApp it's visible (used to autofocus)
}) {
  const [sessions, setSessions] = useState(loadSessions());
  const [currentSession, setCurrentSession] = useState(
    sessions.length > 0 ? sessions[0].id : null
  );
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPhrase, setLoadingPhrase] = useState(loadingPhrases[0]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const messagesContainerRef = useRef(null);
  const endRef = useRef(null);
  const textareaRef = useRef(null);

  const currentMessages =
    sessions.find((s) => s.id === currentSession)?.messages || [];

  const setCurrentMessages = (msgs) => {
    if (!currentSession) return;
    setSessions((prev) => {
      const updated = prev.map((s) =>
        s.id === currentSession ? { ...s, messages: msgs } : s
      );
      saveSessions(updated);
      return updated;
    });
  };

  // load history from backend (if available)
  useEffect(() => {
    if (!currentSession) return;
    const loadHistory = async () => {
      try {
        const res = await fetch(`${backendUrl}/history?session_id=${currentSession}`);
        const data = await res.json();
        if (data.chat_history && Array.isArray(data.chat_history)) {
          setSessions((prev) =>
            prev.map((s) =>
              s.id === currentSession
                ? { ...s, messages: data.chat_history }
                : s
            )
          );
        }
      } catch (err) {
        // silently continue; backend may be offline in dev
        console.error("Error loading chat history:", err);
      }
    };
    loadHistory();
  }, [currentSession, backendUrl]);

  // auto-scroll to bottom when messages change or while loading
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    // small timeout to allow DOM update before scrolling
    setTimeout(() => {
      try {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      } catch {
        // fallback
        el.scrollTop = el.scrollHeight;
      }
    }, 60);
  }, [currentMessages.length, loading]);

  // loading phrase rotation
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingPhrase((prev) => {
          const idx = loadingPhrases.indexOf(prev);
          return loadingPhrases[(idx + 1) % loadingPhrases.length];
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // autofocus the textarea when the popup opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 150); // allow the popup animation to finish
    }
  }, [open]);

  const sendMessage = async (e, sampleQuery = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const messageToSend = sampleQuery || query;
    if (!messageToSend.trim()) return;

    let activeSession = currentSession;

    if (!activeSession) {
      const newSession = {
        id:
          "sess_" +
          Date.now().toString(36) +
          Math.random().toString(36).slice(2, 10),
        title: "New Chat",
        messages: [],
      };
      activeSession = newSession.id;
      setSessions((prev) => {
        const updated = [newSession, ...prev];
        saveSessions(updated);
        return updated;
      });
      setCurrentSession(newSession.id);
    }

    const userMsg = { role: "human", content: messageToSend };

    setSessions((prev) => {
      const updated = prev.map((s) => {
        if (s.id === activeSession) {
          const newTitle =
            s.title === "New Chat" ? messageToSend.slice(0, 50) : s.title;
          return { ...s, title: newTitle, messages: [...s.messages, userMsg] };
        }
        return s;
      });
      saveSessions(updated);
      return updated;
    });

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("query", messageToSend);
      formData.append("session_id", activeSession);

      const res = await fetch(`${backendUrl}/ask`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Backend error");
      const data = await res.json();

      const aiMsg = { role: "ai", content: data.answer || "(no answer)" };

      setSessions((prev) => {
        const updated = prev.map((s) => {
          if (s.id === activeSession) {
            return { ...s, messages: [...s.messages, aiMsg] };
          }
          return s;
        });
        saveSessions(updated);
        return updated;
      });
    } catch (err) {
      console.error(err);
      setSessions((prev) => {
        const updated = prev.map((s) =>
          s.id === activeSession
            ? {
                ...s,
                messages: [
                  ...s.messages,
                  { role: "ai", content: "⚠️ Error contacting backend." },
                ],
              }
            : s
        );
        saveSessions(updated);
        return updated;
      });
    }

    setQuery("");
    setLoading(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <main className="flex-1 p-3 flex flex-col overflow-hidden">
        {/* message area (scrollable) */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-auto p-4 bg-white"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {currentMessages.length === 0 && !loading && (
            <div className="text-center text-slate-500 py-6">
              <img
                src="/careerist_logo.png"
                alt="Careerist Logo"
                className="mx-auto mb-4 w-20 h-20"
              />
              <div className="text-lg font-medium mb-2">Your Buddy for Career Guidance</div>
              <div className="text-sm text-cyan-600 font-bold">Powered by Gemini 2.5-Flash</div>
              <div className="mt-6 grid grid-cols-1 gap-3 max-w-md mx-auto">
                <button
                  onClick={() =>
                    sendMessage(null, "What are the key skills for an AI Engineer?")
                  }
                  className="bg-slate-100 p-3 rounded-lg hover:bg-slate-200"
                >
                  What are the key skills for an AI Engineer?
                </button>
                <button
                  onClick={() =>
                    sendMessage(null, "How can I prepare for a software engineering interview?")
                  }
                  className="bg-slate-100 p-3 rounded-lg hover:bg-slate-200"
                >
                  How can I prepare for a software engineering interview?
                </button>
                <button
                  onClick={() =>
                    sendMessage(null, "Provide a detailed roadmap for a successful entrepreneur.")
                  }
                  className="bg-slate-100 p-3 rounded-lg hover:bg-slate-200"
                >
                  Provide a detailed roadmap for a successful entrepreneur.
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {currentMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "human" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-4 py-2 rounded-2xl leading-relaxed whitespace-normal prose break-words ${
                    m.role === "human"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-100 text-slate-900 rounded-bl-none"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 text-slate-500 flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>{loadingPhrase}</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {/* input area */}
        <form onSubmit={sendMessage} className="mt-2 p-2 bg-white flex items-end gap-2 border-t">
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
            }}
            onKeyDown={(e) => {
              // Enter to send, Shift+Enter -> newline
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            placeholder={loading ? loadingPhrase : "Type your question..."}
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none overflow-hidden"
            rows={1}
            style={{ minHeight: "40px", maxHeight: "200px" }}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </main>
    </div>
  );
}
