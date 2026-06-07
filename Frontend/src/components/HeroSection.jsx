import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="text-center py-16 bg-slate-100">
      <h1 className="text-4xl font-bold text-blue-900 mb-3">
        Your AI Health Companion -
      </h1>
      <p className="text-gray-600 mb-6">
        Check symptoms, medicines, and mental wellness
      </p>
      <Link to="/signup">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
          Get Started &gt;
        </button>
      </Link>
    </section>
  );
}

export default HeroSection;