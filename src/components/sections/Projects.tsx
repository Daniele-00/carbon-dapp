"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contributeToProject, getContract } from "@/web3/contract";

interface Project {
  id: number;
  title: string;
  description: string;
  tokens: number; // Solo questo campo per i token
  co2: string;
  location: string;
}

// Funzione per caricare i progetti da localStorage
const loadProjects = (): Project[] => {
  try {
    const savedProjects = localStorage.getItem("carbonProjects");
    return savedProjects
      ? JSON.parse(savedProjects)
      : [
          {
            id: 1,
            title: "Riforestazione Amazzonica",
            description: "Supporta la riforestazione della foresta amazzonica",
            tokens: 5,
            co2: "500kg",
            location: "America Del Sud",
          },
          {
            id: 2,
            title: "Energia Solare in Africa",
            description: "Installa pannelli solari in comunità rurali africane",
            tokens: 3,
            co2: "300kg",
            location: "Africa",
          },
          {
            id: 3,
            title: "Turbine Eoliche",
            description: "Sviluppo di un parco eolico per energia pulita",
            tokens: 8,
            co2: "800kg",
            location: "Europa",
          },
        ];
  } catch (error) {
    console.error("Errore nel caricare i progetti:", error);
    return [];
  }
};

const ProjectsSection = () => {
  const [contributionAmount, setContributionAmount] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectProgresses, setProjectProgresses] = useState<
    Record<number, number>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({});
  const [projects, setProjects] = useState<Project[]>(loadProjects());

  const visibleProjects = projects.slice(
    currentProjectIndex,
    currentProjectIndex + 3
  );

  // Salva i progetti in localStorage quando cambiano
  useEffect(() => {
    localStorage.setItem("carbonProjects", JSON.stringify(projects));
  }, [projects]);

  // Calcola i token rimanenti necessari per completare il progetto
  const calculateRemainingTokens = (
    project: Project,
    progress: number | bigint
  ) => {
    const progressNumber =
      typeof progress === "bigint" ? Number(progress) : progress || 0;
    const totalContributed = (progressNumber * project.tokens) / 100;
    return Math.max(0, Math.floor(project.tokens - totalContributed));
  };

  // Verifica connessione wallet al caricamento
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Ascolta i cambiamenti dell'account
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

  useEffect(() => {
    const fetchProjectProgresses = async () => {
      try {
        const contract = await getContract();
        const progresses: Record<number, number> = {};
        for (const project of projects) {
          progresses[project.id] = await contract.getProjectProgress(
            project.id
          );
        }
        setProjectProgresses(progresses);
      } catch (error) {
        console.error("Errore nel recupero dei progressi:", error);
      }
    };

    if (walletConnected) {
      fetchProjectProgresses();
    }
  }, [walletConnected]);

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
      setError("MetaMask non trovato! Installa MetaMask per continuare.");
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletConnected(true);
      setAccount(accounts[0]);
      setError("");
    } catch (err: any) {
      setError("Errore nella connessione al wallet: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContribute = async () => {
    if (!walletConnected) {
      await connectWallet();
      return;
    }

    if (!selectedProject || contributionAmount <= 0) {
      setError("Seleziona un progetto e inserisci una quantità valida");
      return;
    }

    const currentProgress = projectProgresses[selectedProject.id] || 0;
    if (currentProgress >= 100) {
      setError("Questo progetto è già completato");
      return;
    }

    const remainingTokens = calculateRemainingTokens(
      selectedProject,
      currentProgress
    );
    if (contributionAmount <= 0 || contributionAmount > remainingTokens) {
      setError(`Inserisci una quantità valida (max ${remainingTokens} token)`);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
      const provider = new ethers.BrowserProvider(window.ethereum);

      const contract = await getContract();
      const balance = await contract.balanceOf(account);

      if (balance < contributionAmount) {
        setError("Non hai abbastanza token per questa contribuzione");
        return;
      }

      const result = await contributeToProject(
        provider,
        selectedProject.id,
        contributionAmount
      );

      // Rimuovi .wait() e usa direttamente result
      const updatedProgress = await contract.getProjectProgress(
        selectedProject.id
      );
      setProjectProgresses((prev) => ({
        ...prev,
        [selectedProject.id]: updatedProgress,
      }));

      setSelectedProject(null);
      setContributionAmount(0);
      setSuccessMessage(
        `Contribuzione di ${contributionAmount} token effettuata con successo`
      );
    } catch (error: any) {
      console.error("Errore nella contribuzione:", error);
      setError("Errore nella contribuzione: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Aggiungi nel componente
  const handleRemoveProject = async (projectId: number) => {
    if (!walletConnected) {
      await connectWallet();
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = await getContract();

      // Chiama la funzione di rimozione nel contratto
      const tx = await contract.removeProject(projectId);
      await tx.wait();

      // Rimuovi il progetto localmente
      setProjects((prev) => prev.filter((p) => p.id !== projectId));

      alert("Progetto eliminato con successo");
    } catch (error: any) {
      console.error("Errore nell'eliminazione del progetto:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async () => {
    // Controlla se il wallet è connesso
    if (!walletConnected) {
      await connectWallet();
      return;
    }

    // Validazione dei campi
    if (!newProject.title) {
      setError("Il titolo del progetto è obbligatorio");
      return;
    }

    if (!newProject.description) {
      setError("La descrizione del progetto è obbligatoria");
      return;
    }

    if (!newProject.tokens || newProject.tokens <= 0) {
      setError("Inserisci un numero valido di token richiesti");
      return;
    }

    if (!newProject.co2) {
      setError("Inserisci la riduzione di CO2");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = await getContract();

      // Converti i dati nel formato richiesto dal contratto
      const tx = await contract.createProject(
        newProject.title,
        newProject.tokens,
        parseInt(newProject.co2.replace("kg", "") || "0"), // Rimuovi 'kg' se presente
        ethers.parseUnits("0.1", "ether") // Prezzo di esempio
      );

      const receipt = await tx.wait();

      // Aggiungi il nuovo progetto alla lista
      const newProjectId = projects.length + 1;
      setProjects((prev) => [
        ...prev,
        {
          id: newProjectId,
          title: newProject.title || "",
          description: newProject.description || "",
          tokens: newProject.tokens || 0, // Valore di default
          co2: newProject.co2 || "0kg",
          price: newProject.co2
            ? parseInt(newProject.co2.replace("kg", "")) * 100
            : 0,
          location: newProject.location || "Sconosciuto",
        },
      ]);

      // Reset stato
      setNewProject({
        title: "",
        description: "",
        co2: "",
        location: "",
      });
      setIsAddingProject(false);

      // Mostra messaggio di successo
      setSuccessMessage("Nuovo progetto creato con successo!");
    } catch (error: any) {
      console.error("Errore nell'aggiunta del progetto:", error);
      setError(`Errore nell'aggiunta del progetto: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  const navigateProjects = (direction: "next" | "prev") => {
    if (direction === "next") {
      // Assicurati di non andare oltre la fine dei progetti
      setCurrentProjectIndex((prev) =>
        prev + 3 < projects.length ? prev + 1 : 0
      );
    } else {
      // Assicurati di non andare sotto zero
      setCurrentProjectIndex((prev) =>
        prev > 0 ? prev - 1 : Math.max(0, projects.length - 3)
      );
    }
  };

  return (
    <section className="py-20 bg-green-50">
      <div className="max-w-7xl mx-auto px-4">
        {(error || successMessage) && (
          <div
            className={`fixed top-0 left-0 w-full py-3 text-center font-medium z-50 ${
              error ? "bg-red-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            {error || successMessage}
            <button
              className="ml-4 px-3 py-1 bg-white text-black rounded-full font-bold"
              onClick={() => {
                setError("");
                setSuccessMessage("");
              }}
            >
              ✕
            </button>
          </div>
        )}

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-green-800 mb-6">
            Progetti Disponibili
          </h2>
          <p className="text-lg text-green-600">
            Scegli tra una selezione di progetti verificati e trasparenti per
            compensare la tua impronta di carbonio
          </p>
        </div>

        {/* Bottone Aggiungi Progetto */}
        {walletConnected && (
          <div className="text-center mb-8">
            <button
              onClick={() => setIsAddingProject(true)}
              className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
            >
              Aggiungi Nuovo Progetto
            </button>
          </div>
        )}

        {/* Navigazione Progetti */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigateProjects("prev")}
            className="bg-green-500 text-white p-2 rounded-full"
          >
            ←
          </button>
          <button
            onClick={() => navigateProjects("next")}
            className="bg-green-500 text-white p-2 rounded-full"
          >
            →
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {visibleProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-green-800">
                    {project.title}
                  </h3>
                  <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                    <span className="text-green-600 font-medium">
                      {project.location}
                    </span>
                  </div>
                </div>

                <p className="text-green-600 mb-6">{project.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-600">
                      Token Richiesti
                    </div>
                    <div className="text-lg font-semibold text-green-800">
                      {project.tokens} CRBN
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-600">CO₂ Compensata</div>
                    <div className="text-lg font-semibold text-green-800">
                      {project.co2}
                    </div>
                  </div>
                </div>

                {/* Barra di progresso */}
                <div className="w-full bg-green-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${projectProgresses[project.id] || 0}%`,
                    }}
                  ></div>
                </div>
                <div className="text-sm text-green-600 mb-4">
                  Progresso: {projectProgresses[project.id] || 0}%
                </div>

                <div className="flex flex-col items-center gap-3 mt-4">
                  <button
                    onClick={() => setSelectedProject(project)}
                    disabled={projectProgresses[project.id] >= 100}
                    className={`px-6 py-2 rounded-full font-medium transform hover:scale-105 transition-all duration-200 ${
                      projectProgresses[project.id] >= 100
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {projectProgresses[project.id] >= 100
                      ? "Completato"
                      : "Contribuisci"}
                  </button>
                </div>

                <div className="p-4 flex justify-between items-center">
                  <button
                    onClick={() => handleRemoveProject(project.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
                  >
                    Elimina Progetto
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Aggiungi Progetto */}
        {isAddingProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-black mb-4">
                Aggiungi Nuovo Progetto
              </h3>
              <input
                type="text"
                placeholder="Titolo del Progetto"
                value={newProject.title || ""}
                onChange={(e) =>
                  setNewProject((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-3 border border-gray-400 rounded-lg mb-4 bg-white text-black"
              />
              <textarea
                placeholder="Descrizione"
                value={newProject.description || ""}
                onChange={(e) =>
                  setNewProject((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-400 rounded-lg mb-4 bg-white text-black"
              />
              <input
                type="number"
                placeholder="Token Richiesti"
                value={newProject.tokens || ""}
                onChange={(e) => {
                  const tokenValue = Number(e.target.value);
                  setNewProject((prev) => ({
                    ...prev,
                    tokens: Number(e.target.value),
                    co2: tokenValue ? `${tokenValue * 100}kg` : "",
                  }));
                }}
                className="w-full p-3 border border-gray-400 rounded-lg mb-4 bg-white text-black"
              />
              <input
                type="text"
                placeholder="CO2 Ridotta (in kg)"
                value={newProject.co2 || ""}
                disabled
                onChange={(e) =>
                  setNewProject((prev) => ({ ...prev, co2: e.target.value }))
                }
                className="w-full p-3 border border-gray-400 rounded-lg mb-4 bg-white text-black"
              />
              <select
                value={newProject.location || ""}
                onChange={(e) =>
                  setNewProject((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-400 rounded-lg mb-4 bg-white text-black"
              >
                <option value="">Seleziona Posizione</option>
                <option value="Europa">Europa</option>
                <option value="Africa">Africa</option>
                <option value="America Del Nord">America Del Nord</option>
                <option value="America Del Sud">America Del Sud</option>
                <option value="Asia">Asia</option>
                <option value="Oceania">Oceania</option>
                <option value="Globale">Globale</option>
              </select>
              <div className="flex justify-between">
                <button
                  onClick={() => setIsAddingProject(false)}
                  className="px-6 py-2 bg-gray-300 text-black rounded-full"
                >
                  Annulla
                </button>
                <button
                  onClick={handleAddProject}
                  disabled={loading}
                  className="px-6 py-2 bg-green-500 text-white rounded-full"
                >
                  {loading ? "Creazione..." : "Crea Progetto"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal per il contributo */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                Contribuisci a {selectedProject.title}
              </h3>
              {!walletConnected ? (
                <div className="text-center">
                  <p className="text-green-600 mb-4">
                    Connetti il tuo wallet per contribuire
                  </p>
                  <button
                    onClick={connectWallet}
                    disabled={loading}
                    className="px-6 py-2 bg-green-500 text-white rounded-full"
                  >
                    {loading ? "Connessione..." : "Connetti Wallet"}
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-black mb-6">
                    Inserisci il numero di token con cui vuoi contribuire
                  </p>
                  <input
                    type="number"
                    value={contributionAmount}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      const maxContribution =
                        selectedProject.tokens -
                        (Number(projectProgresses[selectedProject.id] || 0) /
                          100) *
                          selectedProject.tokens;
                      setContributionAmount(Math.min(value, maxContribution));
                    }}
                    className="w-full p-3 text-black border border-green-200 rounded-lg mb-4"
                    placeholder="Numero di token"
                    min="1"
                    max={
                      selectedProject.tokens -
                      (Number(projectProgresses[selectedProject.id] || 0) /
                        100) *
                        selectedProject.tokens
                    }
                    disabled={loading}
                  />
                  <div className="text-sm text-green-600 mb-4">
                    Token rimanenti necessari:{" "}
                    {calculateRemainingTokens(
                      selectedProject,
                      projectProgresses[selectedProject.id] || 0
                    )}
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full"
                      disabled={loading}
                    >
                      Annulla
                    </button>
                    <button
                      onClick={handleContribute}
                      disabled={loading}
                      className="px-6 py-2 bg-green-500 text-white rounded-full"
                    >
                      {loading ? "In elaborazione..." : "Conferma Contributo"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
