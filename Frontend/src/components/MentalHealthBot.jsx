import React, { useState, useEffect, useRef } from "react";
import { Send, User, HeartHandshake } from "lucide-react";
import { createDoctorSession } from "../utils/gemini";

export default function MentalHealthBot() {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello, I'm Dr. Serene. I'm here to listen, support you, and hold a safe space for whatever is on your mind today.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const session = await createDoctorSession("MENTAL_HEALTH");
        setChatSession(session);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
      }
    };
    initChat();
  }, []);

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
        { role: "model", text: "I'm sorry, I couldn't reach my network connection. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden font-sans">
      
      {/* Header */}
      <div className="bg-teal-50 border-b border-teal-100 px-6 py-4 flex items-center gap-4">
        <div className="bg-teal-500 p-2.5 rounded-full text-white shadow-sm">
          <HeartHandshake size={24} />
        </div>
        <div>
          <h3 className="font-bold text-teal-900 text-lg">Dr. Serene</h3>
          <p className="text-sm text-teal-700 font-medium">
            Your Safe Space
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-slate-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex items-end max-w-[85%] gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              
              {/* Avatar */}
              <div className={`shrink-0 rounded-full p-2 flex items-center justify-center shadow-sm ${
                msg.role === "user" ? "bg-gray-200 text-gray-600" : "bg-teal-500 text-white"
              }`}>
                {msg.role === "user" ? <User size={16} /> : <HeartHandshake size={16} />}
              </div>

              {/* Bubble */}
              <div
                className={`px-5 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm border ${
                  msg.role === "user"
                    ? "bg-teal-600 text-white border-teal-700 rounded-br-none"
                    : "bg-white text-gray-800 border-gray-200 rounded-bl-none"
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
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-end gap-3">
              <div className="bg-teal-500 text-white shrink-0 rounded-full p-2 shadow-sm">
                <HeartHandshake size={16} />
              </div>
              <div className="bg-white px-5 py-4 rounded-2xl border border-gray-200 rounded-bl-none shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 bg-teal-300 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-teal-300 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-teal-300 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-300 rounded-xl p-2 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Share what's on your mind..."
            className="flex-1 px-3 py-2 bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
