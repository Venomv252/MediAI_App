import FeatureCard from "./FeatureCard";
import { FaHeartbeat, FaPills, FaComments } from "react-icons/fa";

function FeaturesSection() {
  return (
    <section className="flex justify-center gap-10 py-12 bg-slate-100">
      <FeatureCard
        Icon={FaHeartbeat}
        title="Symptom Checker"
        description="Identify potential health issues"
        button="Check Now >"
        link="/symptom-checker"
      />
      <FeatureCard
        Icon={FaPills}
        title="Medicine Checker"
        description="Get information on medicine"
        button="Check Now >"
        link="/medicine-checker"
      />
      <FeatureCard
        Icon={FaComments}
        title="Mental Health"
        description="Therapy Session"
        button="Talk Now >"
        link="/mental-health-support"
      />
    </section>
  );
}

export default FeaturesSection;