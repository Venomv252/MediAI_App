import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HumanBodySVG from "../components/HumanBodySVG";
import DoctorChatbot from "../components/DoctorChatbot";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Activity } from "lucide-react";

function SymptomChecker() {
  const navigate = useNavigate();
  const [selectedPart, setSelectedPart] = useState("");

  const handlePartClick = (part) => {
    setSelectedPart(part);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-100 font-sans text-slate-800 selection:bg-blue-200">
      <Navbar />

      {/* Header */}
      <div className="border-b border-white/50 bg-white/60 backdrop-blur-xl sticky top-0 z-20 shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-slate-500 hover:text-blue-600 flex items-center gap-2 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
          <h2 className="font-bold text-xl tracking-tight text-slate-800 flex items-center gap-2">
            <Activity className="text-blue-600" />
            Intelligent Symptom Checker
          </h2>
          <div className="w-[100px]"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight mb-3 text-slate-900">Where does it hurt?</h1>
          <p className="text-slate-500 text-lg">
            Tap a specific area on the body map, or describe your symptoms directly. Dr. AI will diagnose your condition instantly.
          </p>
        </div>

        {/* Single Cohesive Container */}
        <div className="w-full h-[650px] bg-white/70 backdrop-blur-3xl border border-white/80 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row relative">
          
          {/* Decorative background orb inside container */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Left Column: 2D Body Map */}
          <div className="w-full md:w-[280px] lg:w-[320px] bg-slate-50/50 border-r border-slate-100 flex flex-col items-center justify-center p-6 relative z-10 shrink-0">
            <div className="text-center mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Body Map</p>
              <h3 className="font-semibold text-slate-700">Select an Area</h3>
            </div>
            
            <div className="flex-1 w-full max-h-[400px]">
              <HumanBodySVG selectedPart={selectedPart} onPartClick={handlePartClick} />
            </div>

            <div className="mt-8 w-full bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 text-center shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Selection</p>
              <p className="text-blue-700 font-bold text-lg">
                {selectedPart || "None"}
              </p>
            </div>
          </div>

          {/* Right Column: Chatbot */}
          <div className="flex-1 relative z-10">
            <DoctorChatbot selectedPart={selectedPart} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default SymptomChecker;