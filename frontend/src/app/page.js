import Navbar from "../components/Layout/Navbar";
import HeroSection from "../components/Layout/HeroSection";
import FeaturesSection from "../components/Layout/FeaturesSection";
import StatsSection from "../components/Layout/StatsSection";

export default function HomePage() {
  return (
    <div className="bg-gray-950">
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
      </main>
      {/* A simple footer can be added here later */}
    </div>
  );
}
