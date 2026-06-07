import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Activity, Bot } from "lucide-react";
import { createDoctorSession } from "../utils/gemini";

export default function DoctorChatbot({ selectedPart }) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello! I am Dr. AI, your intelligent medical assistant. Please select a body part on the scanner or describe your symptoms below.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const session = await createDoctorSession("SYMPTOM_CHECKER");
        setChatSession(session);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    if (selectedPart && chatSession) {
      handleSend(`I am experiencing issues/symptoms in my ${selectedPart}.`);
    }
  }, [selectedPart, chatSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend) => {
    if (!textToSend.trim() || !chatSession || isLoading) return;

    const userMessage = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage(textToSend);
      setMessages((prev) => [...prev, { role: "model", text: result.response.text() }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Dr. AI is currently offline. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden font-sans relative">
      
      {/* Decorative gradient orb */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="bg-white/40 backdrop-blur-md border-b border-white/60 px-8 py-5 flex items-center gap-4 relative z-10">
        <div className="relative">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/30">
            <Activity className="animate-pulse" size={24} />
          </div>
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-xl tracking-tight">Dr. AI Diagnosis</h3>
          <p className="text-sm text-blue-600 font-semibold tracking-wide flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 relative z-10 scrollbar-hide">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-end max-w-[85%] gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* Avatar */}
                <div className={`shrink-0 rounded-2xl p-2.5 flex items-center justify-center shadow-sm ${
                  msg.role === "user" ? "bg-slate-100 text-slate-500" : "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white"
                }`}>
                  {msg.role === "user" ? <User size={18} /> : <Bot size={18} />}
                </div>

                {/* Bubble */}
                <div
                  className={`px-6 py-4 rounded-[1.5rem] text-[15px] leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-slate-800 text-white rounded-br-sm inline-block"
                      : "bg-white/80 backdrop-blur-md text-slate-700 border border-white/60 rounded-bl-sm inline-block"
                  }`}
                >
                  {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="flex items-end gap-3">
                <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shrink-0 rounded-2xl p-2.5 shadow-sm">
                  <Bot size={18} />
                </div>
                <div className="bg-white/80 backdrop-blur-md px-6 py-5 rounded-[1.5rem] rounded-bl-sm border border-white/60 shadow-sm flex items-center gap-2">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2.5 h-2.5 bg-blue-500 rounded-full"></motion.div>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2.5 h-2.5 bg-blue-500 rounded-full"></motion.div>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2.5 h-2.5 bg-blue-500 rounded-full"></motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input */}
      <div className="p-5 bg-white/60 backdrop-blur-xl border-t border-white/50 relative z-10 m-3 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 bg-white border border-slate-200/60 rounded-xl p-1.5 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all shadow-inner">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Type your symptoms (e.g., headache, fever)..."
            className="flex-1 px-4 py-3 bg-transparent font-medium text-slate-700 outline-none placeholder:text-slate-400 placeholder:font-normal"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none transition-all duration-300"
          >
            <Send size={20} className={input.trim() ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
}
