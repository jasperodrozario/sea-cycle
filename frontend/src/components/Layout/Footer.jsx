import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Sea-Cycle</h2>
            <p className="text-gray-400">Innovating for a cleaner ocean.</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul>
              <li>
                <a href="/" className="text-gray-400 hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-gray-400 hover:text-white">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/analysis" className="text-gray-400 hover:text-white">
                  Analysis
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-2">Connect</h3>
            <p className="text-gray-400">
              Created with love by Jasper D Rozario
            </p>
            <a
              href="https://github.com/jasperodrozario"
              className="text-blue-400 hover:text-blue-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Sea-Cycle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
