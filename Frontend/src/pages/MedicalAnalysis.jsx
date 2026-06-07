import Navbar from "../components/Navbar";
import MedicalUpload from "../components/MedicalUpload";

function MedicalAnalysis() {
  return (
    <div className="min-h-screen bg-[#e9edf4]">

      <Navbar />

      <div className="flex justify-center py-16">

        <div className="w-[650px]">

          <h2 className="text-blue-900 font-semibold mb-6">
            Medical Data Analysis
          </h2>

          <MedicalUpload />

        </div>

      </div>

    </div>
  );
}

export default MedicalAnalysis;