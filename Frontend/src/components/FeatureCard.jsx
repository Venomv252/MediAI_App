import { Link } from "react-router-dom";

function FeatureCard({ Icon, title, description, button, link }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md text-center w-72 hover:shadow-lg transition">
      <div className="flex justify-center mb-4">
        <Icon className="text-3xl text-gray-700" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {title}
      </h3>
      <p className="text-gray-500 text-sm mb-4">
        {description}
      </p>
      <Link to={link}>
        <button className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800">
          {button}
        </button>
      </Link>
    </div>
  );
}

export default FeatureCard;