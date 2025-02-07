"use client";
import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

// Import dinamico di Lottie
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false 
});

// Import dinamici per le animazioni
const animations = [
  () => import('../animations/Animation1.json'),
  () => import('../animations/Animation2.json'),
  () => import('../animations/Animation3.json')
];

const EcoScreensaver = () => {
  const [currentAnimation, setCurrentAnimation] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Carica l'animazione corrente
  useEffect(() => {
    animations[currentIndex]().then(animation => {
      setCurrentAnimation(animation.default);
    });
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % animations.length);
        setIsTransitioning(false);
      }, 1000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!currentAnimation) {
    return <div>Loading...</div>; // Placeholder mentre l'animazione carica
  }

  return (
    <div className="relative w-full h-full flex justify-center items-center bg-gradient-to-r from-green-400 to-emerald-600 rounded-3xl shadow-lg overflow-hidden">
      <Lottie
        animationData={currentAnimation}
        loop={true}
        className="w-full h-full max-w-lg"
      />
    </div>
  );
};

export default EcoScreensaver;