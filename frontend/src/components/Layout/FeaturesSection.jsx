import React from "react";

const features = [
  {
    title: "AI Drone Detection",
    description:
      "Autonomous drones patrol coastlines, using AI to automatically identify and geolocate marine debris.",
    imageUrl:
      "https://images.pexels.com/photos/5711920/pexels-photo-5711920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    title: "IoT Hotspot Monitoring",
    description:
      "Smart buoys provide 24/7 real-time data on waste accumulation in critical areas like river mouths.",
    imageUrl:
      "https://images.pexels.com/photos/2448749/pexels-photo-2448749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    title: "GIS Route Optimization",
    description:
      "Our platform analyzes all data points to create the most fuel-efficient collection routes for our vessels.",
    imageUrl:
      "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    title: "Blockchain Verification",
    description:
      "Every kilogram of collected waste is tracked on a tamper-proof ledger, ensuring a transparent recycling process.",
    imageUrl:
      "https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

const FeatureCard = ({ title, description, imageUrl }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 border border-cyan-500/30">
    <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2 text-cyan-400">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  </div>
);

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-gray-900 py-20 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Our Process in Action
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
