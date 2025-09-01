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
  <div className="group bg-white rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-cyan-200">
    <div className="relative overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-cyan-600 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
    <div className="px-6 pb-6">
      <div className="w-full h-1 bg-cyan-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </div>
  </div>
);

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-cyan-50 py-20">
      <div className="container mx-auto px-12 lg:px-24 xl:px-32 2xl:px-40">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-cyan-600">
            Our Process in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our cutting-edge technology creates a seamless cycle of
            ocean cleanup and waste management.
          </p>
        </div>
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
