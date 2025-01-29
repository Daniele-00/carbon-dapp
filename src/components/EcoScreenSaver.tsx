//Componente per lo screensaver con animazioni 
import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import ecoAnimation1 from "../animations/Animation1.json";
import ecoAnimation2 from "../animations/Animation2.json";
import ecoAnimation3 from "../animations/Animation3.json";


const EcoScreensaver = () => {
  const animations = [ecoAnimation1, ecoAnimation2, ecoAnimation3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false); // Stato per gestire la transizione

  useEffect(() => {
    const interval = setInterval(() => {
      // Avvia transizione di uscita
      setIsTransitioning(true);

      setTimeout(() => {
        // Cambia indice dopo l'uscita
        setCurrentIndex((prevIndex) => (prevIndex + 1) % animations.length);
        setIsTransitioning(false); // Fine transizione
      }, 1000); // La durata della transizione (1s)
    }, 15000); // Cambia ogni 15 secondi
    return () => clearInterval(interval);
  }, [animations.length]);

  return (
    <div className="relative w-full h-full flex justify-center items-center bg-gradient-to-r from-green-400 to-emerald-600 rounded-3xl shadow-lg overflow-hidden">
     
        <Lottie
          animationData={animations[currentIndex]}
          loop={true}
          className="w-full h-full max-w-lg"
        />
     
    </div>
  );
};

export default EcoScreensaver;
