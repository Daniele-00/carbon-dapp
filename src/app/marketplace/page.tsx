// Sezione Marketplace per la visualizzazione dei progetti
"use client"

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import ProjectsSection from '@/components/sections/Projects';

export default function MarketplacePage() {

   const [isScrolled, setIsScrolled] = useState(false);
   const [walletConnected, setWalletConnected] = useState(false);
    // Gestione dello scroll per effetti di navigazione
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar isScrolled={isScrolled} walletConnected={walletConnected} setWalletConnected={setWalletConnected} />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-green-800 mb-6">
            Marketplace dei Progetti
          </h1>
          <ProjectsSection />
        </div>
      </div>
      <Footer />
    </main>
  );
}