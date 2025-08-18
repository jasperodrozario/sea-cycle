import Navbar from "../components/Layout/Navbar";
import HeroSection from "../components/Layout/HeroSection";
import FeaturesSection from "../components/Layout/FeaturesSection";
import RecylceStats from "@/components/ui/RecycleStats";

export default function HomePage() {
  return (
    <div className="bg-gray-950">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        {/* Stats Section */}
        <section id="stats" className="bg-white py-16">
          <div className="container mx-auto px-12 lg:px-24 xl:px-32 2xl:px-40">
            <RecylceStats />
          </div>
        </section>
      </main>
      {/* A simple footer can be added here later */}
    </div>
  );
}
