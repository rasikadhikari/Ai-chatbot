"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/shadcn-io/button";

function Navbar() {
  const [showNavbar, setNavbar] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setNavbar(false);
      } else {
        setNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);
  return (
    <div>
      <nav
        className={`bg-transparent w-full px-8 py-4 fixed top-0 left-0 right-0 z-20 transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="text-white text-2xl font-bold">AI-BOT</div>
          <ul className="flex items-center justify-center space-x-8 w-full">
            <li>
              <a href="#home" className="text-white hover:text-gray-400">
                Home
              </a>
            </li>
            <li>
              <a href="#product" className="text-white hover:text-gray-400">
                Product
              </a>
            </li>
            <li>
              <a href="#pricing" className="text-white hover:text-gray-400">
                Pricing
              </a>
            </li>
            <li>
              <a href="#faq" className="text-white hover:text-gray-400">
                FAQ
              </a>
            </li>
          </ul>
          <div className="flex space-x-0 ml-auto gap-2">
            <Button className="bg-gray-200 text-black p-3 rounded-lg">
              Login
            </Button>
            <Button className="bg-gray-200 text-black p-3 rounded-lg">
              Sign Up{" "}
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
