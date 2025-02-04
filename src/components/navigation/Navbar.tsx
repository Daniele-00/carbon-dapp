// Componente Navbar per la navigazione
"use client";
import React, { useState, useEffect } from "react";
import Lottie from "lottie-react"; // Importa Lottie React
import { ethers } from "ethers";

// Importazione dell'animazione usando require
const animationData = require('/public/animations/logo.json');

interface NavbarProps {
  isScrolled: boolean;
  walletConnected: boolean;
  setWalletConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

// Definiamo il componente Navbar

const Navbar: React.FC<NavbarProps> = ({
  isScrolled,
  walletConnected,
  setWalletConnected,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [account, setAccount] = useState("");

  // Collegamenti della navigazione
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Calcola", href: "/calculator" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "I Tuoi Token", href: "/dashboard" },
  ];



 // Funzione per connettere il wallet
 const connectWallet = async () => {
  if (!window.ethereum) {
    setError("MetaMask non trovato! Installa MetaMask per continuare.");
    return;
  }

  try {
    setIsConnecting(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
    setWalletConnected(true);
    setError("");
  } catch (err) {
    setError("Errore nella connessione al wallet");
    console.error(err);
  } finally {
    setIsConnecting(false);
  }
};

// Funzione per disconnettere il wallet
const disconnectWallet = () => {
  setAccount("");
  setWalletConnected(false);
  setNotification("Wallet disconnesso con successo. Per disconnettere MetaMask, chiudi manualmente il wallet.");
  setTimeout(() => setNotification(""), 5000); // Nasconde il messaggio dopo 3 secondi
};



 // Controlla se il wallet è già connesso al caricamento
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0].address);
            setWalletConnected(true);
          }
        } catch (err) {
          console.error("Errore nel controllo del wallet:", err);
        }
      }
    };

    checkWalletConnection();
  }, []);


    // Ascolta i cambiamenti dell'account
    useEffect(() => {
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setWalletConnected(true);
          } else {
            disconnectWallet();
          }
        });
      }
  
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', () => {});
        }
      };
    }, []);


    const WalletButton = () => (
      <button
        onClick={walletConnected ? disconnectWallet : connectWallet}
        disabled={isConnecting}
        className={`px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
          isConnecting
            ? "bg-gray-300 cursor-not-allowed"
            : walletConnected
            ? "bg-red-100 text-red-800 hover:bg-red-200"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        {isConnecting ? (
          "Connessione..."
        ) : walletConnected ? (
          <span className="flex items-center space-x-2">
            <span>Disconnetti ({account.slice(0, 6)}...{account.slice(-4)})</span>
          </span>
        ) : (
          "Connetti Wallet"
        )}
      </button>
    );
    



  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-lg shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-15 h-15"> {/* Dimensioni fisse per il contenitore */}
             {/* Immagine del logo */}
              <img src="/images/logo.jpg" alt="EcoChain Logo" 
                className="w-14 h-14" // Dimensioni dell'animazione
                style={{ borderRadius: '50%' }} // effetto rounded
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
              EcoChain
            </span>
          </div>

          {/* Navigation Links*/}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-green-700 hover:text-green-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {link.name}
              </a>
              
            ))}
            <WalletButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-green-700 hover:text-green-500 hover:bg-green-50 transition-colors duration-200"
            >
              <span className="sr-only">Apri menu principale</span>
              {/* Cambio d'icona*/}
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-green-700 hover:text-green-500 hover:bg-green-50 transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
         <WalletButton />
        </div>
      </div>
      {/* Notification Message */}
      {notification && (
        <div className="fixed bottom-5 right-5 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-20 right-4 p-4 bg-red-100 text-red-700 rounded-lg shadow-lg z-50">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
