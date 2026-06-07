import { useState } from "react";
import toast from "react-hot-toast";

function SymptomForm() {
  const [formData, setFormData] = useState({
    symptoms: "",
    duration: "",
    severity: 5,
    existingCondition: "",
    age: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.symptoms) {
      toast.error("Please enter your symptoms");
      return;
    }
    if (!formData.duration) {
      toast.error("Please select duration");
      return;
    }
    if (!formData.age) {
      toast.error("Please enter your age");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://mediai-app.onrender.com/api/symptom/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Symptom analysis completed!");
        setResult(data);
        console.log("Symptom check result:", data);
      } else {
        toast.error(data.message || "Failed to check symptoms");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Symptom check error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-gradient-to-b from-blue-100 via-blue-50 to-white min-h-[80vh]">
      <form onSubmit={handleSubmit}>
        <div className="text-center mb-10">
          <h3 className="text-xl font-semibold mb-4">
            What Symptoms are you experiencing?
          </h3>

          <input
            type="text"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="e.g - fever, cold..."
            className="border rounded-md px-4 py-2 shadow-md w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-8 max-w-xl mx-auto">
          {/* Duration */}
          <div>
            <label className="font-medium">Duration:</label>

            <div className="flex gap-10 mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="duration"
                  value="1-2 days"
                  checked={formData.duration === "1-2 days"}
                  onChange={handleChange}
                  className="cursor-pointer"
                />
                1-2 days
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="duration"
                  value="3-7 days"
                  checked={formData.duration === "3-7 days"}
                  onChange={handleChange}
                  className="cursor-pointer"
                />
                3-7 days
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="duration"
                  value="> 1 Week"
                  checked={formData.duration === "> 1 Week"}
                  onChange={handleChange}
                  className="cursor-pointer"
                />
                &gt; 1 Week
              </label>
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="font-medium">
              Severity: <span className="text-blue-600 font-bold">{formData.severity}</span>
            </label>

            <input
              type="range"
              name="severity"
              min="1"
              max="10"
              value={formData.severity}
              onChange={handleChange}
              className="w-full mt-3 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Mild (1)</span>
              <span>Severe (10)</span>
            </div>
          </div>

          {/* Existing Condition */}
          <div>
            <label className="font-medium">Existing Condition:</label>

            <input
              type="text"
              name="existingCondition"
              value={formData.existingCondition}
              onChange={handleChange}
              placeholder="e.g., diabetes, hypertension (optional)"
              className="border rounded-md px-4 py-2 mt-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Age */}
          <div>
            <label className="font-medium">Age:</label>

            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              min="1"
              max="120"
              className="border rounded-md px-4 py-2 mt-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-800 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing..." : "Check Symptom >"}
            </button>
          </div>
        </div>
      </form>

      {/* Result Display */}
      {result && (
        <div className="max-w-xl mx-auto mt-10 bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-lg font-semibold mb-4 text-blue-800">Analysis Result</h4>
          <div className="space-y-2">
            {result.diagnosis && (
              <p className="text-gray-700">
                <span className="font-medium">Possible Diagnosis:</span> {result.diagnosis}
              </p>
            )}
            {result.recommendations && (
              <p className="text-gray-700">
                <span className="font-medium">Recommendations:</span> {result.recommendations}
              </p>
            )}
            {result.urgency && (
              <p className="text-gray-700">
                <span className="font-medium">Urgency Level:</span>{" "}
                <span className={`font-semibold ${
                  result.urgency === "high" ? "text-red-600" :
                  result.urgency === "medium" ? "text-yellow-600" :
                  "text-green-600"
                }`}>
                  {result.urgency}
                </span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SymptomForm;