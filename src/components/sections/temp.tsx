const handleAddProject = async () => {
    // ... (previous validation checks remain the same)
  
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");
  
      const provider = new ethers.BrowserProvider(window.ethereum);
  
      // Use the new createNewProject function
      const result = await createNewProject(
        provider,
        newProject.title || "",
        newProject.tokens || 0,
        parseInt(newProject.co2?.replace("kg", "") || "0")
      );
  
      // Aggiungi il nuovo progetto alla lista
      const newProjectId = projects.length + 1;
      setProjects((prev) => [
        ...prev,
        {
          id: newProjectId,
          title: newProject.title || "",
          description: newProject.description || "",
          tokens: newProject.tokens || 0,
          co2: newProject.co2 || "0kg",
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
      setError("Errore nell'aggiunta del progetto: " + error.message);
    } finally {
      setLoading(false);
    }
  };