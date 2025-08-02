import React from "react";
// import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white bg-cover bg-center">
      <div className="absolute inset-0 bg-black bg-opacity-60">
        <img src="/images/ocean-waves.jpg" alt="" />
      </div>
      <div className="relative z-10 p-4">
        <h2 className="text-5xl md:text-7xl font-extrabold mb-4">
          Cleaning Our Oceans,
        </h2>
        <h2 className="text-5xl md:text-7xl font-extrabold mb-4">
          One Cycle at a Time.
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
          Sea-Cycle uses AI, Drones, and Blockchain to create a transparent and
          efficient system for managing marine waste.
        </p>
        <a
          href="#features"
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform hover:scale-105"
        >
          Discover How
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
