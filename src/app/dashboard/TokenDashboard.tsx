"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { ethers } from "ethers";
import { getContract } from "@/web3/contract";
import { p } from "framer-motion/client";

// Interfacce aggiornate per gli eventi
interface TokenMintedEvent extends ethers.EventLog {
  args: ethers.Result & {
    recipient: string;
    amount: bigint;
    emissions: bigint;
  };
}

interface ProjectCompensatedEvent extends ethers.EventLog {
  args: ethers.Result & {
    projectId: bigint;
    user: string;
    tokens: bigint;
  };
}

// Interfaccia per l'evento ProjectCompleted
interface ProjectCompletedEvent extends ethers.EventLog {
  args: ethers.Result & {
    projectId: bigint;
    creator: string;
    amount: bigint;
  };
}

interface ProjectCreatedEvent extends ethers.EventLog {
  args: ethers.Result & {
    projectId: bigint;
    name: string;
    price: bigint;
  };
}

// Aggiungi questa interfaccia all'inizio del file, dopo le altre interfacce
interface ProjectStructure {
  name: string;
  requiredTokens: bigint;
  co2Reduction: bigint;
  price: bigint;
  active: boolean;
  totalContributed: bigint;
  projectOwner: string;
}

interface Transaction {
  type: "purchase" | "contribution" | "completion" | "creation";
  timestamp: Date;
  amount: number;
  hash: string;
  projectName?: string;
}

interface UserStats {
  totalTokens: number;
  carbonFootprint: number;
  compensatedCO2: number;
  projectsContributed: number;
}

export default function DashboardPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalTokens: 0,
    carbonFootprint: 0,
    compensatedCO2: 0,
    projectsContributed: 0,
  });
  const [loading, setLoading] = useState(true);

  const [activeFilters, setActiveFilters] = useState<string[]>([
    "purchase",
    "contribution",
    "completion",
    "creation",
  ]);

  // Gestione scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Controllo stato wallet al caricamento
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Aggiornamento automatico dei dati ogni 30 secondi se il wallet è connesso
  useEffect(() => {
    if (walletConnected) {
      loadUserData();
      const interval = setInterval(loadUserData, 30000);
      return () => clearInterval(interval);
    }
  }, [walletConnected, account]);

  // Gestione eventi MetaMask
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", () => window.location.reload());

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setWalletConnected(false);
      setAccount("");
    } else {
      setWalletConnected(true);
      setAccount(accounts[0]);
    }
  };

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletConnected(true);
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Errore nel controllo del wallet:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask non trovato! Installa MetaMask per continuare.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletConnected(true);
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Errore nella connessione al wallet:", error);
    }
  };

  const loadUserData = async () => {
    if (!walletConnected || !account) return;

    try {
      setLoading(true);
      const contract = await getContract();
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Carica il bilancio dei token
      const balance = await contract.balanceOf(account);

      // Carica gli eventi di acquisto token
      const mintFilter = contract.filters.TokensMinted(account);
      const mintEvents = (await contract.queryFilter(
        mintFilter
      )) as TokenMintedEvent[];

      // Carica gli eventi di contribuzione ai progetti
      const contributionFilter = contract.filters.ProjectCompensated(
        null,
        account
      );
      const contributionEvents = (await contract.queryFilter(
        contributionFilter
      )) as ProjectCompensatedEvent[];

      // Carica gli eventi di completamento progetti
      const completionFilter = contract.filters.ProjectCompleted(null, account);
      const completionEvents = (await contract.queryFilter(
        completionFilter
      )) as ProjectCompletedEvent[];

      // Carica gli eventi di creazione progetti
      const creationFilter = contract.filters.ProjectCreated(null, null);
      const creationEvents = (await contract.queryFilter(
        creationFilter
      )) as ProjectCreatedEvent[];

      const creationTimestamps = await Promise.all(
        creationEvents.map((event) =>
          event.blockNumber ? provider.getBlock(event.blockNumber) : null
        )
      );

      // Ottieni i timestamp dei blocchi per tutti gli eventi
      const mintTimestamps = await Promise.all(
        mintEvents.map((event) =>
          event.blockNumber ? provider.getBlock(event.blockNumber) : null
        )
      );

      const contributionTimestamps = await Promise.all(
        contributionEvents.map((event) =>
          event.blockNumber ? provider.getBlock(event.blockNumber) : null
        )
      );

      const completionTimestamps = await Promise.all(
        completionEvents.map((event) =>
          event.blockNumber ? provider.getBlock(event.blockNumber) : null
        )
      );

      const creationTransactions = await Promise.all(
        creationEvents.map(async (event, index) => {
          const projectData = (await contract.projects(
            event.args.projectId
          )) as ProjectStructure;
          return {
            type: "creation" as const,
            timestamp: creationTimestamps[index]
              ? new Date(
                  Number(creationTimestamps[index]?.timestamp || 0) * 1000
                )
              : new Date(),
            amount: Number(projectData.requiredTokens),
            hash: event.transactionHash,
            projectName:
              "Creazione Progetto #" + event.args.projectId.toString(),
          };
        })
      );

      // Combina e ordina tutte le transazioni
      const allTransactions = [
        ...mintEvents.map((event, index) => ({
          type: "purchase" as const,
          timestamp: mintTimestamps[index]
            ? new Date(Number(mintTimestamps[index]?.timestamp || 0) * 1000)
            : new Date(),
          amount: event.args?.amount ? Number(event.args.amount) : 0,
          hash: event.transactionHash,
        })),
        ...contributionEvents.map((event, index) => ({
          type: "contribution" as const,
          timestamp: contributionTimestamps[index]
            ? new Date(
                Number(contributionTimestamps[index]?.timestamp || 0) * 1000
              )
            : new Date(),
          amount: event.args?.tokens ? Number(event.args.tokens) : 0,
          hash: event.transactionHash,
          projectName:
            "Contribuzione Progetto #" + event.args.projectId.toString(),
        })),
        ...completionEvents.map((event, index) => {
          return {
            type: "completion" as const,
            timestamp: completionTimestamps[index]
              ? new Date(
                  Number(completionTimestamps[index]?.timestamp || 0) * 1000
                )
              : new Date(),
            amount: event.args?.tokens ? Number(event.args.tokens) : 0,
            hash: event.transactionHash,
            projectName: "Progetto #" + event.args.projectId.toString(),
          };
        }),
        ...creationTransactions,
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setTransactions(allTransactions);
      setUserStats({
        totalTokens: Number(balance),
        carbonFootprint: allTransactions.reduce(
          (acc, tx) => (tx.type === "purchase" ? acc + tx.amount * 100 : acc),
          0
        ),
        compensatedCO2: contributionEvents.reduce(
          (acc, event) => acc + Number(event.args?.tokens || 0) * 100,
          0
        ),
        projectsContributed: new Set(
          contributionEvents.map((e) => e.args?.projectId.toString())
        ).size,
      });
    } catch (error) {
      console.error("Errore nel caricamento dei dati:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!walletConnected) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Navbar
          isScrolled={isScrolled}
          walletConnected={walletConnected}
          setWalletConnected={setWalletConnected}
        />
        <div className="pt-24 pb-16 px-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-800 mb-4">
              Connetti il tuo wallet per vedere i tuoi dati
            </h1>
            <button
              onClick={connectWallet}
              className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              Connetti Wallet
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar
        isScrolled={isScrolled}
        walletConnected={walletConnected}
        setWalletConnected={setWalletConnected}
      />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-green-800 mb-8">
            Il Tuo Profilo
          </h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-sm text-gray-600">Token Disponibili</h3>
              <p className="text-2xl font-bold text-green-800">
                {userStats.totalTokens}
              </p>
            </Card>
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-sm text-gray-600">Impronta di CO₂</h3>
              <p className="text-2xl font-bold text-green-800">
                {userStats.carbonFootprint} kg
              </p>
            </Card>
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-sm text-gray-600">CO₂ Compensata</h3>
              <p className="text-2xl font-bold text-green-800">
                {userStats.compensatedCO2} kg
              </p>
            </Card>
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h3 className="text-sm text-gray-600">Progetti Supportati</h3>
              <p className="text-2xl font-bold text-green-800">
                {userStats.projectsContributed}
              </p>
            </Card>
          </div>

          {/* Transactions History */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-green-800 mb-6">
              Storico Transazioni
            </h2>
            <div className="mb-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                Filtra Transazioni
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    setActiveFilters([
                      "purchase",
                      "contribution",
                      "completion",
                      "creation",
                    ])
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
          ${
            activeFilters.length === 4
              ? "bg-green-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
                >
                  Tutte
                </button>
                <button
                  onClick={() => {
                    const isActive = activeFilters.includes("purchase");
                    setActiveFilters((prev) =>
                      isActive
                        ? prev.filter((f) => f !== "purchase")
                        : [...prev, "purchase"]
                    );
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
          ${
            activeFilters.includes("purchase")
              ? "bg-green-100 text-green-800 border-2 border-green-500"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
                >
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Acquisti
                  </span>
                </button>
                <button
                  onClick={() => {
                    const isActive = activeFilters.includes("contribution");
                    setActiveFilters((prev) =>
                      isActive
                        ? prev.filter((f) => f !== "contribution")
                        : [...prev, "contribution"]
                    );
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
          ${
            activeFilters.includes("contribution")
              ? "bg-blue-100 text-blue-800 border-2 border-blue-500"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
                >
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Contribuzioni
                  </span>
                </button>
                <button
                  onClick={() => {
                    const isActive = activeFilters.includes("completion");
                    setActiveFilters((prev) =>
                      isActive
                        ? prev.filter((f) => f !== "completion")
                        : [...prev, "completion"]
                    );
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
          ${
            activeFilters.includes("completion")
              ? "bg-purple-100 text-purple-800 border-2 border-purple-500"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
                >
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    Completamenti
                  </span>
                </button>
                <button
                  onClick={() => {
                    const isActive = activeFilters.includes("creation");
                    setActiveFilters((prev) =>
                      isActive
                        ? prev.filter((f) => f !== "creation")
                        : [...prev, "creation"]
                    );
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 
          ${
            activeFilters.includes("creation")
              ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-500"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
                >
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    Creazioni
                  </span>
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Visualizzazione di{" "}
              {
                transactions.filter((tx) => activeFilters.includes(tx.type))
                  .length
              }{" "}
              transazioni su {transactions.length} totali
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-100">
                      <th className="text-left py-3 px-4 text-gray-800 uppercase text-sm font-medium">
                        Tipo
                      </th>
                      <th className="text-left py-3 px-4 text-gray-800 uppercase text-sm font-medium">
                        Data
                      </th>
                      <th className="text-left py-3 px-4 text-gray-800 uppercase text-sm font-medium">
                        Quantità
                      </th>
                      <th className="text-left py-3 px-4 text-gray-800 uppercase text-sm font-medium">
                        Dettagli
                      </th>
                      <th className="text-left py-3 px-4 text-gray-800 uppercase text-sm font-medium">
                        Hash Transazione
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions
                      .filter((tx) => activeFilters.includes(tx.type))
                      .map((tx, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-700 font-medium">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                tx.type === "purchase"
                                  ? "bg-green-100 text-green-800"
                                  : tx.type === "contribution"
                                  ? "bg-blue-100 text-blue-800"
                                  : tx.type === "completion"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {tx.type === "purchase"
                                ? "Acquisto"
                                : tx.type === "contribution"
                                ? "Contribuzione"
                                : tx.type === "completion"
                                ? "Completamento Progetto"
                                : "Creazione Progetto"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {tx.timestamp.toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-gray-700 font-medium">
                            {tx.amount} Token
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {tx.type === "completion"
                              ? `Token ricevuti per ${tx.projectName}`
                              : tx.projectName || "Acquisto Token"}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            <a
                              href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline truncate max-w-[150px] inline-block"
                            >
                              {tx.hash.substring(0, 10)}...
                              {tx.hash.substring(tx.hash.length - 10)}
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
