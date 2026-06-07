import Landing from "./pages/Landing.jsx";
import SymptomChecker from "./pages/SymptomChecker.jsx";
import MedicineChecker from "./pages/MedicineChecker.jsx";
import MedicalAnalysis from "./pages/MedicalAnalysis.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import MentalHealthSupport from "./pages/MentalHealthSupport.jsx"

import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/symptom-checker",
      element: <SymptomChecker />,
    },
    {
      path: "/medicine-checker",
      element: <MedicineChecker />,
    },
    {
      path: "/medical-analysis",
      element: <MedicalAnalysis />,
    },
    {
      path: "/mental-health-support",
      element: <MentalHealthSupport />,
    },{
      path:"/login",
      element:<Login / >,
    },{
      path:"/signup",
      element:<Signup / >,
    }
  ]);

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
