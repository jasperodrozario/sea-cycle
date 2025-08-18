"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Change navbar style when scrolled past the hero section (approximately screen height)
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight; // Full viewport height

      setIsScrolled(scrollPosition > 50); // Trigger at 80% of hero height
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full p-4 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : ""
      }`}
    >
      <div className="container mx-auto px-12 lg:px-24 xl:px-32 2xl:px-40 flex justify-between items-center">
        <Link href={"/"}>
          <img
            src="/sea-cycle-logo2.svg"
            alt="SeaCycle"
            className={`w-36 mb-2 transition-all duration-300 ${
              isScrolled ? "filter brightness-0" : ""
            }`}
          />
        </Link>
        <div className="hidden md:flex space-x-6 items-center">
          <a
            href="#features"
            className={`transition-colors duration-300 ${
              isScrolled
                ? "text-gray-700 hover:text-cyan-600"
                : "text-white hover:text-cyan-400"
            }`}
          >
            Features
          </a>
          <a
            href="#stats"
            className={`transition-colors duration-300 ${
              isScrolled
                ? "text-gray-700 hover:text-cyan-600"
                : "text-white hover:text-cyan-400"
            }`}
          >
            Live Stats
          </a>
          <a
            href="#"
            className={`transition-colors duration-300 ${
              isScrolled
                ? "text-gray-700 hover:text-cyan-600"
                : "text-white hover:text-cyan-400"
            }`}
          >
            About Us
          </a>
          <Link href={"/dashboard"}>
            <Button
              className={`font-semibold mr-3 transition-all duration-300 ${
                isScrolled
                  ? "bg-gray-100 text-gray-800 hover:bg-cyan-400 hover:text-white border border-gray-300"
                  : "bg-white text-black hover:bg-cyan-400 hover:text-white"
              }`}
            >
              Go to Dashboard
            </Button>
          </Link>
          <Link href={"/signin"}>
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              Join Us
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
