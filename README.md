# Carbon2D - DApp per la Compensazione di CO2

Carbon2D è una DApp (Decentralized Application) che permette agli utenti di calcolare la propria impronta di carbonio e compensarla attraverso progetti sostenibili sulla blockchain.

## Prerequisiti

Prima di iniziare, assicurati di avere installato:

- Node.js (versione 20.12.2)
- npm (Node Package Manager)
- MetaMask 

## Configurazione

1. Clona il repository:
```bash
git clone https://github.com/Daniele-00/carbon-dapp.git
cd carbon-dapp
```

2. Installa le dipendenze:
```bash
npm install
```

## Esecuzione su Sepolia TestNet (Consigliato)

1. Configura MetaMask per Sepolia:
- Installa l'estensione MetaMask nel tuo browser
- Seleziona la rete "Sepolia Test Network" da MetaMask
- Ottieni ETH di test da un faucet Sepolia (https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

2. Deploy dello Smart Contract:
- Vai su [Remix IDE](https://remix.ethereum.org)
- Importa il file dello smart contract
- Seleziona la versione del compilatore 0.8.26
- Seleziona l'ambiente "Injected Provider - MetaMask"
- Assicurati di essere connesso alla rete Sepolia in MetaMask
- Compila e deploya il contratto
- Copia l'ABI e l'indirizzo del contratto deployato e aggiornali in `web3/config.ts`

3. Avvia l'applicazione:
```bash
npm run dev
```

4. Apri [http://localhost:3000](http://localhost:3000) nel tuo browser

## Esecuzione su Rete Locale (Alternativa)

Se preferisci testare l'applicazione su una blockchain locale:

1. Installa e avvia Ganache:
```bash
npm install -g ganache
ganache
```

2. Configura MetaMask per Ganache:
- Apri MetaMask
- Vai su "Aggiungi rete"
- Aggiungi una nuova rete con i seguenti parametri:
  - Nome rete: Ganache
  - RPC URL: http://127.0.0.1:8545
  - Chain ID: 1337
  - Simbolo moneta: ETH

3. Importa un account da Ganache su MetaMask:
- Copia la chiave privata di uno degli account in Ganache
- In MetaMask, clicca su "Importa account"
- Incolla la chiave privata

4. Deploy dello Smart Contract:
- Vai su [Remix IDE](https://remix.ethereum.org)
- Importa il file dello smart contract
- Seleziona la versione del compilatore 0.8.22
- Seleziona l'ambiente "Injected Provider - MetaMask"
- Assicurati di essere connesso alla rete Ganache in MetaMask
- Compila e deploya il contratto
- Copia l'ABI e l'indirizzo del contratto deployato e aggiornali in `web3/config.ts`

5. Avvia l'applicazione:
```bash
npm run dev
```

## Struttura del Progetto

- `app/` - Contiene le pagine principali dell'applicazione
- `components/` - Componenti React riutilizzabili
- `web3/` - Configurazione e funzioni per l'interazione con la blockchain

## Funzionalità Principali

- Calcolo dell'impronta di carbonio
- Acquisto di token C2D
- Creazione e gestione di progetti di compensazione
- Contribuzione a progetti esistenti
- Dashboard per il monitoraggio delle attività

## Note Tecniche

- Framework: Next.js
- Linguaggio: TSX (TypeScript + JSX)
- Styling: Tailwind CSS
- Blockchain: Ethereum (Sepolia TestNet o rete locale)
- Smart Contract: Solidity
- Web3 Library: ethers.js
