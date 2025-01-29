//Componente per la sezione CTA per la homepage
"use client"

import React from 'react';
import { useRouter } from 'next/navigation';

const CTASection = () => {
  const router = useRouter();
  const handleCalculateClick = () => {
    // Reindirizza alla pagina di calcolo dell'impronta
    router.push('/calculator');
  };

  const handleProjectClick = () => {
    // Reindirizza alla pagina di esplorazione dei progetti
    router.push('/marketplace');
  };
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="absolute inset-0 bg-green-900/20 backdrop-blur-[2px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Pronto a Fare la Differenza?
          </h2>
          
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Unisciti a migliaia di persone che stanno già contribuendo a un futuro più sostenibile. 
            Calcola la tua impronta di carbonio e inizia il tuo percorso verso la neutralità.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button
              onClick={handleCalculateClick}
              className="px-8 py-4 bg-white text-green-700 rounded-full font-medium hover:bg-green-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Calcola la tua Impronta
            </button>
            
            <button onClick={handleProjectClick} 
            className="px-8 py-4 border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-all duration-200">
              Esplora i Progetti
            </button>
          </div>

          {/* Facoltativo */}
          <div className="pt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center text-white">
                <div className="text-4xl mb-2">🔒</div>
                <div className="text-sm">Blockchain Verificata</div>
              </div>
              <div className="flex flex-col items-center text-white">
                <div className="text-4xl mb-2">🌿</div>
                <div className="text-sm">Progetti Certificati</div>
              </div>
              <div className="flex flex-col items-center text-white">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-sm">Token Sicuri</div>
              </div>
              <div className="flex flex-col items-center text-white">
                <div className="text-4xl mb-2">🤝</div>
                <div className="text-sm">Community Attiva</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;