# Carbon2D - DApp per la Compensazione di CO2

Carbon2D è una DApp (Decentralized Application) che permette agli utenti di calcolare la propria impronta di carbonio e compensarla attraverso progetti sostenibili sulla blockchain.

## Prerequisiti

Prima di iniziare, assicurati di avere installato:

- Node.js (versione 14.0 o superiore)
- npm (Node Package Manager)
- MetaMask o un altro wallet Ethereum nel browser
- Un account sulla Sepolia TestNet con alcuni ETH di test

## Configurazione

1. Clona il repository:
```bash
git clone [url-del-repository]
cd carbon2d
```

2. Installa le dipendenze:
```bash
npm install
```

3. Configura il wallet:
- Installa l'estensione MetaMask nel tuo browser
- Connettiti alla Sepolia TestNet
- Assicurati di avere degli ETH di test (puoi ottenerli da un faucet Sepolia)

## Avvio del Progetto

1. Avvia il server di sviluppo:
```bash
npm run dev
```

2. Apri [http://localhost:3000](http://localhost:3000) nel tuo browser

## Struttura del Progetto

- `app/` - Contiene le pagine principali dell'applicazione
- `components/` - Componenti React riutilizzabili
- `web3/` - Configurazione e funzioni per l'interazione con la blockchain
- `lib/` - Utility e funzioni di supporto

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
- Blockchain: Ethereum (Sepolia TestNet)
- Smart Contract: Solidity
- Web3 Library: ethers.js

## Test con Ganache (Rete Locale)

Se desideri testare l'applicazione su una blockchain locale:

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
- Assicurati di essere connesso alla rete Ganache
- Esegui il deploy dello smart contract sulla rete locale:
```bash
# Comando per il deploy (personalizza in base al tuo setup)
npx hardhat run scripts/deploy.js --network localhost
```
- Aggiorna l'indirizzo del contratto in `web3/config.js`