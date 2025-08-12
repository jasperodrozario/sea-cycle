import Navbar from "../components/Layout/Navbar";
import HeroSection from "../components/Layout/HeroSection";
import FeaturesSection from "../components/Layout/FeaturesSection";

export default function HomePage() {
  return (
    <div className="bg-gray-950">
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
      {/* A simple footer can be added here later */}
    </div>
  );
}
