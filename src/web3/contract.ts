"use client";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./config";

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Funzione per ottenere il contratto connesso al wallet
export async function getContract() {
  if (!window.ethereum) throw new Error("MetaMask non trovato");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

// Funzione per acquistare i token Carbon2D
export async function buyCarbon2DTokens(
  provider: ethers.BrowserProvider,
  tokenAmount: number
) {
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
 
  const userAddress = await signer.getAddress();
 
  // Calcola il prezzo totale
  const TOKEN_PRICE = await contract.TOKEN_PRICE();
  const totalPrice = TOKEN_PRICE * BigInt(tokenAmount);
 
  // Verifica il saldo dell'utente
  const userBalance = await provider.getBalance(userAddress);
  if (userBalance < totalPrice) {
    throw new Error("Saldo ETH insufficiente per acquistare i token.");
  }
 
  // Invia la transazione di acquisto token
  const tx = await contract.buyTokens(tokenAmount, {
    value: totalPrice.toString(),
  });
  await tx.wait();
  return tx;
}

export async function contributeToProject(
  provider: ethers.BrowserProvider,
  projectId: number,
  tokenAmount: number
) {
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  const userAddress = await signer.getAddress();
  try {
    const project = await contract.projects(projectId);
    const progress = await contract.getProjectProgress(projectId);
    if (!project.active) {
      throw new Error("Il progetto non è attivo");
    }
    const remainingTokens = project.requiredTokens - project.totalContributed;
   
    if (remainingTokens <= 0 || progress >= 100) {
      throw new Error("Il progetto è già completato");
    }
    if (tokenAmount > remainingTokens) {
      throw new Error(`Puoi contribuire al massimo con ${remainingTokens} token rimanenti`);
    }
    const userBalance = await contract.balanceOf(userAddress);
    if (userBalance < BigInt(tokenAmount)) {
      throw new Error("Saldo token insufficiente");
    }
    const tx = await contract.compensateProject(projectId, tokenAmount);
    const receipt = await tx.wait();
    return {
      success: true,
      transactionHash: receipt.hash,
      tokensContributed: tokenAmount
    };
  } catch (error: any) {
    throw new Error(error.reason || error.message || "Errore sconosciuto durante il contributo al progetto");
  }
}

// Per creare un nuovo progetto, modificheremo la chiamata
export async function createNewProject(
  provider: ethers.BrowserProvider,
  title: string,
  requiredTokens: number,
  co2Reduction: number
) {
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  try {
    const tx = await contract.createProject(
      title,
      requiredTokens,
      co2Reduction
    );
    const receipt = await tx.wait();
    return {
      success: true,
      transactionHash: receipt.hash,
      projectDetails: { title, requiredTokens, co2Reduction }
    };
  } catch (error: any) {
    throw new Error(error.reason || error.message || "Errore nella creazione del progetto");
  }
}

// Le altre funzioni rimangono invariate
export async function recordUserEmissions(
  electricity: number,
  carKm: number,
  flights: number,
  meatConsumption: number
) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
 
  const tx = await contract.recordEmissions(
    electricity,
    carKm,
    flights,
    meatConsumption
  );
 
  await tx.wait();
  return tx;
}

export async function getProjectProgress(projectId: number) {
  const contract = await getContract();
  return contract.getProjectProgress(projectId);
}

export async function calculateTokensNeeded(co2Amount: number) {
  const contract = await getContract();
  return contract.calculateEmissions(co2Amount);
}