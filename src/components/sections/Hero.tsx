//Componente per la sezione Hero per la homepage dove viene presentata la piattaforma

import React from 'react';
import EcoScreensaver from '@/components/EcoScreenSaver';
const HeroSection = () => {
  return (
    <section className="pt-24 lg:pt-32 pb-16 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Descrizione*/}
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold">
              <span className="block text-green-800">Trasforma il tuo</span>
              <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Impatto Ambientale
              </span>
            </h1>
            
            <p className="text-lg text-green-700 leading-relaxed max-w-xl">
              Calcola, monitora e compensa la tua impronta di carbonio attraverso 
              progetti verificati sulla blockchain. Unisciti alla rivoluzione verde.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              onClick={() => document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' })}>
                Inizia Ora
              </button>
              <button className="px-8 py-4 border-2 border-green-500 text-green-600 rounded-full font-medium hover:bg-green-50 transition-all duration-200"
                onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}>
            
                Scopri di più
              </button>
            </div>

            {/* Trust Indicators (abbellimento)*/}
            <div className="pt-8 border-t border-green-100">
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <div>
                    <div className="font-semibold text-green-800">100%</div>
                    <div className="text-sm text-green-600">Progetti Verificati</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <div className="font-semibold text-green-800">Sicuro</div>
                    <div className="text-sm text-green-600">Blockchain Based</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image/Illustration */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-3xl transform rotate-3"></div>
            <div className="relative">
              <EcoScreensaver />
  </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;