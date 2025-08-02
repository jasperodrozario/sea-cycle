import React from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-opacity-80 text-white p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white-400">🌊 Sea-Cycle</h1>
        <div className="hidden md:flex space-x-6 items-center">
          <a href="#features" className="hover:text-cyan-400 transition-colors">
            Features
          </a>
          <a href="#stats" className="hover:text-cyan-400 transition-colors">
            Live Stats
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors">
            About Us
          </a>
          <Button className="bg-white font-semibold text-black hover:bg-cyan-400 hover:text-white">
            Go to Dashboard
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
