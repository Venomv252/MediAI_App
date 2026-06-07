import React, { useState } from "react";
import { UploadCloud, Pill, AlertTriangle, FileText, Activity, Layers } from "lucide-react";
import toast from "react-hot-toast";
import { analyzeMedicine } from "../utils/gemini";
import medicinePlaceholder from "../assets/medicine.jpg"; // Keep if exists, or use generic fallback

export default function MedicineUpload() {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [medicineText, setMedicineText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImage(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!file && !medicineText.trim()) {
      toast.error("Please upload an image or enter a medicine name");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await analyzeMedicine(medicineText, file);
      if (data.error) {
        toast.error("Failed to analyze medicine.");
      } else {
        toast.success("Medicine analyzed successfully!");
        setResult(data);
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 items-start justify-center text-slate-800">
      {/* Left Area: Input */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-xl mb-4 text-slate-800 flex items-center gap-2">
            <Pill className="text-blue-600" /> Medicine Details
          </h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-500 mb-2">Medicine Name (Optional if uploading image)</label>
            <input
              type="text"
              value={medicineText}
              onChange={(e) => setMedicineText(e.target.value)}
              placeholder="e.g. Paracetamol 500mg"
              className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="mb-6 flex flex-col items-center">
            <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleUpload}
              />
              {image ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm">
                  <img src={image} alt="uploaded" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white font-medium">Click to change</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="bg-white p-4 rounded-full shadow-sm w-16 h-16 flex items-center justify-center mx-auto mb-4 text-blue-600">
                    <UploadCloud size={32} />
                  </div>
                  <p className="font-medium text-slate-700">Upload Medicine Image</p>
                  <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
            {image && (
              <button
                onClick={() => { setImage(null); setFile(null); }}
                className="mt-3 text-red-500 font-medium text-sm hover:underline"
              >
                Remove Image
              </button>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || (!file && !medicineText)}
            className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl shadow-md hover:bg-blue-700 transition flex justify-center items-center gap-2 disabled:bg-blue-400 disabled:shadow-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </div>
            ) : (
              "Analyze Medicine"
            )}
          </button>
        </div>
      </div>

      {/* Right Area: Result */}
      <div className="w-full md:w-1/2">
        {result ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
              <div className="bg-green-100 text-green-700 p-3 rounded-full">
                <Pill size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800">{result.medicineName || "Unknown Medicine"}</h4>
                <p className="text-slate-500 text-sm font-medium">{result.genericName}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <FileText className="text-slate-400 shrink-0 mt-1" size={20} />
                <div>
                  <h5 className="font-semibold text-slate-700 uppercase tracking-wider text-xs mb-1">Uses</h5>
                  <p className="text-slate-600 font-medium leading-relaxed">{result.uses || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Layers className="text-slate-400 shrink-0 mt-1" size={20} />
                <div>
                  <h5 className="font-semibold text-slate-700 uppercase tracking-wider text-xs mb-1">Recommended Dosage</h5>
                  <p className="text-slate-600 font-medium leading-relaxed">{result.dosage || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Activity className="text-slate-400 shrink-0 mt-1" size={20} />
                <div>
                  <h5 className="font-semibold text-slate-700 uppercase tracking-wider text-xs mb-1">Side Effects</h5>
                  <p className="text-slate-600 font-medium leading-relaxed">{result.sideEffects || "N/A"}</p>
                </div>
              </div>

              {result.warnings && (
                <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-xl flex items-start gap-4 mt-8">
                  <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h5 className="font-semibold text-yellow-800 mb-1">Important Warnings</h5>
                    <p className="text-yellow-700 text-sm leading-relaxed">{result.warnings}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8 text-center">
            <div className="bg-white p-5 rounded-full shadow-sm text-slate-300 mb-4">
              <Pill size={40} />
            </div>
            <h4 className="text-lg font-semibold text-slate-700 mb-2">No Medicine Analyzed Yet</h4>
            <p className="text-slate-500 max-w-sm">
              Upload an image of a medicine strip/bottle or type its name to see detailed information, uses, and warnings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}