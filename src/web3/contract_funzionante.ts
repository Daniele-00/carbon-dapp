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
  
  // Calcola il prezzo totale
  const TOKEN_PRICE = await contract.TOKEN_PRICE();
  const totalPrice = TOKEN_PRICE * BigInt(tokenAmount);

  // Invia la transazione
  const tx = await contract.buyTokens(tokenAmount, { 
    value: totalPrice.toString() 
  });
  await tx.wait();
  return tx;
}




// Funzione per contribuire a un progetto
export async function contributeToProject(
  provider: ethers.BrowserProvider,
  projectId: number,
  tokenAmount: number
) {
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  
  const tx = await contract.compensateProject(projectId, tokenAmount);
  await tx.wait();
  return tx;
}

export async function recordUserEmissions(
  provider: ethers.BrowserProvider,
  electricity: number,
  carKm: number,
  flights: number,
  meatConsumption: number
) {
  const contract = await getContract();
  const tx = await contract.recordEmissions(
    electricity,
    carKm,
    flights,
    meatConsumption
  );
  await tx.wait();
  return tx;
}
// Funzione per ottenere lo stato di avanzamento del progetto
export async function getProjectProgress(projectId: number) {
  const contract = await getContract();
  return contract.getProjectProgress(projectId);
}

// Funzione per calcolare i token necessari per compensare una certa quantità di CO₂
export async function calculateTokensNeeded(co2Amount: number) {
  const contract = await getContract();
  return contract.calculateEmissions(co2Amount);
}