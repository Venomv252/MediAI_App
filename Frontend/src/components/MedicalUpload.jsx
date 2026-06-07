import { useState } from "react";
import { FaCloudUploadAlt, FaFileUpload } from "react-icons/fa";
import toast from "react-hot-toast";
import xray from "../assets/download.jpg";

function MedicalUpload() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [textData, setTextData] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Validate file type for images
      if (selectedFile.type.startsWith("image/")) {
        if (selectedFile.size > 10 * 1024 * 1024) {
          toast.error("Image size should be less than 10MB");
          return;
        }
        setPreview(URL.createObjectURL(selectedFile));
        setFile(selectedFile);
        setResult(null);
      } else {
        toast.error("Please upload an image file");
      }
    }
  };

  const handleTextFile = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Validate file type for text/documents
      const validTypes = ["text/plain", "application/pdf", "application/json"];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Please upload a text, PDF, or JSON file");
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      setFile(selectedFile);
      setResult(null);
      toast.success("File selected successfully");
    }
  };

  const handleSubmit = async () => {
    if (!file && !textData) {
      toast.error("Please upload a file or enter text data");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      if (file) {
        formData.append("medicalFile", file);
      }
      
      if (textData) {
        formData.append("textData", textData);
      }

      const response = await fetch("http://localhost:8080/api/medical/analyze", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Medical data analyzed successfully!");
        setResult(data);
        console.log("Medical analysis result:", data);
      } else {
        toast.error(data.message || "Failed to analyze medical data");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Medical analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-10">
      {/* X-ray Preview */}
      <div className="relative w-full rounded-xl overflow-hidden shadow bg-white">
        <img
          src={preview ? preview : xray}
          alt="xray"
          className="w-full h-[220px] object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent"></div>

        {preview && (
          <button
            onClick={() => {
              setPreview(null);
              setFile(null);
              setResult(null);
            }}
            className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 z-10"
          >
            Remove
          </button>
        )}
      </div>

      {/* Drag and Drop Upload */}
      <label className="w-full bg-[#f3f4f6] rounded-xl shadow py-10 flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-100 transition">
        <FaCloudUploadAlt className="text-4xl text-blue-400" />

        <span className="text-gray-700">
          Drag and drop or{" "}
          <span className="text-blue-600 font-medium">Browse</span>
        </span>
        <span className="text-xs text-gray-500">
          (X-ray, MRI, CT Scan images)
        </span>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </label>

      {/* Upload Text */}
      <label className="w-full bg-[#f3f4f6] rounded-xl shadow py-8 flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-100 transition">
        <FaFileUpload className="text-3xl text-blue-300" />

        <span className="text-gray-700">
          Select File or{" "}
          <span className="text-blue-600 font-medium">Upload text</span>
        </span>
        <span className="text-xs text-gray-500">
          (PDF, TXT, JSON files)
        </span>

        <input
          type="file"
          accept=".txt,.pdf,.json"
          className="hidden"
          onChange={handleTextFile}
        />
      </label>

      {/* Text Input Area */}
      <div className="w-full">
        <label className="block text-gray-700 font-medium mb-2">
          Or Enter Medical Data as Text:
        </label>
        <textarea
          value={textData}
          onChange={(e) => setTextData(e.target.value)}
          placeholder="Enter patient symptoms, medical history, test results, etc."
          className="w-full bg-white border border-gray-300 rounded-xl p-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-900 text-white px-10 py-3 rounded-md shadow hover:bg-blue-800 transition disabled:bg-blue-500 disabled:cursor-not-allowed font-semibold"
      >
        {loading ? "Analyzing..." : "Submit"}
      </button>

      {/* Result Display */}
      {result && (
        <div className="w-full bg-white rounded-xl shadow-lg p-6 mt-4">
          <h4 className="text-lg font-semibold mb-4 text-blue-800">
            Analysis Result
          </h4>
          <div className="space-y-3">
            {result.findings && (
              <div>
                <span className="font-medium text-gray-700">Findings:</span>
                <p className="text-gray-600 mt-1">{result.findings}</p>
              </div>
            )}
            {result.diagnosis && (
              <div>
                <span className="font-medium text-gray-700">Diagnosis:</span>
                <p className="text-gray-800">{result.diagnosis}</p>
              </div>
            )}
            {result.recommendations && (
              <div>
                <span className="font-medium text-gray-700">Recommendations:</span>
                <p className="text-gray-600">{result.recommendations}</p>
              </div>
            )}
            {result.severity && (
              <div>
                <span className="font-medium text-gray-700">Severity:</span>
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    result.severity === "high"
                      ? "bg-red-100 text-red-700"
                      : result.severity === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {result.severity}
                </span>
              </div>
            )}
            {result.nextSteps && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <span className="font-medium text-blue-800">📋 Next Steps:</span>
                <p className="text-blue-700 mt-1">{result.nextSteps}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalUpload;