import React from "react";
import Navbar from "../components/Navbar";
import MentalHealthBot from "../components/MentalHealthBot";
import { ArrowLeft, Heart, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MentalHealthSupport() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-teal-600 flex items-center gap-2 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
          <h2 className="font-bold text-xl text-teal-900">
            Mental Health Support
          </h2>
          <div className="w-[100px]"></div> {/* Spacer */}
        </div>
      </div>

      <div className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 flex flex-col items-center">
        
        {/* Intro */}
        <div className="text-center mb-8 max-w-2xl">
          <h1 className="text-3xl font-extrabold mb-4 text-slate-900">
            You don't have to face it <span className="text-teal-600">alone</span>
          </h1>
          <p className="text-slate-500 text-lg">
            Talk to Dr. Serene, your empathetic AI companion. Share your thoughts, manage stress, and explore personalized coping strategies in a judgment-free zone.
          </p>
        </div>

        {/* Benefits text */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 w-full">
          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-200 text-teal-700 font-semibold">
            <Heart size={18} /> Empathetic Listening
          </div>
          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-200 text-blue-700 font-semibold">
            <Shield size={18} /> 100% Private
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-full max-w-3xl">
          <MentalHealthBot />
        </div>
        
        <p className="text-sm text-gray-400 mt-8 text-center max-w-xl">
          Disclaimer: Dr. Serene is an AI therapist and not a human professional. 
          If you are experiencing a crisis, please reach out to an emergency helpline or a licensed professional in your area.
        </p>

      </div>
    </div>
  );
}

export default MentalHealthSupport;
