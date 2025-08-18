"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    imageUrl: "https://github.com/shadcn.png",
  });
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    const checkAuth = () => {
      // add authentication logic here...
      const authenticated = Math.random() > 0.5;
      setIsAuthenticated(authenticated);
    };
    checkAuth();

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isWhitePage =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/dashboard";

  return (
    <nav
      className={`fixed top-0 left-0 w-full p-4 z-50 transition-all duration-300 ${
        isClient && (isScrolled || isWhitePage)
          ? "bg-white shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-12 lg:px-24 xl:px-32 2xl:px-40 flex justify-between items-center">
        <Link href={"/"}>
          <img
            src="/sea-cycle-logo2.svg"
            alt="SeaCycle"
            className={`w-36 mb-2 transition-all duration-300 ${
              isScrolled || isWhitePage ? "filter brightness-0" : ""
            }`}
          />
        </Link>
        <div className="hidden md:flex space-x-6 items-center">
          <a
            href="#features"
            className={`transition-colors duration-300 ${
              isScrolled || isWhitePage
                ? "text-gray-700 hover:text-cyan-600"
                : "text-white hover:text-cyan-400"
            }`}
          >
            Features
          </a>
          <a
            href="#stats"
            className={`transition-colors duration-300 ${
              isScrolled || isWhitePage
                ? "text-gray-700 hover:text-cyan-600"
                : "text-white hover:text-cyan-400"
            }`}
          >
            Live Stats
          </a>
          <a
            href="#"
            className={`transition-colors duration-300 ${
              isScrolled || isWhitePage
                ? "text-gray-700 hover:text-cyan-600"
                : "text-white hover:text-cyan-400"
            }`}
          >
            About Us
          </a>

          {isAuthenticated ? (
            <>
              <Link href={"/dashboard"}>
                <Button
                  className={`font-semibold mr-3 transition-all duration-300 ${
                    isScrolled || isWhitePage
                      ? "bg-gray-100 text-gray-800 hover:bg-cyan-400 hover:text-white border border-gray-300"
                      : "bg-white text-black hover:bg-cyan-400 hover:text-white border border-white"
                  }`}
                >
                  Go to Dashboard
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`font-semibold ${
                      isScrolled || isWhitePage ? "text-gray-800" : "text-white"
                    }`}
                  >
                    {user.name}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setIsAuthenticated(false)}
                    className="text-red-500"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href={"/signup"}>
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                Join Us
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
