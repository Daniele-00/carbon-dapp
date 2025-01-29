try {
  setLoading(true);
  setError("");
  const provider = new ethers.BrowserProvider(window.ethereum);

  const result = await contributeToProject(
    provider,
    selectedProject.id,
    contributionAmount
  );

  const contract = await getContract();
  const updatedProgress = await contract.getProjectProgress(selectedProject.id);
  
  // Aggiorna i progressi specificamente per questo progetto
  setProjectProgresses(prev => ({
    ...prev,
    [selectedProject.id]: updatedProgress
  }));

  setSelectedProject(null);
  setContributionAmount(0);

  alert(`Contribuzione di ${contributionAmount} token effettuata con successo`);
} catch (error: any) {
  console.error("Errore nella contribuzione:", error);
  setError("Errore nella contribuzione: " + error.message);
} finally {
  setLoading(false);
}
};