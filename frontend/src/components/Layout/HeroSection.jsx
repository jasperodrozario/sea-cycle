"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const HeroSection = () => {
  const whatWeDoCards = [
    {
      title: "🌊 Smart Ocean Monitoring",
      description:
        "AI-powered buoys and drones continuously monitor marine waste hotspots, providing real-time data on ocean pollution levels.",
      icon: "🛰️",
    },
    {
      title: "♻️ Automated Collection",
      description:
        "Our intelligent fleet of collection vessels uses optimized routes to efficiently gather marine debris from identified locations.",
      icon: "🚢",
    },
    {
      title: "🔗 Blockchain Transparency",
      description:
        "Every piece of collected waste is tracked on an immutable ledger, ensuring complete transparency in the recycling process.",
      icon: "⛓️",
    },
    {
      title: "🌍 Global Impact",
      description:
        "Join a worldwide network of ocean cleaners making a measurable difference in marine conservation efforts.",
      icon: "🌐",
    },
  ];

  return (
    <>
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/images/cleaning-the-beach.mov" type="video/mp4" />
          <source src="/images/cleaning-the-beach.mov" type="video/quicktime" />
          {/* Fallback background for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>

        {/* Video Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Hero Content */}
        <div className="relative z-10 p-4 px-12 lg:px-24 xl:px-32 2xl:px-40 max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              Cleaning Our Oceans,
            </h2>
            <h2 className="text-3xl md:text-6xl font-bold mb-8 text-white drop-shadow-lg">
              One Cycle at a Time
            </h2>
          </div>

          <p className="text-lg w-160 font-bold md:text-xl max-w-4xl mx-auto mb-12 text-blue-100 leading-relaxed">
            Harnessing the power of{" "}
            <span className="text-cyan-400 font-semibold">AI</span>,
            <span className="text-cyan-400 font-semibold"> IoT Drones</span>,
            and
            <span className="text-cyan-400 font-semibold"> Blockchain</span> to
            create a transparent and efficient ecosystem for marine waste
            management.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#features"
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Discover How
            </a>
            <a
              href="#stats"
              className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
            >
              View Impact
            </a>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-12 lg:px-24 xl:px-32 2xl:px-40">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-cyan-600">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive approach combines cutting-edge technology with
              environmental stewardship to tackle marine pollution at its
              source.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whatWeDoCards.map((card, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-2 border-transparent hover:border-cyan-200"
              >
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-cyan-600 transition-colors">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
