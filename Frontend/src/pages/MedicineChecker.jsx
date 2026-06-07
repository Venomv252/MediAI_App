import Navbar from "../components/Navbar";
import MedicineUpload from "../components/MedicineUpload";
import { ArrowLeft, Target, ShieldCheck, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MedicineChecker() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-slate-50 to-blue-50/50 font-sans text-slate-800 relative overflow-hidden">
      {/* Decorative background orbs */}
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full">
        <Navbar />
      </div>

      {/* Header */}
      <div className="border-b border-white/60 bg-white/60 backdrop-blur-xl sticky top-0 z-30 shadow-[0_4px_30px_rgb(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-slate-500 hover:text-blue-600 flex items-center gap-2 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
          <h2 className="font-bold text-xl tracking-tight text-slate-800">
            Medicine Identifier & Analyser
          </h2>
          <div className="w-[100px]"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900 leading-tight">
            Understand Your Medication<br/> <span className="text-blue-600">Instantly</span>
          </h1>
          <p className="text-slate-500 text-lg">
            Upload an image or enter the name of your medicine. Our AI Pharmacist will extract essential information including uses, dosages, side effects, and strict warnings.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="flex justify-center gap-8 mb-12">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Target className="text-blue-500" size={20} /> Accurate Recognition
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Zap className="text-yellow-500" size={20} /> Instant Analysis
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <ShieldCheck className="text-green-500" size={20} /> Safe Usage Guidelines
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full">
            <MedicineUpload />
          </div>
        </div>

      </div>
    </div>
  );
}

export default MedicineChecker;