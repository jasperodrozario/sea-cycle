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

  const isSpecialPage = pathname === "/";

  const navLinks = [
    { href: "/", text: "Home" },
    { href: "/#features", text: "Features" },
    { href: "/#stats", text: "Live Stats" },
    { href: "/#about", text: "About Us" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full py-4 z-50 transition-all duration-300 ${
        isClient && isScrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container-main flex justify-between items-center">
        <Link href={"/"}>
          <img
            src="/sea-cycle-logo2.svg"
            alt="SeaCycle"
            className={`w-36 mb-2 transition-all duration-300 ${
              isScrolled
                ? "filter brightness-0"
                : isSpecialPage
                ? ""
                : "filter brightness-0"
            }`}
          />
        </Link>
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative font-semibold transition-colors duration-300
                ${
                  isScrolled
                    ? "text-gray-700 hover:text-cyan-600"
                    : isSpecialPage
                    ? "text-white hover:text-cyan-400"
                    : "text-gray-700 hover:text-cyan-600"
                }
                ${
                  pathname === link.href
                    ? "after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-full after:h-[0.2rem] after:bg-cyan-500"
                    : ""
                }
              `}
            >
              {link.text}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link href={"/dashboard"}>
                <Button
                  className={`font-semibold transition-all duration-300 ${
                    isScrolled
                      ? "bg-gray-100 text-gray-800 hover:bg-cyan-400 hover:text-white border border-gray-300"
                      : isSpecialPage
                      ? "bg-white text-black border border-white hover:bg-cyan-400 hover:text-white hover:border-cyan-400"
                      : "bg-gray-100 text-gray-800 hover:bg-cyan-400 hover:text-white border border-gray-300"
                  }`}
                >
                  Dashboard
                </Button>
              </Link>
              <Link href={"/analysis"}>
                <Button
                  className={`font-semibold mr-3 transition-all duration-300 ${
                    isScrolled
                      ? "bg-gray-100 text-gray-800 hover:bg-cyan-400 hover:text-white border border-gray-300"
                      : isSpecialPage
                      ? "bg-white text-black border border-white hover:bg-cyan-400 hover:text-white hover:border-cyan-400"
                      : "bg-gray-100 text-gray-800 hover:bg-cyan-400 hover:text-white border border-gray-300"
                  }`}
                >
                  Analysis
                </Button>
              </Link>
              {["Admin", "Municipality"].includes(user.role) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`relative rounded-full transition-colors duration-300 ${
                        isScrolled || isSpecialPage
                          ? "text-gray-700 hover:bg-gray-200"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <Bell className="h-5 w-5" />
                      {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <DropdownMenuItem key={n.id} className="py-2">
                          {n.message}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled>
                        No new notifications
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
                      isScrolled
                        ? "text-gray-800"
                        : isSpecialPage
                        ? "text-white"
                        : "text-gray-800"
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
