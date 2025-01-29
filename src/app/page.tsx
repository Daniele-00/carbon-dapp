//HOMEPAGE Principale
"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navigation/Navbar";
import HeroSection from "@/components/sections/Hero";
import FeaturesSection from "@/components/sections/Features";
import ProjectsSection from "@/components/sections/Projects";
import StatsSection from "@/components/sections/Stats";
import CTASection from "@/components/sections/CTA";
import Footer from "@/components/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";

const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [walletConnected, setWalletConnected] = useState(false);

  // Gestione dello scroll per effetti di navigazione
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <main className="min-h-screen">
        <Navbar
          isScrolled={isScrolled}
          walletConnected={walletConnected}
          setWalletConnected={setWalletConnected}
        />
        <HeroSection/>
        <FeaturesSection/>
        <StatsSection/>
        <CTASection/>
        <Footer/>
        <Alert/>
      </main>
    </div>
  );
};

export default HomePage;
