// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Carbon2D
 * @dev Contratto per la gestione di token di compensazione di CO2 e progetti ambientali
 * Eredita da ERC20 per la funzionalità dei token e Ownable per la gestione dei permessi
 */
contract Carbon2D is ERC20, Ownable {
    // Struttura che definisce un progetto di compensazione ambientale
    struct CompensationProject {
        string name;                // Nome del progetto
        uint256 requiredTokens;     // Numero di token necessari per completare il progetto
        uint256 co2Reduction;       // Quantità di CO2 che il progetto ridurrà (in kg)
        bool active;               // Stato del progetto (attivo/completato)
        uint256 totalContributed;  // Totale dei token già contribuiti
        address projectOwner;      // Indirizzo del creatore del progetto
    }

    // Struttura per memorizzare i dati dell'impronta di carbonio di un utente
    struct CarbonData {
        uint256 electricityConsumption;  // Consumo di elettricità
        uint256 carKilometers;          // Chilometri percorsi in auto
        uint256 flights;                // Numero di voli
        uint256 meatConsumption;        // Consumo di carne
        uint256 totalEmissions;         // Totale delle emissioni calcolate
        uint256 timestamp;              // Timestamp dell'ultima registrazione
        uint256 tokenPrice;             // Prezzo del token al momento della registrazione
    }

    // Prezzo fisso per ogni token (attualmente impostato a 0)
    uint256 public constant TOKEN_PRICE = 0.0125 ether;  

    // Mappature per memorizzare i dati degli utenti e dei progetti
    mapping(address => CarbonData) public userCarbonData;                    // Dati di carbonio per utente
    mapping(uint256 => CompensationProject) public projects;                 // Progetti disponibili
    mapping(uint256 => mapping(address => uint256)) public userContributions; // Contributi per progetto e utente
    uint256 public projectCounter;    // Contatore progressivo per gli ID dei progetti
    uint256 public totalMintedTokens; // Numero totale di token creati

    // Eventi emessi dal contratto per tracciare le azioni principali
    event TokensMinted(address indexed recipient, uint256 amount, uint256 emissions);
    event ProjectCreated(uint256 projectId, string name);
    event ProjectCompensated(uint256 projectId, address indexed user, uint256 tokens);
    event ProjectCompleted(uint256 projectId, address indexed projectOwner, uint256 tokens);

    /**
     * @dev Costruttore che inizializza il token con nome "Carbon2D" e simbolo "C2D"
     * Crea anche tre progetti predefiniti come esempi
     */
    constructor() ERC20("Carbon2D", "C2D") Ownable(msg.sender) {
        projectCounter = 0;
        totalMintedTokens = 0;
        // Crea i progetti iniziali con valori predefiniti
        _createProject("Riforestazione Amazzonica", 5, 500);
        _createProject("Energia Solare in Africa", 3, 300);
        _createProject("Turbine Eoliche", 8, 800);
    }

    /**
     * @dev Funzione interna per creare un nuovo progetto
     * @param name Nome del progetto
     * @param requiredTokens Token necessari per completarlo
     * @param co2Reduction Riduzione di CO2 prevista
     */
    function _createProject(
        string memory name,
        uint256 requiredTokens,
        uint256 co2Reduction
    ) internal {
        projectCounter++;
        projects[projectCounter] = CompensationProject(
            name,
            requiredTokens,
            co2Reduction,
            true,
            0,
            msg.sender
        );
        emit ProjectCreated(projectCounter, name);
    }


    // Funzione per creare un nuovo progetto (pubblica)
    function createProject(
        string memory name,
        uint256 requiredTokens,
        uint256 co2Reduction
    ) public {
        _createProject(name, requiredTokens, co2Reduction);
    }


    /**
     * @dev Permette agli utenti di acquistare token inviando ETH
     * @param tokenAmount Numero di token da acquistare
     */
    function buyTokens(uint256 tokenAmount) public payable {
        require(msg.value >= TOKEN_PRICE * tokenAmount, "Insufficient payment");
        _mint(msg.sender, tokenAmount);
        totalMintedTokens += tokenAmount;
        emit TokensMinted(msg.sender, tokenAmount, 0);
    }

    /**
     * @dev Registra le emissioni di CO2 di un utente
     * Calcola l'impronta di carbonio basata su vari fattori
     */
    function recordEmissions(
        uint256 electricityConsumption,
        uint256 carKilometers,
        uint256 flights,
        uint256 meatConsumption
    ) public {
        uint256 totalEmissions = calculateEmissions(
            electricityConsumption,
            carKilometers,
            flights,
            meatConsumption
        );

        userCarbonData[msg.sender] = CarbonData(
            electricityConsumption,
            carKilometers,
            flights,
            meatConsumption,
            totalEmissions,
            block.timestamp,
            TOKEN_PRICE
        );
    }

    /**
     * @dev Calcola le emissioni totali di CO2 basate su vari fattori
     * Usa fattori di conversione predefiniti per ogni tipo di attività
     */
    function calculateEmissions(
        uint256 electricityConsumption,
        uint256 carKilometers,
        uint256 flights,
        uint256 meatConsumption
    ) public pure returns (uint256) {
        // Fattori di conversione per calcolare le emissioni di CO2
        uint256 electricityFactor = 0.4 ether;   // kWh -> kg CO2
        uint256 carFactor = 0.2 ether;          // km -> kg CO2
        uint256 flightFactor = 200 ether;       // voli -> kg CO2
        uint256 meatFactor = 50 ether;          // kg carne -> kg CO2

        return (electricityConsumption * electricityFactor +
                carKilometers * carFactor +
                flights * flightFactor +
                meatConsumption * meatFactor) / 1 ether;
    }

    /**
     * @dev Permette agli utenti di contribuire token a un progetto
     * Quando un progetto raggiunge il target, viene completato e i token vengono
     * trasferiti al proprietario del progetto
     */
    function compensateProject(uint256 projectId, uint256 tokenAmount) public {
        require(projectId > 0 && projectId <= projectCounter, "Invalid project ID");
        require(projects[projectId].active, "Project not active");
        require(balanceOf(msg.sender) >= tokenAmount, "Insufficient tokens");

        CompensationProject storage project = projects[projectId];
        uint256 remainingTokens = project.requiredTokens - project.totalContributed;

        require(tokenAmount <= remainingTokens, "Exceeds remaining tokens");
        require(tokenAmount > 0, "Contribution must be greater than zero");

        // Trasferisce i token dall'utente al contratto
        _transfer(msg.sender, address(this), tokenAmount);
        project.totalContributed += tokenAmount;
        userContributions[projectId][msg.sender] += tokenAmount;

        emit ProjectCompensated(projectId, msg.sender, tokenAmount);

        // Se il progetto raggiunge il target, viene completato
        if (project.totalContributed >= project.requiredTokens) {
            project.active = false;
            _transfer(address(this), project.projectOwner, project.totalContributed);
            emit ProjectCompleted(projectId, project.projectOwner, project.totalContributed);
        }
    }

    /**
     * @dev Calcola la percentuale di completamento di un progetto
     */
    function getProjectProgress(uint256 projectId) public view returns (uint256) {
        CompensationProject memory project = projects[projectId];
        if (project.requiredTokens == 0) return 0;
        if (project.totalContributed >= project.requiredTokens) return 100;
        return (project.totalContributed * 100) / project.requiredTokens;
    }

    /**
     * @dev Permette al proprietario del contratto di prelevare gli ETH accumulati
     */
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

}