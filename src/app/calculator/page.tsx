// Componente per la pagina del calcolatore di impronta di carbonio
"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { buyCarbon2DTokens, getContract } from "@/web3/contract";
import { ethers } from "ethers";

export default function CalculatorPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");
  const [account, setAccount] = useState("");

  const [formData, setFormData] = useState({
    electricity: "",
    carKm: "",
    flights: "",
    meatConsumption: "",
  });

  const [result, setResult] = useState({
    co2: 0,
    tokens: 0,
  });


  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Connessione al wallet
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

  // Acquisto dei token 
  const handleTokenPurchase = async () => {
    if (!walletConnected) {
      await connectWallet();
      return;
    }
  
    try {
      setIsConnecting(true);
      setSuccessMessage("");
      setError("");
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const tx = await buyCarbon2DTokens(provider, result.tokens);
      await tx.wait();
  
      setSuccessMessage("Token acquistati con successo! TX Hash: " + tx.hash);
    } catch (error: any) {
      console.error(error);
      setError("Errore nell'acquisto dei token: " + (error.message || "Errore sconosciuto"));
    } finally {
      setIsConnecting(false);
    }
  };
  
  

  const calculateFootprint = () => {
    const coefficients = {
      electricity: 0.4,
      carKm: 0.2,
      flights: 200,
      meat: 50,
    };

    const totalCO2 =
      Number(formData.electricity) * coefficients.electricity +
      Number(formData.carKm) * coefficients.carKm +
      Number(formData.flights) * coefficients.flights +
      Number(formData.meatConsumption) * coefficients.meat;

    const tokens = Math.ceil(totalCO2 / 100);

    setResult({
      co2: totalCO2,
      tokens: tokens,
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar
        isScrolled={isScrolled}
        walletConnected={walletConnected}
        setWalletConnected={setWalletConnected}
      />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {/* Hero Section */}
        <div className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Calcola la tua Impronta di Carbonio
              </span>
            </h1>
            <p className="text-lg text-green-700 max-w-2xl mx-auto">
              Scopri il tuo impatto ambientale e trasformalo in azione concreta
              attraverso i nostri green token
            </p>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-green-700 mb-2">
                    Consumo elettrico
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.electricity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          electricity: e.target.value,
                        }))
                      }
                      className="w-full p-4 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-800 pr-16"
                      placeholder="kWh/anno"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 bg-white px-2">
                      kWh
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium text-green-700 mb-2">
                    Chilometri in auto
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.carKm}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          carKm: e.target.value,
                        }))
                      }
                      className="w-full p-4 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-800 pr-16"
                      placeholder="km/anno"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 bg-white px-2">
                      km
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium text-green-700 mb-2">
                    Voli aerei
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.flights}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          flights: e.target.value,
                        }))
                      }
                      className="w-full p-4 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-800 pr-16"
                      placeholder="numero/anno"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 bg-white px-2">
                      voli
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium text-green-700 mb-2">
                    Consumo di carne
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.meatConsumption}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          meatConsumption: e.target.value,
                        }))
                      }
                      className="w-full p-4 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-800 pr-16"
                      placeholder="kg/anno"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 bg-white px-2">
                      kg
                    </div>
                  </div>
                </div>

                <button
                  onClick={calculateFootprint}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-medium text-lg hover:from-green-600 hover:to-emerald-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Calcola Impronta
                </button>
              </div>
            </Card>

            {/* Results Section */}
            <div className="space-y-6">
              {/* CO2 Result */}
              {result.co2 > 0 && (
                <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg transform hover:scale-[1.02] transition-all duration-300">
                  <h3 className="text-lg text-green-600 mb-2">
                    La tua impronta di carbonio annuale
                  </h3>
                  <p className="text-4xl font-bold text-green-800 mb-2">
                    {result.co2.toFixed(2)} kg CO₂
                  </p>
                  <div className="w-full bg-green-200 h-2 rounded-full mt-4">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min((result.co2 / 2000) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </Card>
              )}

              {/* Tokens Result */}
              {result.tokens > 0 && (
                <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg transform hover:scale-[1.02] transition-all duration-300">
                  <h3 className="text-lg text-blue-600 mb-2">
                    Carbon2DToken Necessari
                  </h3>
                  <p className="text-4xl font-bold text-blue-800 mb-2">
                    {result.tokens} C2DT
                  </p>
                  <p className="text-blue-600">
                    Token necessari per la compensazione della tua impronta
                  </p>
                  <button
                    onClick={handleTokenPurchase}
                    disabled={isConnecting}
                    className="w-full mt-4 bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                  >
                    {isConnecting
                      ? "Elaborazione..."
                      : walletConnected
                      ? "Acquista Token"
                      : "Connetti Wallet"}
                  </button>
                  {successMessage && (
                    <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                      {successMessage}
                    </div>
                  )}
                  {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
